import { LanguageRepository, languageRepository } from '../features/translation';

import { CooldownService } from '../features/cooldowns';
import { TranslationService } from '../features/translation/services/translationService';
import { container } from '@sapphire/pieces';

declare module '@sapphire/pieces' {
	export interface Container {
		translationService: TranslationService;
		cooldownService: CooldownService;
		languageRepository: LanguageRepository
	}
}

container.translationService = new TranslationService();
container.cooldownService = new CooldownService();
container.languageRepository = languageRepository