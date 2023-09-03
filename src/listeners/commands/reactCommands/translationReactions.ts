import { type MessageReaction, type User, userMention } from 'discord.js';

import { logger } from '../../../logger/logger';
import { Events, Listener } from '@sapphire/framework';

import { ApplyOptions } from '@sapphire/decorators';
import { languageRepository } from '../../../features/translation/models/languageRepository';
import { TranslationServiceError } from '../../../features/translation/models/translationServiceError';
import { createTranslationEmbed } from '../../../features/translation/commandComponents/createTranslationEmbed';
import { cooldownServiceInstanceForDiscordJs } from '../../../utils/cooldownServiceInstance';

const name = 'reactTranslation';
cooldownServiceInstanceForDiscordJs.registerCommandCooldown(name, 5000)
const DEFAULT_ACCENT_COLOR = 0x0099ff;

@ApplyOptions<Listener.Options>({ event: Events.MessageReactionAdd})
export class UserEvent extends Listener<typeof Events.MessageReactionAdd> {
	
	public override async run(reaction: MessageReaction, user: User) {
		
		const { translationService: translation, cooldownService } = this.container;

		const { channel } = await reaction.message.fetch();

		const content = reaction.message.content;
		const emojiName = reaction.emoji.name;

		if (content === null) {
			throw new Error('Unexpected null value in text to translate.');
		}
		if (emojiName === null) {
			throw new Error('Unexpected null value in emoji reaction ID.');
		}

		const targetLanguage = await languageRepository.getLanguageAbbreviation(emojiName, "byEmoji");
		if (!targetLanguage) {
			return; // no throwing since user can react with any emoji
		}
		const res = await cooldownService.processUserCooldown(user.id, name);
		if (res.isOnCooldown) {
			return;
		}
		const result = await translation.translateText({
			text: content,
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
	}
}
