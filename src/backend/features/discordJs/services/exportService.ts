import { CommandExport, EventExport } from '../types/types';

import {glob} from "fast-glob"
import { logger } from '@/backend/logger/logger';

export const getExports = (filePaths: string[]) => {
	return Promise.all(
		filePaths.map((filePath) =>
			import(filePath).then((module:Record<string,any>) => {
				if (module.default) {
					return module.default;
				}
				return module;
			})
		)
	);
};

export const getCommandExports = (): Promise<CommandExport[]> => {
	logger.info("Getting command exports")
	return glob(`src/**/discordJs/**/commands/**/*.{ts,js}`).then((filePaths) =>
		getExports(filePaths)
	); 
};

export const getEventExports = (): Promise<EventExport[]> => {
	logger.info("Getting event exports")
	return glob(`src/**/discordJs/**/events/**/*.{ts,js}`).then((filePaths) =>
		getExports(filePaths)
	); 
};