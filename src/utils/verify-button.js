import { BUTTON_IDS, MODAL_IDS } from "../config/constants.js";

/**
 * Button/modal customIds are capped at 100 chars. Snowflake ids are
 * 17–19 digits, so a few roles fit as `prefix:id1,id2,...`.
 */
function withRoles(prefix, roleIds) {
  const ids = [...new Set((roleIds ?? []).filter(Boolean))];
  if (!ids.length) return prefix;
  return `${prefix}:${ids.join(",")}`;
}

function parsePrefixed(customId, prefix) {
  if (customId !== prefix && !customId.startsWith(`${prefix}:`)) {
    return null;
  }
  const suffix = customId.slice(prefix.length + 1);
  return { roleIds: parseRoleIds(suffix) };
}

export function buildStartVerificationCustomId(roleIds) {
  return withRoles(BUTTON_IDS.START_VERIFICATION, roleIds);
}

export function parseStartVerificationCustomId(customId) {
  return parsePrefixed(customId, BUTTON_IDS.START_VERIFICATION);
}

export function buildEnterCodeCustomId(roleIds) {
  return withRoles(BUTTON_IDS.ENTER_CODE, roleIds);
}

export function parseEnterCodeCustomId(customId) {
  return parsePrefixed(customId, BUTTON_IDS.ENTER_CODE);
}

export function buildResendCodeCustomId(roleIds) {
  return withRoles(BUTTON_IDS.RESEND_CODE, roleIds);
}

export function parseResendCodeCustomId(customId) {
  return parsePrefixed(customId, BUTTON_IDS.RESEND_CODE);
}

export function buildVerifyEmailModalCustomId(roleIds) {
  return withRoles(MODAL_IDS.VERIFY_EMAIL, roleIds);
}

export function parseVerifyEmailModalCustomId(customId) {
  return parsePrefixed(customId, MODAL_IDS.VERIFY_EMAIL);
}

export function buildVerifyCodeModalCustomId(roleIds) {
  return withRoles(MODAL_IDS.VERIFY_CODE, roleIds);
}

export function parseVerifyCodeModalCustomId(customId) {
  return parsePrefixed(customId, MODAL_IDS.VERIFY_CODE);
}

export function parseRoleIds(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  const ids = [];
  for (const part of String(value).split(",")) {
    const id = part.trim();
    if (id) ids.push(id);
  }
  return ids;
}
