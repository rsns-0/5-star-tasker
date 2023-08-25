import { isKeyOf } from "@/utils/iskeyOf";

export class LanguageRepository {
	private readonly emojiMap = emojiMap
	private readonly languageMap = languageMap;
	private static instance: LanguageRepository | null = null;

	private constructor() {}

	public static getInstance() {
		if (!LanguageRepository.instance) {
			LanguageRepository.instance = new LanguageRepository();
		}
		return LanguageRepository.instance;
	}

	public languageIsAvailableForTranslation(languageAbbreviation: string) {
		return isKeyOf(languageAbbreviation, languageMap);
	}

	/**
	 * 
	 * @param input - The input can be an emoji, language abbreviation, or full language name.
	 * @returns The abbreviation for the language if it is available for translation, otherwise null.
	 */
	public getLanguageIfAvailableForTranslation(input: string) {
		if (isKeyOf (input, emojiMap)){
			const langAbbreviation = this.emojiMap[input]
			if(isKeyOf(langAbbreviation, languageMap)){
				return langAbbreviation
			}
		}
		if(isKeyOf(input,languageMap)){
			return input
		}
		if (Object.values(languageMap).includes(input as any)){
			const langAbbreviation = Object.keys(languageMap).find(key => languageMap[key as keyof typeof languageMap] === input)
			return langAbbreviation || null
		}
		
		return null
	}

    public getFullLanguageName(abbreviation:string){
        return isKeyOf(abbreviation, languageMap) ? this.languageMap[abbreviation] : null
    }
}



const emojiMap = {
	"🇨🇱": "ES",
	"🇨🇼": "NL",
	"🇳🇱": "NL",
	"🇨🇻": "PT",
	"🇦🇷": "ES",
	"🇫🇰": "EN",
	"🇱🇻": "LV",
	"🇷🇺": "RU",
	"🇻🇬": "EN",
	"🇧🇶": "NL",
	"🇨🇮": "FR",
	"🇰🇷": "KO",
	"🇱🇹": "LT",
	"🇮🇩": "ID",
	"🇷🇴": "RO",
	"🇨🇺": "ES",
	"🇧🇫": "FR",
	"🇮🇨": "ES",
	"🇨🇦": "EN",
	"🇦🇺": "EN",
	"🇩🇴": "ES",
	"🇬🇷": "EL",
	"🇧🇬": "BG",
	"🇬🇧": "EN",
	"🇿🇦": "EN",
	"🇸🇪": "SV",
	"🇰🇾": "EN",
	"🇪🇪": "ET",
	"🇩🇪": "DE",
	"🇫🇷": "FR",
	"🇧🇯": "FR",
	"🇦🇽": "DA",
	"🇨🇩": "FR",
	"🇵🇱": "PL",
	"🇩🇲": "EN",
	"🇧🇷": "PT",
	"🇦🇼": "NL",
	"🇧🇴": "ES",
	"🇯🇵": "JA",
	"🇦🇨": "EN",
	"🇩🇯": "FR",
	"🇮🇪": "EN",
	"🇨🇰": "EN",
	"🇧🇲": "EN",
	"🇮🇹": "IT",
	"🇦🇹": "DE",
	"🇧🇧": "EN",
	"🇳🇿": "EN",
	"🇧🇱": "EN",
	"🇦🇴": "PT",
	"🇸🇰": "SK",
	"🇧🇪": "NL",
	"🇭🇺": "HU",
	"🇫🇮": "FI",
	"🇵🇷": "ES",
	"🇲🇽": "ES",
	"🇪🇸": "ES",
	"🇨🇾": "EL",
	"🇨🇭": "DE",
	"🇧🇿": "EN",
	"🇧🇼": "EN",
	"🇹🇩": "FR",
	"🇦🇬": "EN",
	"🇨🇳": "ZH",
	"🇺🇸": "EN",
	"🇩🇰": "DA",
	"🇨🇫": "FR",
	"🇵🇹": "PT",
	"🇨🇷": "ES",
	"🇧🇸": "EN",
	"🇸🇮": "SL",
	"🇨🇬": "FR",
	"🇱🇺": "FR",
	"🇨🇨": "FR",
	"🇹🇼": "ZH",
	"🇭🇰": "ZH",
	"🇸🇬": "ZH",
	"🇲🇴": "ZH",
	"🇨🇴": "ES",
	"🇨🇲": "FR",
	"🇨🇿": "CS",
	"🇮🇴": "EN",
	"🇦🇶": "RU",
	"🇦🇮": "EN",
	"🇨🇽": "EN",
	"🇪🇺": "EN",
	"🇬🇶": "ES",
	"🇪🇨": "ES",
	"🇫🇴": "DA",
	"🇫🇯": "EN",
	"🇬🇫": "FR",
	"🇵🇫": "FR",
	"🇹🇫": "FR",
	"🇬🇦": "FR",
	"🇬🇲": "EN",
	"🇬🇺": "EN",
	"🇬🇵": "FR",
	"🇬🇩": "EN",
	"🇬🇱": "DA",
	"🇬🇮": "EN",
	"🇬🇭": "EN",
	"🇬🇹": "ES",
	"🇬🇬": "EN",
	"🇬🇳": "FR",
	"🇬🇼": "PT",
	"🇬🇾": "EN",
	"🇭🇹": "FR",
	"🇭🇳": "ES",
	"🇮🇲": "EN",
	"🇯🇲": "EN",
	"🇯🇪": "EN",
	"🇰🇮": "EN",
	"🇱🇮": "DE",
	"🇱🇷": "EN",
	"🇲🇻": "EN",
	"🇲🇱": "FR",
	"🇲🇩": "RO",
	"🇫🇲": "EN",
	"🇾🇹": "FR",
	"🇲🇺": "EN",
	"🇲🇶": "FR",
	"🇲🇭": "EN",
	"🇲🇨": "FR",
	"🇲🇪": "EN",
	"🇲🇿": "PT",
	"🇳🇦": "EN",
	"🇳🇷": "EN",
	"🇳🇨": "FR",
	"🇳🇮": "ES",
	"🇳🇬": "EN",
	"🇳🇺": "EN",
	"🇳🇫": "EN",
	"🇵🇬": "EN",
	"🇵🇦": "ES",
	"🇵🇼": "EN",
	"🇲🇵": "EN",
	"🇰🇵": "KO",
	"🇵🇾": "ES",
	"🇵🇪": "ES",
	"🇵🇳": "EN",
	"🇷🇪": "FR",
	"🇸🇳": "FR",
	"🇸🇹": "PT",
	"🇷🇼": "FR",
	"🇸🇨": "FR",
	"🇸🇽": "NL",
	"🇬🇸": "EN",
	"🇸🇧": "EN",
	"🇱🇨": "EN",
	"🇰🇳": "EN",
	"🇸🇭": "EN",
	"🇸🇸": "EN",
	"🇵🇲": "FR",
	"🇻🇨": "EN",
	"🇸🇿": "EN",
	"🇹🇹": "EN",
	"🇹🇴": "EN",
	"🇹🇰": "EN",
	"🇹🇬": "FR",
	"🇹🇱": "PT",
	"🇹🇷": "TR",
	"🇹🇲": "RU",
	"🇹🇨": "EN",
	"🇻🇮": "EN",
	"🇹🇻": "EN",
	"🇺🇦": "UK",
	"🇻🇪": "ES",
	"🇻🇦": "IT",
	"🇻🇺": "EN",
	"🇺🇾": "ES",
	"🇼🇫": "FR",
	"🇿🇲": "EN",
	"🇿🇼": "EN",
	"🇨🇵": "FR",
	"🇺🇲": "EN",
	"🇹🇦": "EN",
	"🇧🇻": "NB",
} as const

const languageMap = {
	BG: "Bulgarian",
	CS: "Czech",
	DA: "Danish",
	DE: "German",
	EL: "Greek",
	EN: "English",
	ES: "Spanish",
	ET: "Estonian",
	FI: "Finnish",
	FR: "French",
	HU: "Hungarian",
	ID: "Indonesian",
	IT: "Italian",
	JA: "Japanese",
	KO: "Korean",
	LT: "Lithuanian",
	LV: "Latvian",
	NB: "Norwegian",
	NL: "Dutch",
	PL: "Polish",
	PT: "Portuguese",
	RO: "Romanian",
	RU: "Russian",
	SK: "Slovak",
	SL: "Slovenian",
	SV: "Swedish",
	TR: "Turkish",
	UK: "Ukrainian",
	ZH: "Chinese",
} as const

