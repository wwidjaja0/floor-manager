import { Resend } from "resend";
import "dotenv/config";

if (!process.env.RESEND_API_KEY) {
  throw new Error("missing RESEND_API_KEY");
}

export const resend = new Resend(process.env.RESEND_API_KEY);
