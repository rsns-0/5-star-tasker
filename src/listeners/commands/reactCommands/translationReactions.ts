import { type MessageReaction, type User, userMention } from 'discord.js';
import { languageRepository } from '../../../domain/translation/models/languageRepository';
import { TranslationServiceError } from '../../../domain/translation/models/translationServiceError';
import { logger } from '../../../logger/logger';

import { Events, Listener } from '@sapphire/framework';

import { createTranslationEmbed } from '../../../utils/createTranslationEmbed';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Listener.Options>({ event: Events.MessageReactionAdd })
export class UserEvent extends Listener {
	public override async run(reaction: MessageReaction, user: User) {
		const translation = this.container.translationService;

		const { channel } = await reaction.message.fetch();

		const textToTranslate = reaction.message.content;
		const emojiReactionID = reaction.emoji.name;

		if (textToTranslate === null) {
			throw new Error('Unexpected null value in text to translate.');
		}
		if (emojiReactionID === null) {
			throw new Error('Unexpected null value in emoji reaction ID.');
		}

		const targetLanguage = await languageRepository.getLanguageAbbreviation(
			emojiReactionID,
			languageRepository.languageAbbreviationStrategies.byEmoji
		);
		if (!targetLanguage) {
			return; // no throwing since user can react with any emoji
		}

		const result = await translation.translateText({
			text: textToTranslate,
			targetLanguage
		});
		if (result instanceof TranslationServiceError) {
			const { message } = result.autoResolve();
			await channel.send({
				content: `${userMention(user.id)}\n${message}`
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
				allowedMentions: { parse: ['users'] }
			});
		} catch (e) {
			logger.error(e);
			await channel.send('An unknown server error occurred. Please try again later.');
		}

		// return message.channel.send(prefix ? `My prefix in this guild is: \`${prefix}\`` : 'Cannot find any Prefix for Message Commands.');
	}
}
const DEFAULT_ACCENT_COLOR = 0x0099ff;
//TODO: refactor event listener to be controller for functions that handle MessageReaction events.
