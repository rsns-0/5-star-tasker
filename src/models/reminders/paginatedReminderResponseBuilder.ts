import { pageSchema } from "../pagination/embedAPI"
import { PaginatedMessage } from "@sapphire/discord.js-utilities"
import { ReminderData, ReminderPage, createPaginatedReminders } from "./ReminderPage"

import * as R from "remeda"

const WEBSITE_URL = "https://5-star-frontend.vercel.app/reminder-table" as const

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
export class ReminderPaginatedMessage extends PaginatedMessage {
	public static fromReminderData(
		reminders: ReminderData[],
		{ pageSize = 5, isExcess = false } = {}
	) {
		return R.pipe(
			reminders,
			(reminders) => createPaginatedReminders(reminders, { pageSize }),
			(pages) => new this(pages).setIsExcess(isExcess).generatePages().addEndingMessages()
		)
	}
	private _isExcess = false

	public constructor(public readonly reminderPages: ReminderPage[]) {
		super()
	}

	get isExcess() {
		return this._isExcess
	}

	setIsExcess(exceeded: boolean) {
		this._isExcess = exceeded
		return this
	}

	public addEndingMessages() {
		if (this.pages.length === 1) {
			// this is a workaround for a bug
			return this.addPageEmbed((embed) =>
				embed.setDescription("No further reminders to load.")
			)
		} else if (this.isExcess) {
			return this.addPageEmbed((embed) =>
				embed.setDescription(
					`Max reminder display reached. Please use the website to view all of your reminders. ${WEBSITE_URL}`
				)
			)
		}
		return this
	}

	generatePages() {
		for (const page of this.reminderPages) {
			this.addPageEmbed(page.toEmbedBuilder()).addPageActions(page.getActions(), page.index)
		}
		return this
	}

	public getEmbedDataOfAllPages() {
		return this.getParsedPages().map(({ embeds }) => embeds)
	}

	public getParsedPages() {
		return pageSchema.array().parse(this.pages)
	}

	public getEmbedFieldsOfFirstPage() {
		return this.getParsedPages().flatMap((page) => page.embeds[0].fields)
	}
}
