import './lib/setup';

import { GatewayIntentBits, Partials } from 'discord.js';
import { LanguageRepository, TranslationService, languageRepository } from './features/translation';
import { LogLevel, SapphireClient } from '@sapphire/framework';

import { CooldownService } from './features/cooldowns';
import { container } from '@sapphire/pieces';
import prisma from './db/prismaInstance';

declare module '@sapphire/pieces' {
	export interface Container {
		translationService: TranslationService;
		cooldownService: CooldownService;
		languageRepository: LanguageRepository;
		prisma: typeof prisma;
	}
}

container.translationService = new TranslationService();
container.cooldownService = new CooldownService();
container.languageRepository = languageRepository;
container.prisma = prisma;

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
	loadMessageCommandListeners: true
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
