import {
	partiallyInitializeClient,
	registerCommandsToClient,
	registerCommandsToDiscord,
	registerEventsToClient,
} from "./init/initClient";

import dotenv from "dotenv";

function main() {
	dotenv.config();
	const clientId = process.env.DISCORD_CLIENT_ID;
	const guildId = process.env.DISCORD_DEV_SERVER_ID;
	const token = process.env.DISCORD_TOKEN;

	if (!clientId || !guildId || !token) {
		throw new Error("Missing discord settings");
	}
	const client = partiallyInitializeClient();
	client.login(token);
	registerCommandsToClient(client);
	registerEventsToClient(client);
	registerCommandsToDiscord({
		clientId,
		guildId,
		token,
	})
}

main();
