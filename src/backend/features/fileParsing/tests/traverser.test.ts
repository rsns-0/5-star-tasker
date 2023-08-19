import { beforeEach, describe, expect, it } from "vitest";

import { DirectoryTraverser } from "../services/directoryTraverser";
import { TraverserError } from "../errors/traverserError";
import path from "path";

describe("DirectoryTraverser", () => {
	let traverser: DirectoryTraverser;

	beforeEach(() => {
		traverser = new DirectoryTraverser(__dirname);
		traverser.ascendTo("tests");
	});

	describe("descendTo", () => {
		it("should return true if folder is found", () => {
			const result = traverser.descendTo("testDir1");
			expect(result).toBe(true);
		});

		it("should throw if folder is not found", () => {
			expect(() =>traverser.descendTo("nonExistentFolder")).toThrow(TraverserError)
			
		});

		it("should handle file types", () => {
			const result = traverser.descendTo("testfile3.ts", "file");
			expect(result).toBe(true);
		});
	});

	describe("recursiveFindFiles", () => {
		it("should find all files matching the filter", () => {
			traverser.descendTo("testResources");
			const filter = (fileName: string) => fileName.endsWith(".ts");
			const result = traverser.recursiveFindFiles(filter);

			expect(result.length).toBe(3);
		});

		it("should return an empty array if no files match the filter", () => {
			traverser.descendTo("testResources");
			const filter = (fileName: string) => fileName.endsWith(".mdqa");
			const result = traverser.recursiveFindFiles(filter);
			expect(result.length).toBe(0);
		});
	});

	describe("ascendTo", () => {
		it("should change the current directory to the specified folder", () => {
			traverser.ascendTo("src");
			expect(traverser.currentDirectory).toBe(path.join(process.cwd(), "src"));
		});

		it("should throw an error if the specified folder is not found", () => {
			expect(() => traverser.ascendTo("nonexistent")).toThrow();
		});
	});

	describe("currentDirectory", () => {
		it("should set the current directory to the specified directory", () => {
			const newDirectory = path.join(__dirname);
			traverser.currentDirectory = newDirectory;
			expect(traverser.currentDirectory).toBe(newDirectory);
		});

		it("should normalize the specified directory", () => {
			
			const newDirectory = path.join(__dirname, "/../tests/testResources/..");
			traverser.currentDirectory = newDirectory;
			expect(traverser.currentDirectory).toBe(__dirname);
		});

		it("should set the current folder to the basename of the specified directory", () => {
			const newDirectory = path.join(__dirname, "/../tests/testResources")
			traverser.currentDirectory = newDirectory;
			expect(traverser.currentFolder).toBe("testResources");
		});

		it("should throw an error if the specified directory is invalid", () => {
			const invalidDirectory = "nonexistent";
			expect(() => {
				traverser.currentDirectory = invalidDirectory;
			}).toThrowError(`Directory ${invalidDirectory} does not exist`);
		});
	});
});
