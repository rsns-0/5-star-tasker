import { createLogger, format, transports } from 'winston';

import prisma from '../db/prismaInstance';

const logger = createLogger({
	transports: [new transports.Console(), new transports.File({ filename: 'combined.log' })],
	format: format.combine(format.timestamp(), format.json(), format.prettyPrint()),
	level: 'debug'
});

logger.on('error', async (err) => {
	await prisma.logs.logError(err);
});

export { logger };
