import { Events, MessageFlags } from "discord.js";

const interactionCreate = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`no command ${interaction.commandName} found`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (e) {
      console.error(e);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "there was an error",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "there was an error",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};

export default interactionCreate;
