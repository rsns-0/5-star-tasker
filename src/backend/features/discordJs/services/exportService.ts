import { CommandExport, EventExport } from "../types/types";

import { glob } from "glob";

export const getExports = (filePaths: string[]) => {
	return Promise.all(filePaths.map((filePath) => import(filePath)));
};

export const getCommandExports = (): Promise<CommandExport[]> => {
	return glob(`src/**/discordJs/**/commands/**/*.{ts,js}`).then((filePaths) =>
		getExports(filePaths)
	); // recursive
};

export const getEventExports = (): Promise<EventExport[]> => {
	return glob(`src/**/discordJs/**/events/**/*.{ts,js}`).then((filePaths) =>
		getExports(filePaths)
	); // recursive
};
