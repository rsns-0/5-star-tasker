import { container } from "@sapphire/framework";
import { Guild } from "discord.js";

export class GuildService {
	async getBotGuildById(id: string) {
		return container.client.guilds.cache.get(id);
	}

	async getBotGuilds(filter: (guild: Guild) => boolean) {
		return container.client.guilds.cache.filter(filter);
	}
}
