import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
  MessageFlags,
} from "discord.js";
import {
  getGuildSettings,
  setVerificationChannel,
  setCodeExpiryMinutes,
} from "../../services/guild-config.js";
import { getApprovedDomains } from "../../services/guild-config.js";
import { requireGuildAdmin } from "../../utils/permissions.js";
import { EMBED_COLOR } from "../../config/constants.js";

export const data = new SlashCommandBuilder()
  .setName("config")
  .setDescription("View or update this server's verification settings")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Channel where members should run /verify")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false),
  )
  .addIntegerOption((option) =>
    option
      .setName("expiry-minutes")
      .setDescription("How long a code stays valid")
      .setMinValue(1)
      .setMaxValue(1440)
      .setRequired(false),
  );

export async function execute(interaction) {
  if (!(await requireGuildAdmin(interaction))) return;

  const channel = interaction.options.getChannel("channel");
  const expiryMinutes = interaction.options.getInteger("expiry-minutes");

  if (channel) {
    await setVerificationChannel(interaction.guildId, channel.id);
  }
  if (expiryMinutes) {
    await setCodeExpiryMinutes(interaction.guildId, expiryMinutes);
  }

  const settings = await getGuildSettings(interaction.guildId);
  const domains = await getApprovedDomains(interaction.guildId);

  let roleMentions = null;
  if (settings.verifiedRoleId) {
    const mentions = [];
    for (const part of settings.verifiedRoleId.split(",")) {
      const id = part.trim();
      if (id) mentions.push(`<@&${id}>`);
    }
    roleMentions = mentions.join(", ");
  }

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle("Verification settings")
    .addFields(
      {
        name: "Verified role(s)",
        value: roleMentions || "Not set — use `/set-role` or `/verify role:`",
      },
      {
        name: "Verification channel",
        value: settings.verificationChannelId
          ? `<#${settings.verificationChannelId}>`
          : "Not set",
      },
      { name: "Code expiry", value: `${settings.codeExpiryMinutes} minutes` },
      {
        name: "Approved domains",
        value: domains.length ? domains.join(", ") : "None yet",
      },
    );

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
