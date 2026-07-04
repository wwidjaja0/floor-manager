import { SlashCommandBuilder } from "discord.js";

const server = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("replies with server info"),
  async execute(interaction) {
    await interaction.reply(`this server is called ${interaction.guild.name}`);
  },
};

export default server;
