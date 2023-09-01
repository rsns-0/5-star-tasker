import {
	partiallyInitializeClient,
	registerCommandsToClient,
	registerCommandsToDiscord,
	registerEventsToClient,
} from "./init/initClient";

import { cooldownServiceInstanceForDiscordJs } from "./services/cooldownServiceInstance";
import dotenv from "dotenv";
import { hoursToMilliseconds } from "date-fns";
import { logger } from "@/backend/logger/logger";

function main() {
	try {
		dotenv.config();
		const clientId = process.env.DISCORD_CLIENT_ID;
		const guildId = process.env.DISCORD_DEV_SERVER_ID;
		const token = process.env.DISCORD_TOKEN;

		if (!clientId || !guildId || !token) {
			throw new Error("Missing discord settings");
		}
		cooldownServiceInstanceForDiscordJs.startCleanupInterval(hoursToMilliseconds(1));
		const client = partiallyInitializeClient();
		client.login(token);
		registerCommandsToClient(client);
		registerEventsToClient(client);
		registerCommandsToDiscord({
			clientId,
			guildId,
			token,
		});
	} catch (e) {
		logger.error(`Something went wrong with the discord bot server: ${e}`);
		throw e;
	}
}

main();
