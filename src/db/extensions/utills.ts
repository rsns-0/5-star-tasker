import { Prisma } from "@prisma/client"
import * as R from "remeda"

export default Prisma.defineExtension((client) => {
	return client.$extends({
		model: {
			$allModels: {
				/**
				 * Pulls the specified field from the model in the return result.
				 *
				 * @typeParam T The model type
				 * @typeParam K The return type of Prisma `findMany` method on model T
				 * @param field The field to retrieve from the model records
				 * @param where Optional conditions to match the records to retrieve
				 * @returns An array comprising of the values of the specified field in the model
				 *   records satisfying the where condition
				 */
				async extractValue<T, K extends Prisma.Result<T, null, "findMany">>(
					this: T,
					field: keyof K[0],
					where: Prisma.Args<T, "findMany">["where"]
				) {
					const context = Prisma.getExtensionContext(this)
					const result = await (context as any).findMany({
						where,
						select: { [field]: true },
					})

					return result.map((item: any) => item[field])
				},

				selectAll<T extends Record<string, any>>(this: T): Record<keyof T["fields"], true> {
					const fields = Prisma.getExtensionContext(this).fields
					return R.mapValues(fields, () => true as const) as any
				},

				selectExcept<
					T extends Record<string, any>,
					T2 extends Partial<Record<keyof Prisma.Payload<T>["scalars"], true>>,
					_T3 = keyof {
						[K in keyof T2]: T2[K] extends true ? never : true
					},
				>(
					this: T,
					select: T2
				): Omit<Record<keyof T["fields"], true>, _T3 extends string ? _T3 : never> {
					return R.pipe(
						select,
						() => R.pickBy(select, (v) => v === true),
						R.keys,
						(keys) => R.omit(Prisma.getExtensionContext(this).fields, keys),
						R.mapValues(() => true)
					) as any
				},
			},
		},
		query: {
			$allModels: {
				findMany(ctx) {
					const { args } = ctx
					if (args.take === undefined) {
						args.take = 10_000
					}
					return ctx.query(args)
				},
			},
		},
	})
})
