import { userMention, type MessageReaction, type User } from "discord.js"

import { Events, Listener } from "@sapphire/framework"

import { ApplyOptions } from "@sapphire/decorators"

import { createTranslationEmbed } from "../../../embeds/createTranslationEmbed"
import { TranslationServiceError } from "../../../features/translation/models/translationServiceError"
import { cooldownServiceInstanceForDiscordJs } from "../../../utils/cooldownServiceInstance"

const name = "reactTranslation"
cooldownServiceInstanceForDiscordJs.registerCommandCooldown(name, 5000)
const DEFAULT_ACCENT_COLOR = 0x0099ff

@ApplyOptions<Listener.Options>({ event: Events.MessageReactionAdd })
export class UserEvent extends Listener<typeof Events.MessageReactionAdd> {
	/**
	 * Subscribes to all MessageReactionAdd events. On any flag emojis, responds to user that
	 * activated the flag emoji with the translation details of the message that was reacted upon.
	 */
	public override async run(reaction: MessageReaction, user: User) {
		// check null values
		const content = reaction.message.content
		const emojiName = reaction.emoji.name

		if (content === null) {
			throw new Error("Unexpected null value in text to translate.")
		}
		if (emojiName === null) {
			throw new Error("Unexpected null value in emoji reaction ID.")
		}

		// check if emoji was a flag emoji, if not, return
		const targetLanguage = await this.container.prisma.languages.getDeepLIsoCode(emojiName)
		if (!targetLanguage) {
			return // no throwing since user can react with any emoji
		}

		const { isOnCooldown } = await this.container.cooldownService.processUserCooldown(
			user.id,
			name
		)
		if (isOnCooldown) {
			return
		}

		const result = await this.container.translationService.translate({
			text: content,
			targetLanguage,
		})

		const { channel } = await reaction.message.fetch()
		if (result instanceof TranslationServiceError) {
			const { message } = result.autoResolve()
			await channel.send({
				content: `${userMention(user.id)}\n${message}`,
			})
			return
		}

		const { sourceLanguage, text } = result
		const color = reaction.client.user.accentColor ?? DEFAULT_ACCENT_COLOR
		const embed = createTranslationEmbed(text, sourceLanguage, targetLanguage, color)
		return await channel.send({
			content: userMention(user.id),
			embeds: [embed],
			allowedMentions: { parse: ["users"] },
		})
	}
}
