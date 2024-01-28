import "./lib/setup";

import { LogLevel, SapphireClient } from "@sapphire/framework"
import { GatewayIntentBits, Partials } from "discord.js"
import { logger } from "./logger/logger"

const client = new SapphireClient({
	defaultPrefix: "!",
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug,
	},
	shards: "auto",
	intents: [
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildWebhooks,
	],
	partials: [Partials.Channel],
	loadMessageCommandListeners: true,
	defaultCooldown: {
		delay: 1_000,
	},
})

const main = async () => {
	try {
		try {
			client.logger.info("Logging in")
			await client.login()
			client.logger.info("logged in")
		} catch (error) {
			if (!client.isReady()) {
				client.logger.fatal(error)
				client.destroy()
				process.exit(1)
			} else {
				logger.emit("error", error)
				client.logger.error(error)
			}
		}
	} catch (error) {
		client.logger.error(error)
	}
}

main();
