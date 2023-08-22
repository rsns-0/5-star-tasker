import { CommandExport, EventExport, } from "./types/types";
import ReadyClient from "./models/client";
import { descendToFolderThenGetExportsFromFolder } from "@/backend/features/fileParsing/services/fileParsingService";
import dotenv from "dotenv";
import { registerCommandsToDiscord } from "./deploy-commands";
import client from "./models/clientCreation";


export async function registerCommandsToClient(client: ReadyClient) {
	const res = await descendToFolderThenGetExportsFromFolder<CommandExport>("commands",__dirname)
	for (const { data, execute } of res) {
		client.commands.set(data.name, { data, execute });
	}
	registerCommandsToDiscord();
}

export async function registerEventsToClient(client: ReadyClient) {
	const res = await descendToFolderThenGetExportsFromFolder<EventExport>("events",__dirname)
	for (const { name, once, execute } of res) {
		const _name = name as string
		if (once) {
			client.once(_name, execute);
		} else {
			client.on(_name, execute);
		}
	}
}

function main() { 
	dotenv.config();
	const token = process.env.DISCORD_TOKEN;

	if (!token) {
		throw new Error("Missing discord token");
	}

	client.login(token);

	registerCommandsToClient(client);
	registerEventsToClient(client)
}

main();