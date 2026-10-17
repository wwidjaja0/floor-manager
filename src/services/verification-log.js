/**
 * Logs a completed verification. Currently just structured console
 * output — swap or extend this to post into a mod-log channel, write
 * to an audit table, etc. without touching the callers.
 */
export async function logVerification({ guild, user, email, roleId }) {
  console.log(
    JSON.stringify({
      event: "verification_completed",
      guildId: guild.id,
      guildName: guild.name,
      userId: user.id,
      userTag: user.tag,
      email: email ?? null,
      roleId: roleId ?? null,
      at: new Date().toISOString(),
    }),
  );
}
