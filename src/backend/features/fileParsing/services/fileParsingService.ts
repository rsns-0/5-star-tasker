import { DirectoryTraverser } from "./directoryTraverser";

/**
 * Ascends to a folder before performing bfs to find a folder matching the name, then gets all files and their exports in that folder.
 * @throws {TraverserError} - If folder is not found.
 * @param folderName - The name of the folder to search for files in.
 * @param options - An object containing optional parameters for the function.
 * @param options.fileFilter - A function that takes a full file path and returns a boolean indicating whether the file should be included in the results. Defaults to filtering for .ts and .js files.
 * @param options.ascendToThisFolderBeforeStartingSearch - The name of the folder to ascend to before starting the search. Defaults to "src".
 * @returns An array of exports from all the files in the given folder.
 * @template TExportModel - The interface representing the exports of the files in the folder.
 */
export const getExportsFromFilesInFolder = <TExportModel = any>(
	folderName: string,
	{
		fileFilter = (fullFilePath: string): boolean =>
			fullFilePath.endsWith(".ts") || fullFilePath.endsWith(".js"),
		ascendToThisFolderBeforeStartingSearch = "src",
		recursive = false,
	} = {}
): Promise<TExportModel[]> => {
	const traverser = new DirectoryTraverser(__dirname);
	traverser.ascendTo(ascendToThisFolderBeforeStartingSearch);
	traverser.descendTo(folderName);

	const res = recursive
		? traverser.recursiveFindFiles(fileFilter)
		: traverser.getFiles().filter(fileFilter);

	return Promise.all(res.map((file) => import(file)));
};
