import crypto from "node:crypto";

// A plain hash (sha256(code)) of a 6-digit code is barely better than
// storing it plaintext — there are only 1,000,000 possibilities, so an
// attacker with DB access can brute-force every hash offline in
// milliseconds. Keying the hash with a server-side secret (never
// stored in the DB) means a DB leak alone isn't enough to recover
// codes; the secret would also have to leak.
const SECRET = process.env.CODE_HASH_SECRET;

if (!SECRET) {
  console.warn(
    "CODE_HASH_SECRET is not set — falling back to an insecure default. " +
      "Set CODE_HASH_SECRET in your .env before deploying to production.",
  );
}

const EFFECTIVE_SECRET = SECRET || "dev-insecure-secret-change-me";

export function hashCode(code) {
  return crypto
    .createHmac("sha256", EFFECTIVE_SECRET)
    .update(code)
    .digest("hex");
}

/**
 * Constant-time comparison to avoid leaking timing information about
 * how much of the hash matched.
 */
export function verifyCodeHash(code, hash) {
  const expected = hashCode(code);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
