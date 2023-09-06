import { createLogger, format, transports } from 'winston';

import prisma from '../db/prismaInstance';

const dirname = 'testLogs';

const errorFileTransport = new transports.File({ filename: 'error.log', dirname, level: 'error' });
const combinedFileTransport = new transports.File({ filename: 'combined.log', dirname, level: 'debug' });
const infoFileTransport = new transports.File({ filename: 'info.log', dirname, level: 'info' });
const consoleTransport = new transports.Console({});
const logger = createLogger({
	transports: [consoleTransport, errorFileTransport, combinedFileTransport, infoFileTransport],
	format: format.combine(format.timestamp(), format.json(), format.prettyPrint()),
	level: 'debug'
});

logger.on('error', async (err) => {
	await prisma.logs.logError(err);
});

export { logger };
