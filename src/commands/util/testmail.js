import { SlashCommandBuilder } from "discord.js";
import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

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
        return await interaction.reply({
          content: String(error.message || error),
          ephemeral: true,
        });
      }

      await interaction.reply({
        content: `Email sent: ${data?.id ?? "success"}`,
        ephemeral: true,
      });
    } catch (err) {
      await interaction.reply({
        content: String(err),
        ephemeral: true,
      });
    }
  },
};

export default testmail;
