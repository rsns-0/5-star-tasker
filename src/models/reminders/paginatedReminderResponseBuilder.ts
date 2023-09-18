import { reminders } from "@prisma/client"

import { ReminderPages } from "./ReminderPaginationDataCollection"
import { pageSchema, reminderAPIEmbedSchema } from "../pagination/embedAPI"
import { PaginatedMessage } from "@sapphire/discord.js-utilities"
import { EmbedBuilder } from "discord.js"

const defaultEmbedBuilder = new EmbedBuilder()
	.setColor("Blue")
	.setAuthor({ name: "5StarTaskerPlaceholder" })

/**
 * @example
 * 	function example(arg1: string = "5-star-tasker-placeholder", arg2 = "Blue" as const) {
 * 		const reminderNamePlaceholder = "reminderNamePlaceholder"
 * 		const reminderValuePlaceholder = "reminderValuePlaceholder"
 *
 * 		const message = new PaginatedMessage({
 * 			template: new EmbedBuilder().setColor(arg2).setAuthor({ name: arg1 }),
 * 		})
 * 			.setSelectMenuOptions((pageIndex) => ({
 * 				label: ["embed1Placeholder", "embed2Placeholder"][pageIndex - 1],
 * 			}))
 * 			.addPageEmbed((embed) =>
 * 				embed.addFields(
 * 					{
 * 						name: "embed1Placeholder",
 * 						value: [
 * 							"val1Placeholder",
 * 							`val2Placeholder`,
 * 							`val3Placeholder`,
 * 							`val4Placeholder`,
 * 						].join("\n"),
 * 					},
 * 					{
 * 						name: reminderNamePlaceholder,
 * 						value: reminderValuePlaceholder,
 * 					}
 * 				)
 * 			)
 * 			.addPageEmbed((embed) =>
 * 				embed.addFields(
 * 					{
 * 						name: "embed2Placeholder",
 * 						value: [
 * 							"val5Placeholder",
 * 							`val6Placeholder`,
 * 							`val7Placeholder`,
 * 							`val8Placeholder`,
 * 						].join("\n"),
 * 					},
 * 					{
 * 						name: reminderNamePlaceholder,
 * 						value: reminderValuePlaceholder,
 * 					}
 * 				)
 * 			)
 * 			.addAction({
 * 				customId: "5-star-tasker-placeholder",
 * 				style: 2,
 * 				emoji: "⏹️",
 * 				type: 2,
 * 				run: ({ collector }) => {
 * 					console.log(collector.eventNames())
 * 				},
 * 			})
 * 		return message
 * 	}
 */
export class ReminderPaginatedResponseBuilder extends PaginatedMessage {
	public static fromReminderData(reminders: reminders[], pageSize = 5) {
		const _pre = new this(ReminderPages.fromReminders(reminders, { pageSize }))
		return this.generatePages(_pre)
	}

	/**
	 * Constructs a new instance of the PaginatedReminderResponseBuilder class.
	 *
	 * @param reminderPageData Contains a map of page index to reminder data, which is another map
	 *   of reminder ID to reminder data.
	 */
	public constructor(public readonly reminderPages: ReminderPages) {
		super({
			template: defaultEmbedBuilder,
		})
	}

	private static generatePages(_pre: ReminderPaginatedResponseBuilder) {
		for (const page of _pre.reminderPages) {
			const embed = page.toEmbedBuilder()
			_pre.addPageEmbed(embed)
			_pre.addPageActions(page.getActions(), page.index)
		}

		return _pre
	}

	public getEmbedDataOfAllPages() {
		const res = pageSchema
			.array()
			.parse(this.pages)
			.map((page) => {
				return page.embeds
			})

		return reminderAPIEmbedSchema.array().parse(res)
	}

	public getEmbedFieldsOfFirstPage() {
		const res = pageSchema
			.array()
			.parse(this.pages)
			.flatMap((page) => {
				return page.embeds[0].data.fields
			})

		return res
	}
}
