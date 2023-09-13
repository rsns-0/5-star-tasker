import { PaginatedMessage, PaginatedMessagePage } from "@sapphire/discord.js-utilities";
import { EmbedBuilder, EmbedField, time } from "discord.js";

import { reminders } from "@prisma/client";
import { ReminderComponentData } from "../../types/paginationTypes";
import { ReminderDataPaginationCollection } from "./ReminderPaginationDataCollection";
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
export class ReminderPaginatedMessage extends PaginatedMessage {
	/**
	 * Constructs a new instance of the PaginatedReminderResponseBuilder class.
	 * @param reminderPageData Contains a map of page index to reminder data, which is another map of reminder ID to reminder data.
	 */
	public constructor(private readonly reminderData: ReminderDataPaginationCollection) {
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

	public static fromReminderData(reminders: reminders[], pageSize = 5) {
		return new this(ReminderDataPaginationCollection.fromReminders(reminders, { pageSize }));
	}

	public generatePages() {
		const pages = this.reminderData.map((data) => {
			const fields = Array.from(data).map(([_, data], i) => {
				const embedField: EmbedField = {
					name: `Entry ${i + 1}`,
					value: `Time: ${time(data.time)}\nMessage: ${data.message}`,
					inline: false,
				};
				return embedField;
			});
			const embed = new EmbedBuilder({
				fields: fields,
				description: "Reminders",
				author: { name: "Edit your reminders" },
			});

			const actions = data.map((data) => data.button);
			actions.push(...ReminderPaginatedMessage.defaultActions);

			const page: PaginatedMessagePage = {
				actions: actions,
				embeds: [embed],
			};

			return page;
		});

		return this;
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

function create(data: ReminderComponentData, entryIndex: number) {
	const embedField: EmbedField = {
		name: `Entry ${entryIndex + 1}`,
		value: `Time: ${time(data.time)}\nMessage: ${data.message}`,
		inline: false,
	};
	return embedField;
}
