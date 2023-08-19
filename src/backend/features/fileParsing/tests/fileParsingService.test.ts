import { describe, expect, it } from "vitest";

import { TraverserError } from "../errors/traverserError";
import { getExportsFromFilesInFolder } from "../services/fileParsingService";


const testFolder = "testResources";
const featureFolderName = "fileParsing"

/**
	 * Expected folder structure:
	 * testResources
	 * 	- testfile1.ts
	 * 	- testfile2.ts
	 * 	testDir1
	 * 		- testfile3.ts
*/

describe("getExportsFromFilesInFolder", () => {
	it("Given above folder structure should find at least one export", async () => {
		const exports = await getExportsFromFilesInFolder(testFolder,{ascendToThisFolderBeforeStartingSearch: featureFolderName});
		expect(Array.isArray(exports)).toBe(true);
		expect(exports.length).not.toBe(0);
		exports.forEach((exportObj) => {
			expect(typeof exportObj).toBe("object");
		});
	});
	
	it("Given above folder structure should find at least 2 exports", async () => {
		const exports = await getExportsFromFilesInFolder(testFolder, {
			fileFilter: (filePath) => filePath.endsWith(".ts"),
			ascendToThisFolderBeforeStartingSearch: featureFolderName
		});
		expect(Array.isArray(exports)).toBe(true);
		expect(exports.length).toBeGreaterThan(1)
	});

	it("Given above folder structure should be able to find testfile2.ts with first depth search", async () => {
		
		const exports = await getExportsFromFilesInFolder(testFolder, {
			fileFilter: (filePath) => filePath.endsWith("testfile2.ts"),
			ascendToThisFolderBeforeStartingSearch: featureFolderName
		});
		expect(Array.isArray(exports)).toBe(true);
		expect(exports).toHaveLength(1);
	});

	it("should throw an error if the specified folder is not found", () => {
		expect(() => getExportsFromFilesInFolder("nonExistentFolder",{ascendToThisFolderBeforeStartingSearch: featureFolderName}))
			.toThrow(TraverserError);
	});

	it("Given above folder structure, should be able to locate the contents of testfile3.ts with recursive search", async () => {
		const exports = await getExportsFromFilesInFolder(testFolder,{recursive:true,ascendToThisFolderBeforeStartingSearch: featureFolderName});
		expect(Array.isArray(exports)).toBe(true);
		expect(exports.length).not.toBe(0);
		const res = exports.filter(obj => obj.testVar3 === "this is test file 3")
		expect(res.length).toBe(1)
	});

	it("Given above folder structure should not be able to find the contents of testfile3.ts without recursion", async () => {
		const exports = await getExportsFromFilesInFolder(testFolder,{ascendToThisFolderBeforeStartingSearch: featureFolderName});
		expect(Array.isArray(exports)).toBe(true);
		expect(exports.length).not.toBe(0);
		const res = exports.filter(obj => obj.testVar3 === "this is test file 3")
		expect(res.length).toBe(0)
	});




});
