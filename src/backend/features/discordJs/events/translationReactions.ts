import { Events, MessageReaction, User } from "discord.js";

import { LanguageRepository } from "../../translation/models/languageRepository";
import { Logger } from "@/backend/logger/logger";
import { TranslationService } from "../../translation/services/translationService";
import { TranslationServiceError } from "../../translation/models/translationServiceError";
import { createTranslationEmbed } from "../utils/createTranslationEmbed";

const name = Events.MessageReactionAdd;
const translation = new TranslationService();
const logger = new Logger();
const DEFAULT_ACCENT_COLOR = 0x0099ff;

/**
 *
 * This event handler translates a target message when a user reacts to it with an emoji and replies to the reacter with the translation.
 *
 */
const execute = async (reaction: MessageReaction, user: User) => {
	const { channel } = await reaction.message.fetch();

	const textToTranslate = reaction.message.content;
	const emojiReactionID = reaction.emoji.name;

	if (textToTranslate === null) {
		throw new Error("Unexpected null value in text to translate.");
	}
	if (emojiReactionID === null) {
		throw new Error("Unexpected null value in emoji reaction ID.");
	}

	const targetLanguage =
		LanguageRepository.getInstance().getLanguageIfAvailableForTranslation(emojiReactionID);
	if (!targetLanguage) {
		return; // no throwing since user can react with any emoji
	}

	const result = await translation.translateTextWithValidation({
		text: textToTranslate,
		targetLanguage,
	});
	if (result instanceof TranslationServiceError) {
		const { message } = result.autoResolve();
		await channel.send({
			content: `<@${user.id}>\n${message}`,
		});
		return;
	}

	const { sourceLanguage, text } = result[0];
	const color = reaction.client.user.accentColor || DEFAULT_ACCENT_COLOR;
	const embed = createTranslationEmbed(text, sourceLanguage, targetLanguage, color);

	try {
		await channel.send({
			content: `<@${user.id}>`,
			embeds: [embed],
			allowedMentions: { parse: ["users"] },
		});
	} catch (e) {
		logger.logError(e);
		await channel.send("An unknown server error occurred. Please try again later.");
	}
};

export { name, execute };
