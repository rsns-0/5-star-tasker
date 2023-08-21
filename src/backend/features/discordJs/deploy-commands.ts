import { REST, Routes } from "discord.js";

import { CommandExport } from "./types/types";
import { descendToFolderThenGetExportsFromFolder } from "@/backend/features/fileParsing/services/fileParsingService";
import dotenv from "dotenv";

dotenv.config();

const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_DEV_SERVER_ID;
const token = process.env.DISCORD_TOKEN;

if (!clientId || !guildId || !token) {
	throw new Error("Missing discord settings");
}


export const registerCommandsToDiscord = async () => {
	const commandArr = await descendToFolderThenGetExportsFromFolder<CommandExport>("commands",__dirname);
	const serializedCommands = commandArr.map((command) => command.data.toJSON());
	const rest = new REST().setToken(token);
	try {
		console.log(`Started refreshing ${serializedCommands.length} application (/) commands.`);
		const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: serializedCommands,
		})
		if(Array.isArray(data)){
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} else {
			console.warn("Sent response to discord server but it was not an array." + JSON.stringify(data))
		}
		
	} catch (error) {
		console.error(error);
	}
};