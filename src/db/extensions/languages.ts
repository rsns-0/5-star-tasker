import { Prisma } from "@prisma/client";

export default Prisma.defineExtension((prisma) => {
	return prisma.$extends({
		name: "languageExtension",
		model: {
			languages: {
				async isDiscordReactionSupportedByDeepL(reaction: string) {
					const res1 = await prisma.discord_flag_emojis.findUnique({
						where: {
							value: reaction,
							language: {
								is_supported_by_deep_l: true,
							},
						},

						select: {
							language: {
								select: {
									iso_639_1: true,
								},
							},
						},
					});
					if (!res1) {
						return null;
					}
					if (!res1.language) {
						throw new Error(
							"Assertion Error: Check query where clause, may be invalid."
						);
					}
					return res1.language.iso_639_1.toUpperCase();
				},
			},
		},
	});
});
