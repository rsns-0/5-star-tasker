import {
	partiallyInitializeClient,
	registerCommandsToClient,
	registerCommandsToDiscord,
} from "./init/initClient";

import dotenv from "dotenv";
import { registerEventsToClient } from "./init/initClient";

function main() {
	dotenv.config();
	const token = process.env.DISCORD_TOKEN;
	const guildId = process.env.GUILD_ID;
	const clientId = process.env.CLIENT_ID;

	if (!clientId || !guildId || !token) {
		throw new Error("Missing discord settings");
	}

	if (!token) {
		throw new Error("Missing discord token");
	}

	const client = partiallyInitializeClient();

	client.login(token);

	registerCommandsToClient(client);
	registerEventsToClient(client);
	registerCommandsToDiscord(token, guildId, clientId);
}

main();
