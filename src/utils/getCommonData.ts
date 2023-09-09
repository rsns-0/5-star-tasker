import { container } from '@sapphire/framework';

export async function getCommonData() {
	await container.client.guilds.fetch();
	const channels = container.channelService.getGuildBasedChannels();
	const guilds = container.client.guilds.cache;
	const webhooks = container.webhookService.getAllOwnedWebhooks();
	return { channels, guilds, webhooks };
}
