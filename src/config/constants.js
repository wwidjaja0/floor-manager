export const DEFAULT_CODE_EXPIRY_MINUTES = 15;

export const CODE_LENGTH = 6;

export const EMBED_COLOR = 0x5865f2;
export const EMBED_COLOR_SUCCESS = 0x57f287;
export const EMBED_COLOR_ERROR = 0xed4245;

export const MODAL_IDS = {
  VERIFY_EMAIL: "verify_email_modal",
  VERIFY_CODE: "verify_code_modal",
};

export const INPUT_IDS = {
  EMAIL: "verify_email_input",
  CODE: "verify_code_input",
};

export const BUTTON_IDS = {
  START_VERIFICATION: "start_verification_button",
  ENTER_CODE: "enter_code_button",
  RESEND_CODE: "resend_code_button",
};

// How many active (unexpired) verification requests a single user may have
// open at once, per guild, before new attempts are rejected.
export const MAX_ACTIVE_REQUESTS_PER_USER = 3;

// How many code attempts a single verification_request may be checked
// against before it is invalidated.
export const MAX_CODE_ATTEMPTS = 5;
