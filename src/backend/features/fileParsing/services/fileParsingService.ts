import { DirectoryTraverser } from "./directoryTraverser";

/**
 * Starts from the start position and performs bfs to find the first folder with the specified name. Afterwards, retrieves all exports from files within the folder.
 * @throws {TraverserError} - If the folder is not found or if the starting directory does not exist.
 * @param folderName - The name of the folder to search for files in.
 * @param startPosition - The starting position of the search. Due to limitations, cannot create a default. Pass in __dirname to start from the current directory.
 * @param options - An optional object containing the following properties:
 *    - fileFilter: A function that determines whether a file should be included in the search. Defaults to .ts and .js files.
 *    - recursive: A boolean indicating whether to search recursively through subfolders for file exports after reaching the target folder. Defaults to false.
 * @returns A promise that resolves to an array of exported models.
 * @template TExportModel - The interface representing the export object from a module.
 * @example
 * // Example File Structure:
 * // - src
 * //    - backend
 * //        - features <--- 1. ascend here
 * //            - translation <--- 2. descend here to avoid running into duplicates since fileParsing also has a services folder, 3. call getExportsFromFilesInFolder
 * //                - services <--- goal
 * //                    - translationService.ts
 * //                    - deepLService.ts
 * //            - fileParsing
 * //                - index.ts <--- start point
 * //                - services
 * //                    - fileParsingService.ts
 * //                    - directoryTraverser.ts
 * //    - frontend
 * const featureDir = goToAncestorFolder("features", __dirname);
 * const translationDir = goToDescendentFolder("translation", featureDir);
 * const exports = getExportsFromFilesInFolder("services", translationDir); // done!
 * @example
 * // Example File Structure:
 * // - src
 * //    - backend
 * //        - features <--- 1. ascend here, 2. call getExportsFromFilesInFolder since errors is unique
 * //            - translation
 * //                - services
 * //                    - translationService.ts <--- start point
 * //                    - deepLService.ts
 * //            - fileParsing
 * //                - errors <--- goal
 * //                    - traverserError.ts
 * //                - services
 * //                    - fileParsingService.ts
 * //                    - directoryTraverser.ts
 * //    - frontend
 * const errorDir = goToAncestorFolder("features", __dirname);
 * const exports = getExportsFromFilesInFolder("errors", errorDir); // done!
 * @example
 * // Example File Structure:
 * // - src
 * //    - backend
 * //        - features
 * //            - translation
 * //                - services
 * //                    - deepLService.ts
 * //            - fileParsing
 * //                - index.ts <--- function is called here, 1. call getExportsFromFilesInFolder
 * //                - services <--- goal
 * //                    - fileParsingService.ts
 * //                    - directoryTraverser.ts
 * //    - frontend
 * const exports = getExportsFromFilesInFolder("services", __dirname); // done!
 */
export const getExportsFromFilesInFolder = <TExportModel = any>(
	folderName: string,
	startPosition:string,
	{
		fileFilter = (fullFilePath: string): boolean =>
			fullFilePath.endsWith(".ts") || fullFilePath.endsWith(".js"),
		recursive = false,
	} = {}
): Promise<TExportModel[]> => {
	const traverser = new DirectoryTraverser(startPosition);
	traverser.descendTo(folderName);
	const res = recursive
		? traverser.recursiveFindFiles(fileFilter)
		: traverser.getFiles().filter(fileFilter);
	return Promise.all(res.map((file) => import(file)));
};

/**
 * Starts from a given directory and ascends until it reaches the first folder with the matching name.
 * @throws {TraverserError} - If the folder is not found or if the starting directory does not exist.
 * @param folderName - The name of the folder to truncate the directory path to.
 * @param startingDirectory - The starting directory path to begin the traversal from.
 * @returns The truncated directory path.
 * @example
 * truncateDirectoryToParent("Me", "C:/Users/Me/Documents/MyFolder") // Returns "C:/Users/Me"
 */
export const goToAncestorFolder = (folderName:string, startingDirectory:string) => {
	const traverser = new DirectoryTraverser(startingDirectory);
	traverser.ascendTo(folderName);
	return traverser.currentDirectory
}

/**
 * Recursively descends and finds the first folder matching the name. (bfs impl)
 * @param folderName - The name of the descendent folder to navigate to.
 * @param startingDirectory - The directory to start the navigation from.
 * @returns The path of the current directory after navigation.
 */
export const goToDescendentFolder = (folderName:string, startingDirectory:string) => {
	const traverser = new DirectoryTraverser(startingDirectory);
	traverser.descendTo(folderName);
	return traverser.currentDirectory
}

