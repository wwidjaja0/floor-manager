import { eq, and, desc } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { generateCode } from "../utils/generate-code.js";
import { minutesFromNow, isPast } from "../utils/time.js";
import {
  isValidEmailFormat,
  extractDomain,
  isDomainApproved,
} from "../utils/validate-email.js";
import { hashCode, verifyCodeHash } from "../utils/hashcode.js";
import { sendVerificationEmail } from "./email.js";
import { getGuildSettings, getApprovedDomains } from "./guild-config.js";
import {
  MAX_ACTIVE_REQUESTS_PER_USER,
  MAX_CODE_ATTEMPTS,
} from "../config/constants.js";

const { verificationRequests, verifiedUsers } = schema;

export function isExpired(request) {
  return isPast(new Date(request.expiresAt));
}

/**
 * Validates the email against format + the guild's domain allow-list,
 * creates a verification request, and sends an OTP email.
 */
export async function startVerification(guildId, userId, email) {
  if (!isValidEmailFormat(email)) {
    return { ok: false, reason: "invalid_format" };
  }

  const domain = extractDomain(email);
  const approved = await getApprovedDomains(guildId);

  if (!isDomainApproved(domain, approved)) {
    return { ok: false, reason: "domain_not_approved", domain };
  }

  const [alreadyVerified] = await db
    .select()
    .from(verifiedUsers)
    .where(
      and(eq(verifiedUsers.guildId, guildId), eq(verifiedUsers.userId, userId)),
    );

  if (alreadyVerified) {
    return {
      ok: false,
      reason: "already_verified",
      email: alreadyVerified.email,
    };
  }

  const active = await db
    .select()
    .from(verificationRequests)
    .where(
      and(
        eq(verificationRequests.guildId, guildId),
        eq(verificationRequests.userId, userId),
        eq(verificationRequests.verified, false),
      ),
    );

  const stillActive = active.filter((r) => !isExpired(r));

  if (stillActive.length >= MAX_ACTIVE_REQUESTS_PER_USER) {
    return { ok: false, reason: "too_many_requests" };
  }

  const settings = await getGuildSettings(guildId);
  const code = generateCode();
  const codeHash = hashCode(code);
  const expiresAt = minutesFromNow(settings.codeExpiryMinutes);

  const [request] = await db
    .insert(verificationRequests)
    .values({
      guildId,
      userId,
      email: email.trim().toLowerCase(),
      codeHash,
      expiresAt,
    })
    .returning();

  const emailPromise = sendVerificationEmail(
    request.email,
    code,
    settings.codeExpiryMinutes,
  );

  return {
    ok: true,
    request,
    emailPromise,
  };
}

/**
 * Verifies a submitted OTP.
 */
export async function verifyCode(guildId, userId, submittedCode) {
  const [request] = await db
    .select()
    .from(verificationRequests)
    .where(
      and(
        eq(verificationRequests.guildId, guildId),
        eq(verificationRequests.userId, userId),
        eq(verificationRequests.verified, false),
      ),
    )
    .orderBy(desc(verificationRequests.createdAt))
    .limit(1);

  if (!request) {
    return { ok: false, reason: "no_pending_request" };
  }

  if (isExpired(request)) {
    return { ok: false, reason: "expired" };
  }

  if (request.attempts >= MAX_CODE_ATTEMPTS) {
    return { ok: false, reason: "too_many_attempts" };
  }

  if (!verifyCodeHash(submittedCode.trim(), request.codeHash)) {
    await db
      .update(verificationRequests)
      .set({
        attempts: request.attempts + 1,
      })
      .where(eq(verificationRequests.id, request.id));

    return {
      ok: false,
      reason: "incorrect_code",
    };
  }

  await db
    .update(verificationRequests)
    .set({
      verified: true,
    })
    .where(eq(verificationRequests.id, request.id));

  const [verifiedUser] = await db
    .insert(verifiedUsers)
    .values({
      guildId,
      userId,
      email: request.email,
    })
    .returning();

  return {
    ok: true,
    email: verifiedUser.email,
  };
}

/**
 * Resends a new OTP for an existing verification request.
 */
export async function resendVerification(guildId, userId) {
  const [request] = await db
    .select()
    .from(verificationRequests)
    .where(
      and(
        eq(verificationRequests.guildId, guildId),
        eq(verificationRequests.userId, userId),
        eq(verificationRequests.verified, false),
      ),
    )
    .orderBy(desc(verificationRequests.createdAt))
    .limit(1);

  if (!request || isExpired(request)) {
    return {
      ok: false,
      reason: "no_pending_request",
    };
  }

  const settings = await getGuildSettings(guildId);
  const code = generateCode();
  const codeHash = hashCode(code);
  const expiresAt = minutesFromNow(settings.codeExpiryMinutes);

  await db
    .update(verificationRequests)
    .set({
      codeHash,
      expiresAt,
      attempts: 0,
    })
    .where(eq(verificationRequests.id, request.id));

  const emailPromise = sendVerificationEmail(
    request.email,
    code,
    settings.codeExpiryMinutes,
  );

  return {
    ok: true,
    email: request.email,
    emailPromise,
  };
}

export async function getVerifiedUser(guildId, userId) {
  const [row] = await db
    .select()
    .from(verifiedUsers)
    .where(
      and(eq(verifiedUsers.guildId, guildId), eq(verifiedUsers.userId, userId)),
    );

  return row ?? null;
}

export async function getPendingRequests(guildId) {
  const rows = await db
    .select()
    .from(verificationRequests)
    .where(
      and(
        eq(verificationRequests.guildId, guildId),
        eq(verificationRequests.verified, false),
      ),
    );

  return rows.filter((r) => !isExpired(r));
}

/**
 * Imports users who are already verified through another system.
 */
export async function importVerifiedUsers(guildId, userIds) {
  const existingRows = await db
    .select({
      userId: verifiedUsers.userId,
    })
    .from(verifiedUsers)
    .where(eq(verifiedUsers.guildId, guildId));

  const existingSet = new Set(existingRows.map((r) => r.userId));

  const toInsert = userIds.filter((userId) => !existingSet.has(userId));

  if (toInsert.length) {
    await db.insert(verifiedUsers).values(
      toInsert.map((userId) => ({
        guildId,
        userId,
        email: null,
      })),
    );
  }

  return {
    imported: toInsert.length,
    alreadyPresent: userIds.length - toInsert.length,
  };
}
