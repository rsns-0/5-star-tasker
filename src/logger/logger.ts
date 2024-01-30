import { createLogger, format, transports } from "winston"
import Transport from "winston-transport"
import prisma from "../db/prismaInstance"
import { parseToCleanedStackFrameString } from "../utils/stackUtils"

interface ILogInfo {
	level: string
	message: string
	meta?: Record<string, unknown>
	stack?: string
}

class PrismaTransport extends Transport {
	override log(info: ILogInfo, callback?: (error?: Error, value?: unknown) => void): void {
		const { level, message, meta } = info

		process.nextTick(() => {
			const cb = callback ?? (() => {})

			if (level === "error") {
				const data = meta ?? ({} as Record<string, any>)
				data.stack = parseToCleanedStackFrameString(info.stack)
				console.error(info)

				prisma.logs
					.logEvent(message, data, 1)
					.then(() => {
						setImmediate(() => {
							this.emit("logged", info)
						})
						cb(undefined, true)
					})
					.catch((err: Error) => {
						setImmediate(() => {
							this.emit("error", err)
						})
						cb(err, null)
					})
			} else {
				cb(undefined, true)
			}
		})
	}
}

const consoleTransport = new transports.Console()

const logger = createLogger({
	transports: [consoleTransport, new PrismaTransport()],
	format: format.combine(
		format.timestamp(),
		format.json(),
		format.prettyPrint(),
		format.errors({ stack: true })
	),
	level: "info",
	exitOnError: false,
})

logger.exceptions.handle(consoleTransport)

export { logger }
