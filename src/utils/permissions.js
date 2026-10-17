import { PermissionFlagsBits, MessageFlags } from "discord.js";

/**
 * True if the interacting member can manage the bot's guild config
 * (mirrors Discord's own "Manage Server" permission so server owners
 * don't have to hand out a separate role).
 */
export function isGuildAdmin(interaction) {
  return Boolean(
    interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild),
  );
}

/**
 * Sends a standard "you can't do that" ephemeral reply and returns false,
 * or returns true if the member is allowed to proceed. Meant to be used
 * as an early-return guard at the top of admin command handlers.
 */
export async function requireGuildAdmin(interaction) {
  if (isGuildAdmin(interaction)) return true;
  await interaction.reply({
    content: "You need the **Manage Server** permission to do that.",
    flags: MessageFlags.Ephemeral,
  });
  return false;
}
