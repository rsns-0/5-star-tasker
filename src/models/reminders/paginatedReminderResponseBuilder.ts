import { reminders } from "@prisma/client"


import {
	AnyInteractableInteraction,
	PaginatedMessage,
	PaginatedMessageInteractionUnion,
	PaginatedMessageStopReasons,
	SafeReplyToInteractionParameters,
	isAnyInteractableInteraction,
	isAnyInteraction,
	isMessageInstance,
} from "@sapphire/discord.js-utilities"

import {
	Collection,
	EmbedBuilder,
	GatewayIntentBits,
	IntentsBitField,
	Message,
	Partials,
	Snowflake,
	User,
} from "discord.js"

import { ReminderPages } from "./ReminderPaginationDataCollection"
import { pageSchema, reminderAPIEmbedSchema } from "../pagination/embedAPI"

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
	#thisMazeWasNotMeantForYouContent = {
		content: "This maze wasn't meant for you...what did you do.",
	}
	public static fromReminderData(reminders: reminders[], pageSize = 5) {
		return new this(ReminderPages.fromReminders(reminders, { pageSize }))
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

	public generatePages() {
		for (const page of this.reminderPages) {
			const embed = page.toEmbedBuilder()
			this.addPageEmbed(embed)
			this.addPageActions(page.getActions(), page.index)
		}

		return this
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

	public override async run(
		messageOrInteraction: Message | AnyInteractableInteraction,
		target?: User
	): Promise<this> {
		// If there is no channel then exit early and potentially emit a warning
		if (!messageOrInteraction.channel) {
			const isInteraction = isAnyInteraction(messageOrInteraction)
			let shouldEmitWarning = this.emitPartialDMChannelWarning

			// If we are to emit a warning,
			//   then check if a warning was already emitted,
			//   in which case we don't want to emit a warning.
			if (shouldEmitWarning && this.hasEmittedPartialDMChannelWarning) {
				shouldEmitWarning = false
			}

			// If we are to emit a warning,
			//   then check if the interaction is an interaction based command,
			//   and check if the client has the Partials.Channel partial,
			//   in which case we don't want to emit a warning.
			if (
				shouldEmitWarning &&
				isInteraction &&
				messageOrInteraction.client.options.partials?.includes(Partials.Channel)
			) {
				shouldEmitWarning = false
			}

			// IF we are to emit a warning,
			//   then check if the interaction is a message based command,
			//   and check if the client has the Partials.Channel partial,
			//   and check if the client has the 'DIRECT_MESSAGE' intent',
			//   in which case we don't want to emit a warning.
			if (
				shouldEmitWarning &&
				!isInteraction &&
				messageOrInteraction.client.options.partials?.includes(Partials.Channel) &&
				new IntentsBitField(messageOrInteraction.client.options.intents).has(
					GatewayIntentBits.DirectMessages
				)
			) {
				shouldEmitWarning = false
			}

			// If we should emit a warning then do so.
			if (shouldEmitWarning) {
				process.emitWarning(
					[
						"PaginatedMessage was initiated in a DM channel without the client having the required partial configured.",
						'If you want PaginatedMessage to work in DM channels then make sure you start your client with "CHANNEL" added to "client.options.partials".',
						'Furthermore if you are using message based commands (as opposed to application commands) then you will also need to add the "DIRECT_MESSAGE" intent to "client.options.intents"',
						'If you do not want to be alerted about this in the future then you can disable this warning by setting "PaginatedMessage.emitPartialDMChannelWarning" to "false", or use "setEmitPartialDMChannelWarning(false)" before calling "run".',
					].join("\n"),
					{
						type: "PaginatedMessageRunsInNonpartialDMChannel",
						code: "PAGINATED_MESSAGE_RUNS_IN_NON_PARTIAL_DM_CHANNEL",
					}
				)
				this.hasEmittedPartialDMChannelWarning = true
			}

			await safelyReplyToInteraction({
				messageOrInteraction,
				interactionEditReplyContent: this.#thisMazeWasNotMeantForYouContent,
				interactionReplyContent: {
					...this.#thisMazeWasNotMeantForYouContent,
					ephemeral: true,
				},
				componentUpdateContent: this.#thisMazeWasNotMeantForYouContent,
				messageMethod: "reply",
				messageMethodContent: this.#thisMazeWasNotMeantForYouContent,
			})

			return this
		}

		// Assign the target based on whether a Message or CommandInteraction was passed in
		target ??= isAnyInteraction(messageOrInteraction)
			? messageOrInteraction.user
			: messageOrInteraction.author

		// Try to get the previous PaginatedMessage for this user
		const paginatedMessage = PaginatedMessage.handlers.get(target.id)
		// If a PaginatedMessage was found then stop it
		paginatedMessage?.collector?.stop()

		// If the message was sent by a bot, then set the response as this one
		if (isAnyInteraction(messageOrInteraction)) {
			if (
				messageOrInteraction.user.bot &&
				messageOrInteraction.user.id === messageOrInteraction.client.user?.id
			) {
				this.response = messageOrInteraction
			}
		} else if (
			messageOrInteraction.author.bot &&
			messageOrInteraction.author.id === messageOrInteraction.client.user?.id
		) {
			this.response = messageOrInteraction
		}

		await this.resolvePagesOnRun(messageOrInteraction, target)

		// Sanity checks to handle
		if (!this.messages.length) throw new Error("There are no messages.")
		if (!this.actions.size) throw new Error("There are no actions.")

		await this.setUpMessage(messageOrInteraction)

		this.setUpCollector(messageOrInteraction.channel, target)

		const messageId = this.response!.id

		if (this.collector) {
			this.collector.once("end", () => {
				PaginatedMessage.messages.delete(messageId)
				PaginatedMessage.handlers.delete(target!.id)
			})

			PaginatedMessage.messages.set(messageId, this)
			PaginatedMessage.handlers.set(target.id, this)
		}

		return this
	}

	protected override async handleEnd(
		_: Collection<Snowflake, PaginatedMessageInteractionUnion>,
		reason: PaginatedMessageStopReasons
	): Promise<void> {
		// Ensure no race condition can occur where interacting with the message when the paginated message closes would otherwise result in a DiscordAPIError

		if (
			(reason === "time" || reason === "idle") &&
			this.response !== null &&
			isAnyInteraction(this.response) &&
			this.response.isMessageComponent()
		) {
			this.response.message = await this.response.fetchReply()
		}

		// Remove all listeners from the collector:
		this.collector?.removeAllListeners()

		// Do not remove components if the message, channel, or guild, was deleted:
		if (this.response && !PaginatedMessage.deletionStopReasons.includes(reason)) {
			void safelyReplyToInteraction({
				messageOrInteraction: this.response,
				interactionEditReplyContent: { components: [] },
				interactionReplyContent: {
					...this.#thisMazeWasNotMeantForYouContent,
					ephemeral: true,
				},
				componentUpdateContent: { components: [] },
				messageMethod: "edit",
				messageMethodContent: { components: [] },
			})
		}
	}
}
async function safelyReplyToInteraction<T extends "edit" | "reply">(
	parameters: SafeReplyToInteractionParameters<T>
) {
	if (isAnyInteractableInteraction(parameters.messageOrInteraction)) {
		if (parameters.messageOrInteraction.replied || parameters.messageOrInteraction.deferred) {
			await parameters.messageOrInteraction.editReply(parameters.interactionEditReplyContent)
		} else if (parameters.messageOrInteraction.isMessageComponent()) {
			await parameters.messageOrInteraction.update(parameters.componentUpdateContent)
		} else {
			await parameters.messageOrInteraction.reply(parameters.interactionReplyContent)
		}
	} else if (
		parameters.messageMethodContent &&
		parameters.messageMethod &&
		isMessageInstance(parameters.messageOrInteraction)
	) {
		await parameters.messageOrInteraction[parameters.messageMethod](
			parameters.messageMethodContent as any
		)
	}
}
