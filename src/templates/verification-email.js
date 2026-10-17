export function verificationEmail(code, expiryMinutes) {
  const subject = "Your verification code";

  const text = [
    `Your verification code is: ${code}`,
    ``,
    `If you didn't request this, you can ignore this email.`,
  ].join("\n");

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="margin-bottom: 4px;">Your verification code</h2>
      <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px; background: #f4f4f5; padding: 16px 24px; border-radius: 8px; text-align: center; margin: 24px 0;">
        ${code}
      </div>
      <p style="color: #888; font-size: 13px;">
        This code expires in ${expiryMinutes} minutes. If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;

  return { subject, text, html };
}
