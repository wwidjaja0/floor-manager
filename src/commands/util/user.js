import { SlashCommandBuilder } from "discord.js";

const user = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("replies with user info"),
  async execute(interaction) {
    await interaction.reply(`this was run by ${interaction.user.username}`);
  },
};

export default user;
