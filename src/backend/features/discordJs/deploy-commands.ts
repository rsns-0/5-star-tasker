import {
	CommandInteraction,
	REST,
	Routes,
	SlashCommandBuilder,
} from "discord.js";

import fs from "fs";
import path from "path";

const settings = {
	clientId: process.env.DISCORD_CLIENT_ID,
	guildId: process.env.DISCORD_DEV_SERVER_ID,
	token: process.env.DISCORD_TOKEN,
};

const { clientId, guildId, token } = settings;

if (!clientId || !guildId || !token) {
	throw new Error("Missing discord settings");
}

type Command = {
	data: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
};

type MaybeCommand = Partial<Command>;

function getCommandPathAndFiles() {
	const commandsPath = path.join(__dirname, "commands");
	const commandFileNames = fs.readdirSync(commandsPath).filter((file) => {
		return file.endsWith(".ts") || file.endsWith(".js");
	});
	return {
		commandsPath,
		commandFileNames,
	};
}

function getCommandsFromFiles() {
	const { commandsPath, commandFileNames } = getCommandPathAndFiles();
	const promises = commandFileNames.map(async (commandFileName) => {
		const filePath = path.join(commandsPath, commandFileName);
		const { data, execute }: MaybeCommand = await import(filePath);
		if (!data || !execute) {
			throw new Error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
		const res: Command = { data, execute };
		return res;
	});
	return Promise.all(promises) // not time sensitive, so we can wait for all promises to resolve
}


const registerCommandsToDiscord = async () =>{
    const commandArr = await getCommandsFromFiles()
    const serializedCommands = commandArr.map((command) => command.data.toJSON());
    const rest = new REST().setToken(token);
    try {
		console.log(`Started refreshing ${serializedCommands.length} application (/) commands.`);
		const data: any = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: serializedCommands,
		});
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}

registerCommandsToDiscord();


// for (const folder of commandFolders) {
//     const commandsPath = path.join(foldersPath, folder);
//     const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
//     for (const file of commandFiles) {
//       const filePath = path.join(commandsPath, file);
//       const command: Command = import(filePath); // Consider using dynamic import
//       if ('data' in command && 'execute' in command) {
//         serializedCommands.push(command.data.toJSON());
//       } else {
//         console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
//       }
//     }
//   }


