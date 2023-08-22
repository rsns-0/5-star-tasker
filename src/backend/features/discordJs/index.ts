import { Client, Events, GatewayIntentBits } from "discord.js";
import { getCommandExports, getEventExports } from "./services/exportService";

import { Collection } from "discord.js";
import ReadyClient from "./models/client";
import client from "./models/clientCreation";
import dotenv from "dotenv";
import { registerCommandsToDiscord } from "./deploy-commands";

export async function registerCommandsToClient(client: ReadyClient) {
	const res = await getCommandExports();
	for (const { data, execute } of res) {
		client.commands.set(data.name, { data, execute });
	}
	registerCommandsToDiscord();
}

export async function registerEventsToClient(client: ReadyClient) {
	const res = await getEventExports();

	for (const { name, once, execute } of res) {
		const _name = name as string;
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
	registerEventsToClient(client);
}

main();
