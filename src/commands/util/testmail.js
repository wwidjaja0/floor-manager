import { SlashCommandBuilder, MessageFlags } from "discord.js";
import { resend } from "../../services/email.js";

const testmail = {
  data: new SlashCommandBuilder()
    .setName("testmail")
    .setDescription("send a test verification email")
    .addStringOption((option) =>
      option
        .setName("email")
        .setDescription("recipient email address")
        .setRequired(true),
    ),

  async execute(interaction) {
    const email = interaction.options.getString("email");

    try {
      const { data, error } = await resend.emails.send({
        from: "Poker Club @ UC San Diego <noreply@wwidjaja.com>",
        to: [email],
        subject: "Test email",
        html: "<p>Hello world</p>",
      });

      if (error) {
        return interaction.reply({
          content: String(error.message || error),
          flags: MessageFlags.Ephemeral,
        });
      }

      return interaction.reply({
        content: `Email sent: ${data?.id ?? "success"}`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      return interaction.reply({
        content: String(err),
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

export default testmail;
