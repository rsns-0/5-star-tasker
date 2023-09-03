import { LanguageAbbreviationStrategy } from "../strategies/languageAbbreviationStrategies";

export class LanguageRepository {
	private languageAbbreviationStrategies = new LanguageAbbreviationStrategy()
	public async getLanguageAbbreviation(input: string, strategy: keyof typeof this.languageAbbreviationStrategies) {
		return await this.languageAbbreviationStrategies[strategy](input);
	}
}

export const languageRepository = new LanguageRepository();
