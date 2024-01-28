import { container } from "@sapphire/pieces"
import prisma from "../db/prismaInstance"
import { CooldownService } from "../features/cooldowns"
import { TranslationService } from "../features/translation"
import { logger } from "../logger/logger"
import { ChannelService } from "../services/channelService"
import { GuildService } from "../services/guildService"
import { WebhookService } from "../services/webhookService"
import { UserService } from "../services/userService"
import { UpdaterService } from "../services/updaterService"

declare module "@sapphire/pieces" {
	export interface Container {
		translationService: TranslationService
		cooldownService: CooldownService
		prisma: typeof prisma
		webhookService: WebhookService
		dbLogger: typeof logger
		channelService: ChannelService
		guildService: GuildService
		userService: UserService
		updaterService: UpdaterService
	}
}

container.translationService = new TranslationService()
container.cooldownService = new CooldownService()

container.prisma = prisma
container.webhookService = new WebhookService()
container.dbLogger = logger
container.channelService = new ChannelService()
container.guildService = new GuildService()
container.userService = new UserService()
container.updaterService = new UpdaterService()

export const _container = container
