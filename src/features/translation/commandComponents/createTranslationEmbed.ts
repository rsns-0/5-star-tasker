import { ColorResolvable, EmbedBuilder } from 'discord.js';

export const createTranslationEmbed = (
	translatedText: string,
	sourceLanguage: string,
	targetLanguage: string,
	color: ColorResolvable
): EmbedBuilder => {
	const embed = new EmbedBuilder()
		.setColor(color)
		.setTitle(`${sourceLanguage} to ${targetLanguage}`)
		.setDescription(translatedText)
		.setFooter({ text: 'Translated using DeepL API' });
	return embed;
};
