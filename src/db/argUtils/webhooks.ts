import { type OwnedWebhook } from "../../types/webhookTypes";

export function createWebhookArg(webhook: OwnedWebhook, channelId: string) {
	return {
		id: webhook.id,
		name: webhook.name,
		created_at: webhook.createdAt,
		token: webhook.token,
		url: webhook.url,
		discord_channel_id: channelId,
	};
}
