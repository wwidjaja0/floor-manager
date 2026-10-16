import { Resend } from "resend";
import "../load-env.js";

let resend;

/**
 * Lazy Resend client so the bot can start without RESEND_API_KEY.
 * Fails only when email is actually used (e.g. /testmail).
 */
export function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("missing RESEND_API_KEY");
  }

  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  return resend;
}
