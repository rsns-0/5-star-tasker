import { Client, Events, GatewayIntentBits } from "discord.js";
import { CommandExport, EventExport, } from "./types/types";

import { Collection } from "discord.js";
import ReadyClient from "./models/client";
import dotenv from "dotenv";
import { getExportsFromFilesInFolder } from "@/backend/features/fileParsing/services/fileParsingService";

async function registerCommandsToClient(client: ReadyClient) {
	const res = await getExportsFromFilesInFolder<CommandExport>("commands")
	for (const { data, execute } of res) {
		client.commands.set(data.name, { data, execute });
	}
}

async function registerEventsToClient(client: ReadyClient) {
	const res = await getExportsFromFilesInFolder<EventExport>("events")
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
	client.once(Events.ClientReady, c => {
		console.log(`Ready! Logged in as ${c.user.tag}`);
	});

	registerCommandsToClient(client);
}

main();