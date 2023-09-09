import { Channel, Webhook } from 'discord.js';
import { WebhookService, assertWebhookChannel } from '../../services/webhookService';

import { Prisma } from '@prisma/client';
import { container } from '@sapphire/framework';

const webhookService = new WebhookService();

export default Prisma.defineExtension((prisma) => {
	return prisma.$extends({
		name: 'webhookExtension',
		model: {
			webhooks: {
				async createWebhookInDiscordAndDatabase(channel: Channel) {
					assertWebhookChannel(channel);
					const res = await container.webhookService.createWebhookInChannel(channel);
					return await container.prisma.webhooks.create({
						data: {
							id: res.id,
							name: res.name,
							created_at: res.createdAt,
							token: res.token,
							url: res.url,
							discord_channels: {
								connectOrCreate: {
									where: {
										id: channel.id
									},
									create: {
										id: channel.id,
										name: channel.name
									}
								}
							}
						}
					});
				},
				async deleteWebhookInDiscordAndDatabase(webhookId: string) {
					await webhookService.deleteWebhookById(webhookId);
					return await container.prisma.webhooks.delete({
						where: {
							id: webhookId
						}
					});
				},

				async registerWebhook(webhook: Webhook) {
					return await container.prisma.webhooks.create({
						data: {
							id: webhook.id,
							name: webhook.name,
							created_at: webhook.createdAt,
							token: webhook.token,
							url: webhook.url,
							discord_channels: {
								connectOrCreate: {
									where: {
										id: webhook.channelId
									},
									create: {
										id: webhook.channelId,
										name: webhook.channel?.name
									}
								}
							}
						}
					});
				}
			}
		}
	});
});
