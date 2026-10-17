import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";
import { getApprovedDomains } from "../../services/guild-config.js";
import { requireGuildAdmin } from "../../utils/permissions.js";
import { EMBED_COLOR } from "../../config/constants.js";

export const data = new SlashCommandBuilder()
  .setName("list-domains")
  .setDescription("List all approved email domains")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  if (!(await requireGuildAdmin(interaction))) return;

  const domains = await getApprovedDomains(interaction.guildId);

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle("Approved domains")
    .setDescription(
      domains.length
        ? domains.map((d) => `• ${d}`).join("\n")
        : "No domains approved yet. Add one with `/add-domain`.",
    );

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
