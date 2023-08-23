import { EmbedBuilder, Events, MessageReaction, TextChannel, User } from "discord.js";
import { emojiMap, languagesMap } from "../models/emojiMap";

import { Logger } from "@/backend/logger/logger";
import { TranslationService } from "../../translation/services/translationService";
import { ZodError } from "zod";
import client from "../models/clientCreation";
import { fromZodError } from "zod-validation-error";

const createTranslationEmbed = (
	translatedText: string,
	detectedSourceLanguage: string,
	originalSourceLanguage: string
): EmbedBuilder => {
	const botColor = (client.user.accentColor !== undefined) ? client.user.accentColor : 0x0099ff
	const embed = new EmbedBuilder()
		.setColor(botColor)
		.setTitle(`${detectedSourceLanguage} to ${originalSourceLanguage}`)
		.setDescription(translatedText)
		.setFooter({text: "Translated using DeepL API"});
	return embed;
};


const name = Events.MessageReactionAdd;
const translation = new TranslationService();
const logger = new Logger(); 


const execute = async (reaction: MessageReaction) => {
	const channel = await client.channels.fetch(reaction.message.channelId)
	const message = !reaction.message.author
		? await reaction.message.fetch()
		: reaction.message;
	console.log(message.content)
	console.log() 
	const textToTranslate = message.content;
	const emojiReactionID = reaction.emoji.name;
	if (textToTranslate === null) {
		throw new Error("Unexpected null value in text to translate.");
	};
	if (emojiReactionID === null) {
		throw new Error("Unexpected null value in emoji reaction ID.");
	};
	if (emojiMap[emojiReactionID] === undefined) { 
		return;
	};
	
	try {
		const res = await translation.translateText({
			text: [textToTranslate],
			targetLanguage: emojiMap[emojiReactionID],
		});
		const { detectedSourceLanguage, text } = res[0];
		const embed = createTranslationEmbed(text, languagesMap[detectedSourceLanguage], languagesMap[emojiMap[emojiReactionID]]);
		await reaction.message.reply({ embeds: [embed] });
	} catch (e) {
		if (e instanceof ZodError) {
			console.warn(`Entered first catch path. e is: ${e}`)
			const validationError = fromZodError(e);
			await reaction.message.reply(`${validationError}`);
			return;
		}
		console.warn(`Entered second catch path. e is ${e}`)
		logger.logError(e);
		(channel as TextChannel).send("An unknown server error occurred. Please try again later.");
	};
};

export { name, execute }