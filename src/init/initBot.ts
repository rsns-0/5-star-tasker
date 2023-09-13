import "../lib/setup";

import { LogLevel, SapphireClient, container } from "@sapphire/framework";
import { GatewayIntentBits, Partials } from "discord.js";

import prisma from "../db/prismaInstance";
import { CooldownService } from "../features/cooldowns";
import { TranslationService } from "../features/translation";
import { logger } from "../logger/logger";
import { ChannelService } from "../services/channelService";
import { GuildService } from "../services/guildService";
import { WebhookService } from "../services/webhookService";

declare module "@sapphire/pieces" {
	export interface Container {
		translationService: TranslationService;
		cooldownService: CooldownService;

		prisma: typeof prisma;
		webhookService: WebhookService;
		dbLogger: typeof logger;
		channelService: ChannelService;
		guildService: GuildService;
	}
}

container.translationService = new TranslationService();
container.cooldownService = new CooldownService();

container.prisma = prisma;
container.webhookService = new WebhookService();
container.dbLogger = logger;

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
	],
	partials: [Partials.Channel],
	loadMessageCommandListeners: true,
	defaultCooldown: {
		delay: 1_000,
	},
});

export const main = async () => {
	try {
		client.logger.info("Logging in");
		await client.login();
		client.logger.info("logged in");
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};
