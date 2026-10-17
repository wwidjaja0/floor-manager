import { parseRoleIds } from "../utils/verify-button.js";

/**
 * Assigns the configured verified role(s) to a member.
 * No-ops (returns false) if no roles are configured or the bot lacks
 * permission, rather than throwing — verification should still be
 * recorded in the database even if the role grant fails.
 */
export async function assignVerifiedRole(guild, userId, roleIdOrIds) {
  const roleIds = parseRoleIds(roleIdOrIds);
  if (!roleIds.length) return false;

  try {
    const member = await guild.members.fetch(userId);
    await member.roles.add(roleIds);
    return true;
  } catch (err) {
    console.error(`Failed to assign verified role to ${userId}:`, err.message);
    return false;
  }
}

export async function removeVerifiedRole(guild, userId, roleIdOrIds) {
  const roleIds = parseRoleIds(roleIdOrIds);
  if (!roleIds.length) return false;

  try {
    const member = await guild.members.fetch(userId);
    await member.roles.remove(roleIds);
    return true;
  } catch (err) {
    console.error(
      `Failed to remove verified role from ${userId}:`,
      err.message,
    );
    return false;
  }
}
