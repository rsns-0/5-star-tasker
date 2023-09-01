import { CommandExport, EventExport, EventHandlersData } from '../types/types';

import { glob } from "glob";

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
	return glob(`src/**/discordJs/**/commands/**/*.{ts,js}`).then((filePaths) =>
		getExports(filePaths)
	); // recursive
};

export const getEventExports = (): Promise<EventExport[]> => {
	return glob(`src/**/discordJs/**/events/**/*.{ts,js}`).then((filePaths) =>
		getExports(filePaths)
	); // recursive
};

export const getEventHandlerExports = async (): Promise<EventHandlersData> => {
	const eventMappings:EventHandlersData = {}
	const folders = await glob(`src/**/discordJs/**/eventHandlers/*/`)
	for (const folder of folders){
		const globPattern = `${folder}/*.{ts,js}`
		const filePaths = await glob(globPattern,{windowsPathsNoEscape:true})
		const folderName = folder.split("/").slice(-2)[0]
		
		eventMappings[folderName] = await getExports(filePaths)
		
	}
	return eventMappings	
}

