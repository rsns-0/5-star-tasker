import { existsSync, lstatSync, readdirSync } from 'fs';

import Denque from 'denque';
import { TraverserError } from '../errors/traverserError';
import path from 'path';

/**
 * A utility class for traversing directories and finding files.
 * Currently used for internal implementation of FileParsingService interface.
 * Not intended for external use, needs better behavior for managing control flow when unexpected events occur.
 */
export class DirectoryTraverser {
	private _directory: string = '';
	constructor(directory: string) {
		this.currentDirectory = directory;
	}

	get currentDirectory() {
		return this._directory;
	}

	get currentFolder() {
		return path.basename(this._directory);
	}

	set currentDirectory(newDirectory: string) {
		validateDirectory(newDirectory);
		this._directory = path.normalize(newDirectory);
	}

	ascend() {
		this.currentDirectory = path.dirname(this.currentDirectory);
	}

	descend(folderName: string) {
		this.currentDirectory = path.join(this.currentDirectory, folderName);
	}

	getFolders() {
		return readdirSync(this.currentDirectory).filter((file: string) => lstatSync(path.join(this.currentDirectory, file)).isDirectory());
	}

	getFiles({ withFullPath = true } = {}) {
		const res = readdirSync(this.currentDirectory).filter((file: string) => lstatSync(path.join(this.currentDirectory, file)).isFile());
		if (withFullPath) {
			return res.map((file) => path.join(this.currentDirectory, file));
		}
		return res;
	}

	/**
	 * Starting from the end, finds and ascends to the first folder with the specified name.
	 *
	 */
	ascendTo(folderName: string) {
		const parts = this.currentDirectory.split(path.sep);
		const index = parts.lastIndexOf(folderName);
		if (index === -1) {
			throw new TraverserError(`Folder ${folderName} not found in current directory`);
		} else {
			this.currentDirectory = parts.slice(0, index + 1).join(path.sep);
		}
	}

	/**
	 * Navigates to the specified directory or the directory containing the specified file.
	 * If the itemType is "folder", this method will navigate to the specified folder.
	 * If the itemType is "file", this method will navigate to the directory containing the specified file.
	 *
	 * @param itemName The name of the item (file or folder) to navigate to.
	 * @param itemType The type of the item to navigate to. Can be "file" or "folder" (default is "folder").
	 * @returns true if the specified folder or the folder containing the specified file was found, false otherwise.
	 * @example
	 * // Navigate to a folder named 'myFolder'
	 * traverser.descendTo('myFolder', 'folder');
	 *
	 * @example
	 * // Navigate to the folder containing the file 'myFile.txt'
	 * traverser.descendTo('myFile.txt', 'file');
	 */
	descendTo(itemName: string, itemType: 'file' | 'folder' = 'folder') {
		const queue = new Denque<string>([this.currentDirectory]);

		while (queue.size() > 0) {
			const currentDirectory = queue.shift()!;
			this.currentDirectory = currentDirectory;

			const shouldReturn = this.handleControlFlow(itemName, itemType);
			if (shouldReturn) {
				return true;
			}

			for (const folder of this.getFolders()) {
				const fullFolderPath = path.join(this.currentDirectory, folder);
				queue.push(fullFolderPath);
			}
		}
		throw new TraverserError(`Folder ${itemName} not found in current directory`);
	}

	/**Returns true if should return, false if should continue. */
	private handleControlFlow(itemName: string, itemType: 'file' | 'folder') {
		if (itemType === 'file' && this.getFiles({ withFullPath: false }).includes(itemName)) {
			this.currentDirectory = path.dirname(path.join(this.currentDirectory, itemName));
			return true;
		}
		if (itemType === 'folder' && this.getFolders().includes(itemName)) {
			this.currentDirectory = path.join(this.currentDirectory, itemName);
			return true;
		}
		return false;
	}

	/**
	 *
	 * Recursively finds files in the current directory and its subdirectories that match the specified file name or file filter.
	 * @param fileNameOrFileFilter The name of the file to search for, or a function that takes a full file path and returns a boolean indicating whether the file should be included in the results. If a string is provided, create a filter for matching the string exactly.
	 * @returns An array of file paths that match the specified file name or file filter.
	 * @example
	 * // Using DirectoryTraverser to find specific files recursively.
	 * import { DirectoryTraverser } from './DirectoryTraverser'; // Adjust path as needed
	 *
	 * const directoryPath = '/path/to/search';
	 * const traverser = new DirectoryTraverser(directoryPath);
	 *
	 * // Finding files by name
	 * const filesByName = traverser.recursiveFindFiles('example.txt');
	 * console.log(filesByName); // Output will be an array of full paths to 'example.txt' files
	 *
	 * // Finding files by custom filter
	 * const filterFunction = (fullFilePath: string) => fullFilePath.endsWith('.txt');
	 * const textFiles = traverser.recursiveFindFiles(filterFunction);
	 * console.log(textFiles); // Output will be an array of full paths to .txt files
	 *
	 * // Note: When using a custom filter function, you should take into account that a full file path is being passed in, and write your filter accordingly.
	 *
	 *
	 * // Incorrect usage of DirectoryTraverser to find files containing the string 'types'.
	 * import { DirectoryTraverser } from './DirectoryTraverser'; // Adjust path as needed
	 *
	 * const directoryPath = '/path/to/search';
	 * const traverser = new DirectoryTraverser(directoryPath);
	 *
	 * // Incorrect filter function that doesn't distinguish between folders and files containing 'types'
	 * const incorrectFilterFunction = (fullFilePath: string) => fullFilePath.includes('types');
	 * const incorrectFiles = traverser.recursiveFindFiles(incorrectFilterFunction);
	 * console.log(incorrectFiles); // Output may include both files and folders containing 'types'
	 *
	 * // Note: This will include any paths containing 'types', regardless of whether they are files or folders.
	 * // For example, if there's a folder called 'types', all files inside that folder would be included in the result.
	 * // A more precise filter function is needed to only include files with 'types' in the name, excluding folders.
	 
	 
	 * // Example workarounds
	 
	 * // Using .endsWith to match only files ending with 'types'
	 * const endsWithFilterFunction = (fullFilePath) => fullFilePath.endsWith('types.ts');
	 * const endsWithFiles = traverser.recursiveFindFiles(endsWithFilterFunction);
	 *
	 
	 * // Using .lastIndexOf and substring to match only files that end with 'types'
	 * const lastIndexOfFilterFunction = (fullFilePath) => {
	 *   const fileName = fullFilePath.substring(fullFilePath.lastIndexOf('/') + 1);
	 *   return fileName.includes('types');
	 * };
	 
	 */
	recursiveFindFiles(fileNameOrFileFilter: string | ((fullFilePath: string) => boolean)) {
		const filter = typeof fileNameOrFileFilter === 'string' ? (fileName: string) => fileName === fileNameOrFileFilter : fileNameOrFileFilter;

		const queue = new Denque<string>([this.currentDirectory]);
		const res: string[] = [];
		while (queue.size() > 0) {
			const currentDirectory = queue.shift()!;
			this.currentDirectory = currentDirectory;

			for (const filePath of this.getFiles()) {
				if (filter(filePath)) {
					res.push(filePath);
				}
			}

			for (const folder of this.getFolders()) {
				const fullFolderPath = path.join(this.currentDirectory, folder);
				queue.push(fullFolderPath);
			}
		}
		return res;
	}
}
function validateDirectory(directory: string) {
	if (!existsSync(directory) || !lstatSync(directory).isDirectory()) {
		throw new TraverserError(`Directory ${directory} does not exist or is not a valid directory`);
	}
}
