import "./load-env.js";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("Missing DISCORD_TOKEN — set it in the repo-root .env");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");

for (const category of readdirSync(commandsPath)) {
  const categoryPath = path.join(commandsPath, category);

  for (const file of readdirSync(categoryPath).filter((f) =>
    f.endsWith(".js"),
  )) {
    const filePath = pathToFileURL(path.join(categoryPath, file)).href;

    const commandModule = await import(filePath);
    const command = commandModule.default ?? commandModule;

    if (command?.data && command?.execute) {
      client.commands.set(command.data.name, command);
    } else {
      console.warn(`Skipping ${file}: missing data or execute`);
    }
  }
}

const eventsPath = path.join(__dirname, "events");

for (const file of readdirSync(eventsPath).filter((f) => f.endsWith(".js"))) {
  const filePath = pathToFileURL(path.join(eventsPath, file)).href;

  const eventModule = await import(filePath);
  const event = eventModule.default ?? eventModule;

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);
