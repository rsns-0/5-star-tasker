import {
	descendToFolderThenGetExportsFromFolder,
	goToAncestorFolder,
} from "../services/fileParsingService";

import { TraverserError } from "../errors/traverserError";
import path from "path";

;




const testFolder = "testResources";
const featureFolderName = "fileParsing";

/**
 * Expected folder structure:
 * testResources
 * 	- testfile1.ts
 * 	- testfile2.ts
 * 	testDir1
 * 		- testfile3.ts
 */
const startingPoint = goToAncestorFolder(featureFolderName, __dirname);

describe("getExportsFromFilesInFolder", () => {
	it("Given above folder structure should find at least one export", async () => {
		const exports = await descendToFolderThenGetExportsFromFolder(testFolder, startingPoint);
		expect(Array.isArray(exports)).toBe(true);
		expect(exports.length).not.toBe(0);
		exports.forEach((exportObj) => {
			expect(typeof exportObj).toBe("object");
		});
	});

	it("Given above folder structure should find at least 2 exports", async () => {
		const exports = await descendToFolderThenGetExportsFromFolder(testFolder, startingPoint, {
			fileFilter: (filePath) => filePath.endsWith(".ts"),
		});
		expect(Array.isArray(exports)).toBe(true);
		expect(exports.length).toBeGreaterThan(1);
	});

	it("Given above folder structure should be able to find testfile2.ts with first depth search", async () => {
		const exports = await descendToFolderThenGetExportsFromFolder(testFolder, startingPoint, {
			fileFilter: (filePath) => filePath.endsWith("testfile2.ts"),
		});
		expect(Array.isArray(exports)).toBe(true);
		expect(exports).toHaveLength(1);
	});

	it("should throw an error if the specified folder is not found", () => {
		expect(() => descendToFolderThenGetExportsFromFolder("nonExistentFolder", startingPoint)).toThrow(
			TraverserError
		);
	});

	it("Given above folder structure, should be able to locate the contents of testfile3.ts with recursive search", async () => {
		const exports = await descendToFolderThenGetExportsFromFolder(testFolder, startingPoint, {
			recursive: true,
		});
		expect(Array.isArray(exports)).toBe(true);
		expect(exports.length).not.toBe(0);
		const res = exports.filter((obj) => obj.testVar3 === "this is test file 3");
		expect(res.length).toBe(1);
	});

	it("Given above folder structure should not be able to find the contents of testfile3.ts without recursion", async () => {
		const exports = await descendToFolderThenGetExportsFromFolder(testFolder, startingPoint);
		expect(Array.isArray(exports)).toBe(true);
		expect(exports.length).not.toBe(0);
		const res = exports.filter((obj) => obj.testVar3 === "this is test file 3");
		expect(res.length).toBe(0);
	});
});

describe("goToAncestorFolder", () => {
	it("should return the parent directory path of the given folder name", () => {
		const folderName = featureFolderName;
		const startingDirectory = __dirname;

		const expectedDirectory = path.join(__dirname, "..");
		const actualDirectory = goToAncestorFolder(folderName, startingDirectory);
		expect(actualDirectory).toBe(expectedDirectory);
	});

	it("should throw an error if the specified folder is not found", () => {
		expect(() => descendToFolderThenGetExportsFromFolder("nonexistentFolder238jf9283jwenf9wijwi10191238jdsf2nn3nhed88", __dirname)).toThrowError(
			TraverserError
		);
	});
});
