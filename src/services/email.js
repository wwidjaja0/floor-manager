import { Resend } from "resend";
import { verificationEmail } from "../templates/verification-email.js";

let resend = null;

function getResend() {
  if (resend) return resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set — cannot send verification emails.",
    );
  }
  resend = new Resend(apiKey);
  return resend;
}

/**
 * Sends a verification code to `email`. Throws on failure so we
 * can surface a clear error to the user instead of silently
 * leaving a stale verification_requests row.
 */
export async function sendVerificationEmail(email, code, expiryMinutes) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error(
      "RESEND_FROM_EMAIL is not set — cannot send verification emails.",
    );
  }

  const { subject, text, html } = verificationEmail(code, expiryMinutes);

  const { data, error } = await getResend().emails.send({
    from,
    to: email,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(
      `Resend failed to send verification email: ${error.message}`,
    );
  }

  return data;
}
