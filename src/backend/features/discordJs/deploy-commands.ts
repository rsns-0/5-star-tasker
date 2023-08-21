import { REST, Routes } from "discord.js";

import { CommandExport } from "./types/types";
import dotenv from "dotenv";
import { getExportsFromFilesInFolder } from "@/backend/features/fileParsing/services/fileParsingService";

dotenv.config();

const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_DEV_SERVER_ID;
const token = process.env.DISCORD_TOKEN;

if (!clientId || !guildId || !token) {
	throw new Error("Missing discord settings");
}

export const registerCommandsToDiscord = async () => {
	const commandArr = await getExportsFromFilesInFolder<CommandExport>("commands",__dirname);
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
};