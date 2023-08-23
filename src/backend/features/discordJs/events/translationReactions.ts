import { EmbedBuilder, MessageReaction, User, Events } from "discord.js";
import { TranslationService } from "../../translation/services/translationService";
import { Logger } from "@/backend/logger/logger";
import { emojiMap } from "../models/emojiMap";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";


const createTranslationEmbed = (
	translatedText: string,
	detectedSourceLanguage: string,
	originalSourceLanguage: string
): EmbedBuilder => {
	const embed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle(`${detectedSourceLanguage} -> ${originalSourceLanguage}`)
		.setDescription(translatedText)
		.setFooter({
			text: "Translated by DeepL API",
		});
	return embed;
};

const name = Events.MessageReactionAdd;
const translation = new TranslationService();
const logger = new Logger();

// is the bot listening for every single reaction? if so, it ma	y be a good idea to add a cooldown to prevent spam. https://discordjs.guide/additional-features/cooldowns.html#resulting-code
const execute = async (reaction: MessageReaction, user: User) => {
	const textToTranslate = reaction.message.content;
	const emojiReactionID = reaction.emoji.id;
	if (textToTranslate === null) {
		throw new Error("Unexpected null value in text to translate.");
	}
	if (emojiReactionID === null) {
		throw new Error("Unexpected null value in emoji reaction ID.");
	}
	if (emojiMap[emojiReactionID] === undefined) {
		return;
	}

	try {
		const res = await translation.translateText({
			text: [textToTranslate],
			targetLanguage: emojiMap[emojiReactionID],
		});
		const { detectedSourceLanguage, text } = res[0];
		const embed = createTranslationEmbed(text, detectedSourceLanguage, emojiReactionID);
		await reaction.message.reply({ embeds: [embed] });
	} catch (e) {
		if (e instanceof ZodError) {
			const validationError = fromZodError(e);
			await reaction.message.reply(`${validationError}`);
			return;
		}
		logger.logError(e);
		await reaction.message.reply("An unknown server error occurred. Please try again later.");
	}
};

export { name, execute }