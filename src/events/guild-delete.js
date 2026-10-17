import { Events } from "discord.js";
import { eq } from "drizzle-orm";
import { db, schema } from "../db/index.js";

const { guildSettings, approvedDomains, verificationRequests, verifiedUsers } =
  schema;

export const name = Events.GuildDelete;
export const once = false;

/**
 * When the bot is kicked or a guild is deleted, clear out that guild's
 * config and in-progress requests. Verified-user history is kept in
 * case the bot is re-invited later and wants to restore roles.
 */
export async function execute(guild) {
  console.log(
    `Removed from guild ${guild.id} (${guild.name ?? "unknown"}), cleaning up config`,
  );

  await db.delete(guildSettings).where(eq(guildSettings.guildId, guild.id));
  await db.delete(approvedDomains).where(eq(approvedDomains.guildId, guild.id));
  await db
    .delete(verificationRequests)
    .where(eq(verificationRequests.guildId, guild.id));
  // verifiedUsers intentionally left intact
  void verifiedUsers;
}
