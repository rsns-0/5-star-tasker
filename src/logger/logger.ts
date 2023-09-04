import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
	transports: [new transports.Console(), new transports.File({ filename: 'combined.log' })],
	format: format.combine(format.timestamp(), format.json(), format.prettyPrint()),
	level: 'debug'
});
