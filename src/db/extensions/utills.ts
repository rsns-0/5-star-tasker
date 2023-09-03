import { Prisma } from "@prisma/client";

export default Prisma.defineExtension((client) => {
	return client.$extends({
		model: {
			
			$allModels: {
				/**
				 * Pulls the specified field from the model in the return result.
				 * @param field The field to retrieve from the model records
				 * @param where Optional conditions to match the records to retrieve
				 * @returns An array comprising of the values of the specified field in the model records satisfying the where condition
				 * @typeparam T The model type
				 * @typeparam K The return type of Prisma `findMany` method on model T
				 */
				async extractValue<T, K extends Prisma.Result<T, null, "findMany">>(
					this: T,
					field: keyof K[0],
					where: Prisma.Args<T, "findMany">["where"]
				) {
					const context = Prisma.getExtensionContext(this);
					const result = await (context as any).findMany({
						where,
						select: { [field]: true },
					});

					return result.map((item: any) => item[field]);
				},
				/**
				 * Produces a case insensitive search for the specified string field.
				 * @param field The string field to search for
				 * @param value The value to compare against the specified field
				 * @returns A Prisma where object for a case insensitive search
				 * @typeparam T The model type
				 * @typeparam K The return type of Prisma `findMany` method on model T
				 */
				ci<T, K extends Prisma.Result<T, null, "findMany">>(
					this: T,
					field: keyof K[0],
					value: string
				) {
					return {
						[field]: {
							mode: "insensitive",
							equals: value,
						},
					};
				},
			},
			
			
		},
	});
});
