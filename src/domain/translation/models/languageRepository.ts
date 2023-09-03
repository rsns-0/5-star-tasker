import { LanguageAbbreviationStrategy } from "../types/types";
import prisma from "../../../db/prismaInstance";
import { z } from "zod";

class LanguageRepository {
	public languageAbbreviationStrategies;

	constructor({ languageAbbreviationStrategies = languageAbbreviationStrategiesInstance } = {}) {
		this.languageAbbreviationStrategies = languageAbbreviationStrategies;
	}

	public async getLanguageAbbreviation<T, R>(
		input: T,
		strategy: LanguageAbbreviationStrategy<T, R>
	) {
		return await strategy(input);
	}
}

const querySchema = z
	.object({ abbreviation: z.string() })
	.array()
	.transform((val) => {
		if (val.length === 0) {
			return null;
		}
		return val[0].abbreviation;
	});

class LanguageAbbreviationStrategies {
	async byEmoji(input: string) {
		const res = await prisma.languages.findFirst({
			select: {
				abbreviation: true,
			},
			where: {
				countries: {
					some: {
						flag_emoji: {
							mode: "insensitive",
							equals: input,
						},
					},
				},
			},
		});
		return res?.abbreviation;
	}

	async byAbbreviation(input: string) {
		const res = await prisma.languages.findFirst({
			select: {
				abbreviation: true,
			},
			where: {
				abbreviation: input.toUpperCase(),
			},
		});
		return res?.abbreviation;
	}

	async byName(input: string) {
		const res = await prisma.languages.findFirst({
			select: {
				abbreviation: true,
			},
			where: {
				name: {
					mode: "insensitive",
					equals: input,
				},
			},
		});
		return res?.abbreviation;
	}

	async byCountryName(input: string) {
		const res = await prisma.languages.findFirst({
			select: {
				abbreviation: true,
			},
			where: {
				countries: {
					some: {
						name: {
							equals: input,
							mode: "insensitive",
						},
					},
				},
			},
		});

		return res?.abbreviation;
	}

	async byCountryNameOptimized(input: string) {
		const res =
			await prisma.$queryRaw`SELECT abbreviation FROM get_language_abbreviation_by_country_name(${input})`;
		return querySchema.parse(res);
	}
}
const languageAbbreviationStrategiesInstance = new LanguageAbbreviationStrategies();
export const languageRepository = new LanguageRepository();
