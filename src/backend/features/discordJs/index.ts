import { Client, Events, GatewayIntentBits } from "discord.js";
import { CommandExport, EventExport, } from "./types/types";

import { Collection } from "discord.js";
import ReadyClient from "./models/client";
import dotenv from "dotenv";
import { getExportsFromFilesInFolder } from "@/backend/features/fileParsing/services/fileParsingService";
import { registerCommandsToDiscord } from "./deploy-commands";

async function registerCommandsToClient(client: ReadyClient) {
	const res = await getExportsFromFilesInFolder<CommandExport>("commands",__dirname)
	for (const { data, execute } of res) {
		client.commands.set(data.name, { data, execute });
	}
	registerCommandsToDiscord();
}

async function registerEventsToClient(client: ReadyClient) {
	const res = await getExportsFromFilesInFolder<EventExport>("events",__dirname)
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

	const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as ReadyClient;
	client.commands = new Collection();

	client.login(token);

	registerCommandsToClient(client);
	registerEventsToClient(client)
}

main();