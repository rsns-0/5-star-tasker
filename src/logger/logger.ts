import { createLogger, format, transports } from "winston"

import prisma from "../db/prismaInstance"
import serializeJavascript from "serialize-javascript"

const dirname = "testLogs"

const errorFileTransport = new transports.File({
	filename: "error.log",
	dirname,
	level: "error",
})
const combinedFileTransport = new transports.File({
	filename: "combined.log",
	dirname,
	level: "debug",
})
const infoFileTransport = new transports.File({
	filename: "info.log",
	dirname,
	level: "info",
})
const consoleTransport = new transports.Console({})
const logger = createLogger({
	transports: [consoleTransport, errorFileTransport, combinedFileTransport, infoFileTransport],
	format: format.combine(format.timestamp(), format.json(), format.prettyPrint()),
	level: "debug",
})

logger.on("error", async (err) => {
	logger.error(`${err.message} ${err.stack}`)
	await prisma.logs.logError(err)
})

logger.on("warn", async (warn) => {
	logger.warn(warn.message)
	await prisma.logs.dump(warn)
})

logger.on("info", async (info) => {
	logger.info(info.message)
	await prisma.logs.dump(info)
})

logger.on("debug", async (debug) => {
	logger.debug(serializeJavascript(debug, { space: 4 }))
	await prisma.logs.dump(debug)
})

export { logger }
