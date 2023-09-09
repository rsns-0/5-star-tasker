import { O } from 'ts-toolbelt';
import { Prisma } from '@prisma/client';

export default Prisma.defineExtension((prisma) => {
	return prisma.$extends({
		name: 'loggingExtension',
		model: {
			logs: {
				/**
				 * Logs an error and creates a log entry in the database.
				 * @param err - The error object to be logged.
				 * @returns A promise that resolves when the log entry is created.
				 */
				async logError(err: Error) {
					return prisma.logs.create({
						data: {
							level: 0,
							message: err.message,

							json: JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)))
						}
					});
				},
				/**
				 * Logs an event with the specified message and metadata.
				 * @param message - The message to be logged.
				 * @param meta - The metadata associated with the event.
				 * @returns A promise that resolves to the created log entry.
				 */
				async logEvent(message: string, meta: Prisma.JsonObject) {
					return prisma.logs.create({
						data: {
							level: 1,
							message,
							json: meta
						}
					});
				},

				/**
				 * The function "dump" takes an object, converts it to a JSON string, parses it back to a JSON
				 * object, and then creates a log entry with the original message and the parsed JSON object.
				 * @param obj - The parameter `obj` is of type `O.Object`.
				 * @returns the result of the `client.logs.create()` method, which is a promise.
				 */
				async dump(obj: O.Object) {
					const message = JSON.stringify(obj);
					const json = JSON.parse(message);
					return prisma.logs.create({
						data: {
							level: 1,
							message,
							json
						}
					});
				}
			}
		}
	});
});
