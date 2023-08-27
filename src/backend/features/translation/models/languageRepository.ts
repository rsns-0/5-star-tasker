import { TransactionException } from "@/utils/errors/transactionException";
import { ValueOf } from "@/utils/types";
import prisma from "@/backend/db/prismaInstance";
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

export type LanguageAbbreviationStrategy<T, R> = (this: any, input: T) => R;


class LanguageAbbreviationStrategies {
	async byEmoji(input: string) {
		const res = await prisma.languages.findMany({
			where: {
				countries: {
					some: {
						flag_emoji: input,
					},
				},
			},
			select: {
				abbreviation: true,
			},
			take: 1,
		});
		return res.length ? res[0].abbreviation : null;
	}

	async byAbbreviation(input: string) {
		const res = await prisma.languages.findUnique({
			where: {
				abbreviation: input,
			},
			select: {
				abbreviation: true,
			},
		});
		return res?.abbreviation ?? null;
	}

	async byName(input: string) {
		const res = await prisma.languages.findUnique({
			where: {
				name: input,
			},
			select: {
				abbreviation: true,
			},
		});
		return res?.abbreviation ?? null;
	}

	async byCountryName(input: string) {
		const res = await prisma.languages.findMany({
			where: {
				countries: {
					some: {
						name: {
							equals: input,
						},
					},
				},
			},
			select: {
				abbreviation: true,
			},
			take: 1,
		});
		
		return res.length ? res[0].abbreviation : new TransactionException("No country found." as const)
		
	}

	private querySchema = z
		.object({ abbreviation: z.string() })
		.array()
		.transform((val) => {
			if (val.length === 0) {
				return null;
			}
			return val[0].abbreviation;
		});

	async byCountryName2(input: string) {
		const res = await prisma.$queryRaw`SELECT * FROM get_language_by_country_name(${input})`;
		return this.querySchema.parse(res);
	}
}
const languageAbbreviationStrategiesInstance = new LanguageAbbreviationStrategies();
export const languageRepository = new LanguageRepository();
