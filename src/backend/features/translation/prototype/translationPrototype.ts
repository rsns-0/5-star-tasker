import axios from "axios";

type DeepLPostBody = {
	text: string[];
	target_lang: string;
};

type DeepLHeader = {
	Authorization: `DeepL-Auth-Key ${string}`;
	"Content-Type": "application/json";
};

export class TranslationPrototype {
	public static async main() {
		const apiKey = process.env.DEEPL_KEY;
		if (!apiKey) {
			throw new Error("Missing deepL API key");
		}
		const url = "https://api-free.deepl.com/v2/translate";
		const body: DeepLPostBody = {
			text: ["hello world"],
			target_lang: "ES",
		};
		const header: DeepLHeader = {
			Authorization: `DeepL-Auth-Key ${process.env.DEEPL_KEY}`,
			"Content-Type": "application/json",
		};

		const res = await axios.post<DeepLHeader>(url, body, {
			headers: header,
		});
		console.log(res.data);
        return res.data
	}
}
