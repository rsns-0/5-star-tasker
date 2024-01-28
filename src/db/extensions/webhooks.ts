import { Channel, Webhook } from "discord.js"
import { WebhookService, assertWebhookChannel } from "../../services/webhookService"

import { Prisma } from "@prisma/client"
import { container } from "@sapphire/framework"
import { db2 } from "../kyselyInstance"
import { sql } from "kysely"

export default Prisma.defineExtension((prisma) => {
	return prisma.$extends({
		name: "webhookExtension",
		model: {
			webhooks: {
				async createWebhookInDiscordAndDatabase(channel: Channel) {
					assertWebhookChannel(channel)
					const res = await container.webhookService.createWebhookInChannel(channel)
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
										id: channel.id,
									},
									create: {
										id: channel.id,
										name: channel.name,
										discord_guilds: {
											connectOrCreate: {
												where: {
													id: channel.guild.id,
												},
												create: {
													id: channel.guild.id,
													name: channel.guild.name,
												},
											},
										},
									},
								},
							},
						},
					})
				},
				async deleteWebhookInDiscordAndDatabase(webhookId: string) {
					await new WebhookService().deleteWebhookById(webhookId)
					return await container.prisma.webhooks.delete({
						where: {
							id: webhookId,
						},
					})
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
										id: webhook.channelId,
									},
									create: {
										id: webhook.channelId,
										name: webhook.channel?.name,
										discord_guilds: {
											connectOrCreate: {
												where: {
													id: webhook.guildId,
												},
												create: {
													id: webhook.guildId,
													name: webhook.sourceGuild?.name,
												},
											},
										},
									},
								},
							},
						},
					})
				},

				async upsertMany(webhooks: Webhook[]) {
					if (!webhooks.length) {
						return []
					}
					return db2
						.insertInto("webhooks")
						.values(
							webhooks.map((s) => ({
								discord_channel_id: s.channelId,
								id: s.id,
								name: s.name,
								token: s.token,
								url: s.url,
							}))
						)
						.onConflict((oc) =>
							oc.column("id").doUpdateSet((s) => ({
								name: s.ref("excluded.name"),
								token: s.ref("excluded.token"),
								url: s.ref("excluded.url"),
								discord_channel_id: s.ref("excluded.discord_channel_id"),
							}))
						)
						.returning(["webhooks.id"])
						.execute()
				},

				/**
				 * Deletes all webhooks that are NOT in the specified IDs. If the array is empty,
				 * nothing is deleted.
				 */
				async deleteWebhooksExcept(ids: string[]) {
					if (ids.length === 0) return []

					const insertDeletedHooksQuery = createDeleteWebhooksExceptBuilder(ids)

					return await insertDeletedHooksQuery.execute().catch((e) => {
						container.dbLogger.error(insertDeletedHooksQuery.compile().sql)
						throw e
					})
				},
			},
		},
	})
})

function createDeleteWebhooksExceptBuilder(ids: string[]) {
	const cols = Object.values(Prisma.WebhooksScalarFieldEnum)
	const colsWithPrefixes = cols.map((s) => `webhooks.${s}` as const)

	const toDelete = db2
		.selectFrom("webhooks")
		.select("webhooks.id")
		.except(sql<{ id: string }>`SELECT UNNEST(ARRAY[${sql.join(ids)}])`)
		.as("toDelete")

	const deletedHooks = db2
		.deleteFrom("webhooks")
		.using(toDelete)
		.whereRef("webhooks.id", "=", "toDelete.id")
		.returning(colsWithPrefixes)

	return db2
		.with("deletedHooks", () => deletedHooks)
		.insertInto("deleted_webhooks")
		.columns(cols)
		.expression((eb) => eb.selectFrom("deletedHooks").selectAll())
		.returning(["id", "db_id"])
		.onConflict((oc) => oc.doNothing())
}
