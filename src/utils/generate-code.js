import { CODE_LENGTH } from "../config/constants.js";

/**
 * Generates a zero-padded numeric verification code, e.g. "042871".
 */
export function generateCode(length = CODE_LENGTH) {
  const max = 10 ** length;
  const n = Math.floor(Math.random() * max);
  return String(n).padStart(length, "0");
}
