import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// One row per guild. Created lazily the first time an admin touches config.
export const guildSettings = sqliteTable("guild_settings", {
  guildId: text("guild_id").primaryKey(),
  verifiedRoleId: text("verified_role_id"),
  verificationChannelId: text("verification_channel_id"),
  codeExpiryMinutes: integer("code_expiry_minutes").notNull().default(15),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// A guild can approve many domains (e.g. ucsd.edu, eng.ucsd.edu).
export const approvedDomains = sqliteTable(
  "approved_domains",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    guildId: text("guild_id").notNull(),
    domain: text("domain").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildDomainUnique: uniqueIndex("approved_domains_guild_domain_idx").on(
      table.guildId,
      table.domain,
    ),
  }),
);

// Short-lived rows tracking an in-progress /verify attempt.
export const verificationRequests = sqliteTable("verification_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  guildId: text("guild_id").notNull(),
  userId: text("user_id").notNull(),
  email: text("email").notNull(),
  // HMAC(code), never the plaintext code — see utils/hashCode.js.
  codeHash: text("code_hash").notNull(),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Permanent record of who has verified which email in which guild.
export const verifiedUsers = sqliteTable(
  "verified_users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    guildId: text("guild_id").notNull(),
    userId: text("user_id").notNull(),
    // Nullable: records backfilled via /import-verified-role never had
    // an email captured, since the member verified before this bot
    // tracked that (or was verified through some other means).
    email: text("email"),
    verifiedAt: integer("verified_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    guildUserUnique: uniqueIndex("verified_users_guild_user_idx").on(
      table.guildId,
      table.userId,
    ),
  }),
);
