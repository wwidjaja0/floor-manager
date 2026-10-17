import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";
import { setVerifiedRole } from "../../services/guild-config.js";
import { requireGuildAdmin } from "../../utils/permissions.js";
import { EMBED_COLOR_SUCCESS } from "../../config/constants.js";

export const data = new SlashCommandBuilder()
  .setName("set-role")
  .setDescription("Set the role given to members after verification")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("The verified role")
      .setRequired(true),
  );

export async function execute(interaction) {
  if (!(await requireGuildAdmin(interaction))) return;

  const role = interaction.options.getRole("role", true);
  await setVerifiedRole(interaction.guildId, role.id);

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR_SUCCESS)
    .setDescription(`Verified members will now receive the ${role} role.`);

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
