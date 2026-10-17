const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Basic RFC-5322-ish shape check. Not exhaustive by design - the domain
 * allow-list is the real gate on who can verify.
 */
export function isValidEmailFormat(email) {
  return typeof email === "string" && EMAIL_REGEX.test(email.trim());
}

/**
 * Returns the lowercased domain portion of an email, or null if the
 * email doesn't look valid.
 */
export function extractDomain(email) {
  if (!isValidEmailFormat(email)) return null;
  return email.trim().toLowerCase().split("@")[1];
}

/**
 * True if `domain` matches one of `approvedDomains` exactly, or is a
 * subdomain of one of them (so approving "ucsd.edu" also covers
 * "eng.ucsd.edu" automatically - explicit rows are still supported for
 * guilds that want finer-grained control).
 */
export function isDomainApproved(domain, approvedDomains) {
  if (!domain) return false;
  return approvedDomains.some(
    (approved) => domain === approved || domain.endsWith(`.${approved}`),
  );
}
