import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";
import { getPendingRequests } from "../../services/verification.js";
import { requireGuildAdmin } from "../../utils/permissions.js";
import { toDiscordRelative } from "../../utils/time.js";
import { EMBED_COLOR } from "../../config/constants.js";

export const data = new SlashCommandBuilder()
  .setName("pending")
  .setDescription("List active (unverified) verification requests")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  if (!(await requireGuildAdmin(interaction))) return;

  const requests = await getPendingRequests(interaction.guildId);

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle("Pending verifications");

  if (!requests.length) {
    embed.setDescription("No pending verification requests.");
  } else {
    embed.setDescription(
      requests
        .map(
          (r) =>
            `<@${r.userId}> — ${r.email} — expires ${toDiscordRelative(new Date(r.expiresAt))}`,
        )
        .join("\n"),
    );
  }

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
