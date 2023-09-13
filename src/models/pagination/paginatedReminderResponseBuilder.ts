import { reminders } from "@prisma/client";
import { PaginatedMessage } from "@sapphire/discord.js-utilities";
import { EmbedBuilder } from "discord.js";
import { ReminderPages } from "./ReminderPaginationDataCollection";
import { reminderAPIEmbedSchema } from "./embedAPI";
import { paginatedMessageMessageOptionsSchema } from "./paginatedPage";

const defaultEmbedBuilder = new EmbedBuilder()
	.setColor("Blue")
	.setAuthor({ name: "5StarTaskerPlaceholder" });

/**
 * @example
 * 	function example(
 * 		arg1: string = "5-star-tasker-placeholder",
 * 		arg2 = "Blue" as const
 * 	) {
 * 		const reminderNamePlaceholder = "reminderNamePlaceholder";
 * 		const reminderValuePlaceholder = "reminderValuePlaceholder";
 *
 * 		const message = new PaginatedMessage({
 * 			template: new EmbedBuilder()
 * 				.setColor(arg2)
 * 				.setAuthor({ name: arg1 }),
 * 		})
 * 			.setSelectMenuOptions((pageIndex) => ({
 * 				label: ["embed1Placeholder", "embed2Placeholder"][
 * 					pageIndex - 1
 * 				],
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
 * 					console.log(collector.eventNames());
 * 				},
 * 			});
 * 		return message;
 * 	}
 */
export class ReminderPaginatedResponseBuilder extends PaginatedMessage {
	/**
	 * Constructs a new instance of the PaginatedReminderResponseBuilder class.
	 * @param reminderPageData Contains a map of page index to reminder data, which is another map of reminder ID to reminder data.
	 */
	public constructor(private readonly reminderPages: ReminderPages) {
		super({
			template: defaultEmbedBuilder,
		});
		this.addPageEmbed((embed) =>
			embed.addFields(
				{
					name: "embed1Placeholder",
					value: [
						"val1Placeholder",
						`val2Placeholder`,
						`val3Placeholder`,
						`val4Placeholder`,
					].join("\n"),
				},
				{
					name: "1",
					value: "2",
				}
			)
		);
	}

	public generatePages() {
		// generate data needed to build a page, which has a set of actions mapped to the fields and one embed with 5 fields
		// then dynamically use builder utils from that data
		const pages = this.reminderPages.map((page) => {});

		return this;
	}

	public static fromReminderData(reminders: reminders[], pageSize = 5) {
		return new this(ReminderPages.fromReminders(reminders, { pageSize }));
	}

	public getEmbedDataOfAllPages() {
		const res = paginatedMessageMessageOptionsSchema
			.array()
			.parse(this.pages)
			.map((page) => {
				return page.embeds;
			});

		return reminderAPIEmbedSchema.array().parse(res);
	}

	public getEmbedFieldsOfFirstPage() {
		const res = paginatedMessageMessageOptionsSchema
			.array()
			.parse(this.pages)
			.flatMap((page) => {
				const res2 = reminderAPIEmbedSchema.array().nonempty().parse(page.embeds);
				return res2[0].fields;
			});

		return res;
	}
}
