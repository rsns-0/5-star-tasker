import { TranslationService } from '../domain/translation/services/translationService';
import { container } from '@sapphire/pieces';

const translationService = new TranslationService()

container.translationService = translationService;

declare module '@sapphire/pieces' {
	export interface Container {
		translationService: TranslationService;
	}
}
