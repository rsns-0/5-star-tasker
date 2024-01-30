import { Prisma } from "@prisma/client"

export default Prisma.defineExtension((prisma) => {
	return prisma.$extends({
		name: "loggingExtension",
		model: {
			logs: {
				/**
				 * Logs an error and creates a log entry in the database.
				 *
				 * @param err - The error object to be logged.
				 * @returns A promise that resolves when the log entry is created.
				 */
				async logError(err: Error) {
					const { SuperJSON } = await import("superjson")
					return prisma.logs.create({
						select: {
							id: true,
						},
						data: {
							level: 1,
							message: err.message,
							json: SuperJSON.serialize(err) as object,
						},
					})
				},
				/**
				 * Logs an event with the specified message and metadata.
				 *
				 * @param message - The message to be logged.
				 * @param meta - The metadata associated with the event.
				 * @returns A promise that resolves to the created log entry.
				 */
				async logEvent(message: string | object, meta?: object, level = 6) {
					const { SuperJSON } = await import("superjson")

					if (typeof message === "object") {
						message = SuperJSON.stringify(message)
					}
					const json = SuperJSON.serialize(meta) as object

					await prisma.logs.create({
						select: {
							id: true,
						},
						data: {
							level,
							message,
							json,
						},
					})
				},
			},
		},
	})
})
