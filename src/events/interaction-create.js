import {
  Events,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} from "discord.js";
import {
  INPUT_IDS,
  EMBED_COLOR_SUCCESS,
  EMBED_COLOR_ERROR,
} from "../config/constants.js";
import {
  startVerification,
  verifyCode,
  resendVerification,
} from "../services/verification.js";
import { getGuildSettings } from "../services/guild-config.js";
import { assignVerifiedRole } from "../services/role-manager.js";
import { logVerification } from "../services/verification-log.js";
import {
  buildEnterCodeCustomId,
  buildResendCodeCustomId,
  buildVerifyEmailModalCustomId,
  buildVerifyCodeModalCustomId,
  parseStartVerificationCustomId,
  parseEnterCodeCustomId,
  parseResendCodeCustomId,
  parseVerifyEmailModalCustomId,
  parseVerifyCodeModalCustomId,
  parseRoleIds,
} from "../utils/verify-button.js";

export const name = Events.InteractionCreate;
export const once = false;

const START_REASON_MESSAGES = {
  invalid_format:
    "That doesn't look like a valid email address. Click Verify to try again.",
  domain_not_approved: (ctx) =>
    `\`${ctx.domain}\` isn't an approved domain for this server. Contact a mod if you think that's wrong.`,
  already_verified: (ctx) => `You're already verified as **${ctx.email}**.`,
  too_many_requests:
    "You have too many pending verification attempts. Wait for one to expire, then try again.",
};

const CODE_REASON_MESSAGES = {
  no_pending_request:
    "You don't have a pending verification. Click Verify to start again.",
  expired: "That code expired. Click Verify to get a new one.",
  too_many_attempts:
    "Too many incorrect attempts. Click Verify to get a new code.",
  incorrect_code: "That code is incorrect.",
};

function buildEmailModal(roleIds) {
  const modal = new ModalBuilder()
    .setCustomId(buildVerifyEmailModalCustomId(roleIds))
    .setTitle("Email verification");

  const emailInput = new TextInputBuilder()
    .setCustomId(INPUT_IDS.EMAIL)
    .setLabel("Your email address")
    .setPlaceholder("you@ucsd.edu")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder().addComponents(emailInput));
  return modal;
}

function buildCodeModal(roleIds) {
  const modal = new ModalBuilder()
    .setCustomId(buildVerifyCodeModalCustomId(roleIds))
    .setTitle("Enter verification code");

  const codeInput = new TextInputBuilder()
    .setCustomId(INPUT_IDS.CODE)
    .setLabel("Verification code")
    .setPlaceholder("123456")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder().addComponents(codeInput));
  return modal;
}

function buildCodeSentComponents(roleIds) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(buildEnterCodeCustomId(roleIds))
      .setLabel("Enter Code")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(buildResendCodeCustomId(roleIds))
      .setLabel("Resend Email")
      .setStyle(ButtonStyle.Secondary),
  );
}

async function resolveRoleIds(guildId, fromCustomId) {
  if (fromCustomId?.length) return fromCustomId;
  const settings = await getGuildSettings(guildId);
  return parseRoleIds(settings.verifiedRoleId);
}

/**
 * Attaches error handling to a fire-and-forget email send. `respond` is
 * called with the failure message if the send fails — the caller
 * supplies however it wants that surfaced (followUp, editReply, etc.),
 * since the right method depends on what's already been sent back to
 * Discord by the time this resolves.
 */
function reportEmailFailures(emailPromise, respond) {
  emailPromise.catch(async (err) => {
    console.error("Failed to send verification email:", err);
    try {
      await respond();
    } catch (followUpErr) {
      console.error(
        "Failed to notify user of email send failure:",
        followUpErr,
      );
    }
  });
}

export async function execute(interaction) {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`Error executing /${interaction.commandName}:`, err);
      if (interaction.deferred || interaction.replied) {
        await interaction
          .editReply({ content: "Something went wrong running that command." })
          .catch(() => {});
      } else {
        await interaction
          .reply({
            content: "Something went wrong running that command.",
            flags: MessageFlags.Ephemeral,
          })
          .catch(() => {});
      }
    }
    return;
  }

  // Member clicked the "Verify" button on the message an admin posted
  // with /verify.
  if (interaction.isButton()) {
    const start = parseStartVerificationCustomId(interaction.customId);
    if (start) {
      const roleIds = await resolveRoleIds(interaction.guildId, start.roleIds);
      await interaction.showModal(buildEmailModal(roleIds));
      return;
    }

    const enter = parseEnterCodeCustomId(interaction.customId);
    if (enter) {
      const roleIds = await resolveRoleIds(interaction.guildId, enter.roleIds);
      await interaction.showModal(buildCodeModal(roleIds));
      return;
    }

    const resend = parseResendCodeCustomId(interaction.customId);
    if (resend) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const result = await resendVerification(
        interaction.guildId,
        interaction.user.id,
      );

      if (!result.ok) {
        const embed = new EmbedBuilder()
          .setColor(EMBED_COLOR_ERROR)
          .setDescription(
            CODE_REASON_MESSAGES[result.reason] ?? "Couldn't resend a code.",
          );
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(EMBED_COLOR_SUCCESS)
        .setDescription(`Sent a new code to **${result.email}**.`);
      await interaction.editReply({ embeds: [embed] });

      reportEmailFailures(result.emailPromise, () =>
        interaction.followUp({
          content:
            "That resend actually failed to send. Try Resend Email again in a bit.",
          flags: MessageFlags.Ephemeral,
        }),
      );
      return;
    }
  }

  // STEP 1: email submitted. A modal submission's only response can be a
  // plain reply/defer — Discord does not allow chaining straight into a
  // second showModal() from here — so we reply with an "email sent"
  // message and let the member open the code modal themselves via a
  // button, rather than opening it for them.
  if (interaction.isModalSubmit()) {
    const emailModal = parseVerifyEmailModalCustomId(interaction.customId);
    if (emailModal) {
      const email = interaction.fields.getTextInputValue(INPUT_IDS.EMAIL);
      const roleIds = await resolveRoleIds(
        interaction.guildId,
        emailModal.roleIds,
      );

      let result;
      try {
        result = await startVerification(
          interaction.guildId,
          interaction.user.id,
          email,
        );
      } catch (err) {
        console.error("Error starting verification:", err);
        await interaction.reply({
          content:
            "Couldn't send the verification email right now. Please try again in a bit.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (!result.ok) {
        const messageOrFn = START_REASON_MESSAGES[result.reason];
        const message =
          typeof messageOrFn === "function" ? messageOrFn(result) : messageOrFn;
        await interaction.reply({
          content: message ?? "Verification couldn't be started.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(EMBED_COLOR_SUCCESS)
        .setDescription(
          `Verification email sent to **${result.request.email}**.\n\nCheck your spam folder if you don't see it.`,
        );

      await interaction.reply({
        embeds: [embed],
        components: [buildCodeSentComponents(roleIds)],
        flags: MessageFlags.Ephemeral,
      });

      reportEmailFailures(result.emailPromise, () =>
        interaction.followUp({
          content:
            "That verification email actually failed to send. Click Resend Email to try again.",
          flags: MessageFlags.Ephemeral,
        }),
      );
      return;
    }

    // STEP 2: code submitted — verify it and assign the role(s).
    const codeModal = parseVerifyCodeModalCustomId(interaction.customId);
    if (codeModal) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const code = interaction.fields.getTextInputValue(INPUT_IDS.CODE);
      const result = await verifyCode(
        interaction.guildId,
        interaction.user.id,
        code,
      );

      if (!result.ok) {
        const embed = new EmbedBuilder()
          .setColor(EMBED_COLOR_ERROR)
          .setDescription(
            CODE_REASON_MESSAGES[result.reason] ?? "Verification failed.",
          );
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      const roleIds = await resolveRoleIds(
        interaction.guildId,
        codeModal.roleIds,
      );
      await assignVerifiedRole(interaction.guild, interaction.user.id, roleIds);

      await logVerification({
        guild: interaction.guild,
        user: interaction.user,
        email: result.email,
        roleId: roleIds.join(",") || null,
      });

      const embed = new EmbedBuilder()
        .setColor(EMBED_COLOR_SUCCESS)
        .setDescription(`You're verified as **${result.email}**. Welcome!`);
      await interaction.editReply({ embeds: [embed] });
    }
  }
}
