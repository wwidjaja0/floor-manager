export function minutesFromNow(minutes) {
  return new Date(Date.now() + minutes * 60_000);
}

export function isPast(date) {
  return date.getTime() <= Date.now();
}

/**
 * Formats a Date as a Discord relative timestamp, e.g. "in 15 minutes".
 * https://discord.com/developers/docs/reference#message-formatting
 */
export function toDiscordRelative(date) {
  return `<t:${Math.floor(date.getTime() / 1000)}:R>`;
}
