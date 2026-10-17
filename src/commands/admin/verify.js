import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChannelType,
  MessageFlags,
} from "discord.js";
import { requireGuildAdmin } from "../../utils/permissions.js";
import { EMBED_COLOR, EMBED_COLOR_ERROR } from "../../config/constants.js";
import {
  setVerifiedRoles,
  addDomain,
  getApprovedDomains,
  getGuildSettings,
} from "../../services/guild-config.js";
import {
  buildStartVerificationCustomId,
  parseRoleIds,
} from "../../utils/verify-button.js";

export const data = new SlashCommandBuilder()
  .setName("verify")
  .setDescription(
    "Post a verification message with a button that starts the verify flow",
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Channel to post in (defaults to this channel)")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false),
  )
  .addStringOption((option) =>
    option.setName("title").setDescription("Embed title").setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("description")
      .setDescription("Embed description")
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("button_label")
      .setDescription("Label on the verify button")
      .setRequired(false)
      .setMaxLength(80),
  )
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("Role to grant on successful verification")
      .setRequired(false),
  )
  .addRoleOption((option) =>
    option
      .setName("role2")
      .setDescription("Optional second role to grant")
      .setRequired(false),
  )
  .addRoleOption((option) =>
    option
      .setName("role3")
      .setDescription("Optional third role to grant")
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("domain")
      .setDescription("Approve an email domain for this server (e.g. ucsd.edu)")
      .setRequired(false),
  );

export async function execute(interaction) {
  if (!(await requireGuildAdmin(interaction))) return;

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const channel =
    interaction.options.getChannel("channel") ?? interaction.channel;
  const title =
    interaction.options.getString("title") ?? "Verify your membership";
  const description =
    interaction.options.getString("description") ??
    "Click the button below to verify with your email.";
  const buttonLabel = interaction.options.getString("button_label") ?? "Verify";

  const roles = ["role", "role2", "role3"]
    .map((name) => interaction.options.getRole(name))
    .filter(Boolean);

  // Deduplicate by id while preserving order.
  const roleIds = [...new Set(roles.map((role) => role.id))];

  if (roleIds.length) {
    await setVerifiedRoles(interaction.guildId, roleIds);
  }

  const domainOption = interaction.options.getString("domain");
  if (domainOption) {
    await addDomain(interaction.guildId, domainOption);
  }

  const approvedDomains = await getApprovedDomains(interaction.guildId);
  if (!approvedDomains.length) {
    await interaction.editReply({
      content:
        "No approved email domains yet. Pass `domain:ucsd.edu` (or use `/add-domain`) before posting.",
    });
    return;
  }

  if (!roleIds.length) {
    // Fall back to whatever is already stored for the guild so re-posts
    // of the verify message keep working without re-picking roles.
    const settings = await getGuildSettings(interaction.guildId);
    const existing = parseRoleIds(settings.verifiedRoleId);
    if (!existing.length) {
      await interaction.editReply({
        content:
          "No verified role configured. Pass `role:` (or use `/set-role`) before posting.",
      });
      return;
    }
    roleIds.push(...existing);
  }

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle(title)
    .setDescription(description);

  const button = new ButtonBuilder()
    .setCustomId(buildStartVerificationCustomId(roleIds))
    .setLabel(buttonLabel)
    .setStyle(ButtonStyle.Primary);

  try {
    await channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(button)],
    });

    const roleMentions = roleIds.map((id) => `<@&${id}>`).join(", ");
    await interaction.editReply({
      content: `Verification message posted in ${channel}.\nRoles on success: ${roleMentions}\nApproved domains: ${approvedDomains.join(", ")}`,
    });
  } catch (err) {
    console.error("Error posting verification message:", err);
    const embedErr = new EmbedBuilder()
      .setColor(EMBED_COLOR_ERROR)
      .setDescription("Couldn't post the verification message.");
    await interaction.editReply({ embeds: [embedErr] });
  }
}
