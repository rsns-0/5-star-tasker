import { Prisma } from '@prisma/client';
import prisma from '../../../db/prismaInstance';
import { z } from 'zod';

export class LanguageAbbreviationStrategy {
	private prisma = prisma;

	private async query(where: Prisma.languagesWhereInput) {
		const res = await this.prisma.languages.findFirst({
			select: {
				abbreviation: true
			},
			where
		});
		return res?.abbreviation;
	}

	public byEmoji = async (input: string) => {
		return this.query({
			countries: {
				some: {
					flag_emoji: {
						mode: 'insensitive',
						equals: input
					}
				}
			}
		});
	};

	public byAbbreviation = async (input: string) => {
		return this.query({ abbreviation: input.toUpperCase() });
	};

	public byName = async (input: string) => {
		return this.query({
			name: {
				mode: 'insensitive',
				equals: input
			}
		});
	};

	public byCountryName = async (input: string) => {
		return this.query({
			countries: {
				some: {
					name: {
						equals: input,
						mode: 'insensitive'
					}
				}
			}
		});
	};

	public byCountryNameOptimized = async (input: string) => {
		const res = await this.prisma.$queryRaw`SELECT abbreviation FROM get_language_abbreviation_by_country_name(${input})`;
		return querySchema.parse(res) || undefined;
	};
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
