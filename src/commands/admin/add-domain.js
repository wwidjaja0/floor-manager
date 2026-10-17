import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";
import { addDomain } from "../../services/guild-config.js";
import { requireGuildAdmin } from "../../utils/permissions.js";
import {
  EMBED_COLOR_SUCCESS,
  EMBED_COLOR_ERROR,
} from "../../config/constants.js";

export const data = new SlashCommandBuilder()
  .setName("add-domain")
  .setDescription("Approve an email domain for verification")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((option) =>
    option.setName("domain").setDescription("e.g. ucsd.edu").setRequired(true),
  );

export async function execute(interaction) {
  if (!(await requireGuildAdmin(interaction))) return;

  const domain = interaction.options.getString("domain", true);
  const { added, domain: normalized } = await addDomain(
    interaction.guildId,
    domain,
  );

  const embed = new EmbedBuilder()
    .setColor(added ? EMBED_COLOR_SUCCESS : EMBED_COLOR_ERROR)
    .setDescription(
      added
        ? `Added **${normalized}** to the approved domains.`
        : `**${normalized}** is already approved.`,
    );

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
