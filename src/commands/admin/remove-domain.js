import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";
import { removeDomain } from "../../services/guild-config.js";
import { requireGuildAdmin } from "../../utils/permissions.js";
import {
  EMBED_COLOR_SUCCESS,
  EMBED_COLOR_ERROR,
} from "../../config/constants.js";

export const data = new SlashCommandBuilder()
  .setName("remove-domain")
  .setDescription("Remove an approved email domain")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((option) =>
    option
      .setName("domain")
      .setDescription("The domain to remove")
      .setRequired(true),
  );

export async function execute(interaction) {
  if (!(await requireGuildAdmin(interaction))) return;

  const domain = interaction.options.getString("domain", true);
  const removed = await removeDomain(interaction.guildId, domain);

  const embed = new EmbedBuilder()
    .setColor(removed ? EMBED_COLOR_SUCCESS : EMBED_COLOR_ERROR)
    .setDescription(
      removed
        ? `Removed **${domain}** from the approved domains.`
        : `**${domain}** wasn't in the approved list.`,
    );

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
