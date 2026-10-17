import "./load-env.js";
import { REST, Routes } from "discord.js";
import { readdirSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  const missing = [
    !token && "DISCORD_TOKEN",
    !clientId && "DISCORD_CLIENT_ID",
  ].filter(Boolean);
  console.error(`Missing env: ${missing.join(", ")}`);
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const commands = [];
const commandsPath = path.join(__dirname, "commands");

for (const category of readdirSync(commandsPath)) {
  const categoryPath = path.join(commandsPath, category);

  const files = readdirSync(categoryPath).filter((file) =>
    file.endsWith(".js"),
  );

  for (const file of files) {
    const filePath = pathToFileURL(path.join(categoryPath, file)).href;

    const commandModule = await import(filePath);
    const command = commandModule.default ?? commandModule;

    if (command?.data && command?.execute) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`[WARNING] ${file} missing data or execute`);
    }
  }
}

const rest = new REST().setToken(token);

let route;

if (process.env.DISCORD_GUILD_ID) {
  route = Routes.applicationGuildCommands(
    clientId,
    process.env.DISCORD_GUILD_ID,
  );
} else {
  route = Routes.applicationCommands(clientId);
}

try {
  console.log(`Registering ${commands.length} commands...`);

  const data = await rest.put(route, {
    body: commands,
  });

  console.log(`Registered ${data.length} commands.`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
