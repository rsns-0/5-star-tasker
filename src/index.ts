import './lib/setup';

import { GatewayIntentBits, Partials } from 'discord.js';
import { LogLevel, SapphireClient } from '@sapphire/framework';

import { ChannelService } from './services/channelService';
import { CooldownService } from './features/cooldowns';
import { GuildService } from './services/guildService';
import { TranslationService } from './features/translation';
import { WebhookService } from './services/webhookService';
import { container } from '@sapphire/pieces';
import { logger } from './logger/logger';
import prisma from './db/prismaInstance';

declare module '@sapphire/pieces' {
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
	defaultPrefix: '!',
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
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
		GatewayIntentBits.MessageContent
	],
	partials: [Partials.Channel],
	loadMessageCommandListeners: true,
	defaultCooldown: {
		delay: 1_000
	}
});

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
