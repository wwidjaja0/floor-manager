import { eq, and } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { DEFAULT_CODE_EXPIRY_MINUTES } from "../config/constants.js";

const { guildSettings, approvedDomains } = schema;

/**
 * Fetches a guild's settings row, creating it with defaults if it
 * doesn't exist yet (first time any command touches this guild).
 */
export async function getGuildSettings(guildId) {
  const [existing] = await db
    .select()
    .from(guildSettings)
    .where(eq(guildSettings.guildId, guildId));

  if (existing) return existing;

  const [created] = await db
    .insert(guildSettings)
    .values({
      guildId,
      codeExpiryMinutes: DEFAULT_CODE_EXPIRY_MINUTES,
    })
    .returning();

  return created;
}

export async function setVerifiedRole(guildId, roleId) {
  return setVerifiedRoles(guildId, [roleId]);
}

/**
 * Stores one or more verified role ids as a comma-separated string in
 * `verified_role_id` (schema stays a single text column).
 */
export async function setVerifiedRoles(guildId, roleIds) {
  const normalized = [...new Set(roleIds.filter(Boolean))];
  await getGuildSettings(guildId);

  await db
    .update(guildSettings)
    .set({
      verifiedRoleId: normalized.length ? normalized.join(",") : null,
      updatedAt: new Date(),
    })
    .where(eq(guildSettings.guildId, guildId));
}

export async function setVerificationChannel(guildId, channelId) {
  await getGuildSettings(guildId);

  await db
    .update(guildSettings)
    .set({
      verificationChannelId: channelId,
      updatedAt: new Date(),
    })
    .where(eq(guildSettings.guildId, guildId));
}

export async function setCodeExpiryMinutes(guildId, minutes) {
  await getGuildSettings(guildId);

  await db
    .update(guildSettings)
    .set({
      codeExpiryMinutes: minutes,
      updatedAt: new Date(),
    })
    .where(eq(guildSettings.guildId, guildId));
}

export async function getApprovedDomains(guildId) {
  const rows = await db
    .select()
    .from(approvedDomains)
    .where(eq(approvedDomains.guildId, guildId));

  return rows.map((row) => row.domain);
}

export async function addDomain(guildId, domain) {
  const normalized = domain.trim().toLowerCase();

  const [existing] = await db
    .select()
    .from(approvedDomains)
    .where(
      and(
        eq(approvedDomains.guildId, guildId),
        eq(approvedDomains.domain, normalized),
      ),
    );

  if (existing) {
    return {
      added: false,
      domain: normalized,
    };
  }

  await db.insert(approvedDomains).values({
    guildId,
    domain: normalized,
  });

  return {
    added: true,
    domain: normalized,
  };
}

export async function removeDomain(guildId, domain) {
  const normalized = domain.trim().toLowerCase();

  const result = await db
    .delete(approvedDomains)
    .where(
      and(
        eq(approvedDomains.guildId, guildId),
        eq(approvedDomains.domain, normalized),
      ),
    )
    .returning();

  return result.length > 0;
}
