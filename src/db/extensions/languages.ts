import { Prisma } from "@prisma/client"

export default Prisma.defineExtension((db) => {
	return db.$extends({
		name: "languageExtension",
		model: {
			languages: {
				async getDeepLIsoCode(reaction: string) {
					return db.flag_key_to_deep_l_iso_code_materialized
						.findFirst({
							select: { iso_code: true },
							where: {
								flag_key: reaction.toLowerCase(),
							},
						})
						.then((s) => s?.iso_code ?? null)
				},
			},
		},
	})
})
