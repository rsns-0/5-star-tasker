import { Events, MessageReaction, User, userMention } from "discord.js";

import { TranslationService } from "@/backend/features/translation/services/translationService";
import { TranslationServiceError } from "@/backend/features/translation/models/translationServiceError";
import { cooldownServiceInstanceForDiscordJs } from "../../services/cooldownServiceInstance";
import { createTranslationEmbed } from "../../utils/createTranslationEmbed";
import { languageRepository } from "@/backend/features/translation/models/languageRepository";
import { logger } from "@/backend/logger/logger";

const name = Events.MessageReactionAdd;
const translation = new TranslationService();
const cooldown = 5000;
const DEFAULT_ACCENT_COLOR = 0x0099ff;

class MessageReactionAddHandlers {
	private static commandName: string = "translate";

	public static async canHandle(reaction: MessageReaction) {
		const emojiReactionName = reaction.emoji.name;

		if (!emojiReactionName) {
			return false;
		}
		const targetLanguage = await languageRepository.getLanguageAbbreviation(
			emojiReactionName,
			languageRepository.languageAbbreviationStrategies.byEmoji
		);
		if (!targetLanguage) {
			return false;
		}

		return true;
	}

	public static async translationReactions(reaction: MessageReaction, user: User) {
		const { channel } = await reaction.message.fetch();

		const textToTranslate = reaction.message.content;
		const emojiReactionName = reaction.emoji.name;

		if (textToTranslate === null) {
			throw new Error("Unexpected null value in text to translate.");
		}
		if (emojiReactionName === null) {
			throw new Error("Unexpected null value in emoji reaction ID.");
		}
		cooldownServiceInstanceForDiscordJs.processUserCooldown(user.id, this.commandName);

		const targetLanguage = await languageRepository.getLanguageAbbreviation(
			emojiReactionName,
			languageRepository.languageAbbreviationStrategies.byEmoji
		);
		if (!targetLanguage) {
			return; // no throwing since user can react with any emoji
		}

		const result = await translation.translateText({
			text: textToTranslate,
			targetLanguage,
		});
		if (result instanceof TranslationServiceError) {
			const { message } = result.autoResolve();
			await channel.send({
				content: `${userMention(user.id)}\n${message}`,
			});
			return;
		}

		const { sourceLanguage, text } = result[0];
		const color = reaction.client.user.accentColor || DEFAULT_ACCENT_COLOR;
		const embed = createTranslationEmbed(text, sourceLanguage, targetLanguage, color);

		try {
			await channel.send({
				content: userMention(user.id),
				embeds: [embed],
				allowedMentions: { parse: ["users"] },
			});
		} catch (e) {
			logger.error(e);
			await channel.send("An unknown server error occurred. Please try again later.");
		}
	}
}