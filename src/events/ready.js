import { Events } from "discord.js";

const ready = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`bot is ready and logged in as ${client.user.tag}`);
  },
};

export default ready;
