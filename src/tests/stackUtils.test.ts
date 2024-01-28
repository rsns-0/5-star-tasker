import {
	parseToCleanedStackframe as parseToCleanedStackFrame,
	stripDirectoryPath,
} from "../utils/stackUtils";

import { parse, type StackFrame } from "stacktrace-parser";
import { formatTestDescription } from "./testUtils/descriptions";

const testDataArray = [
	`Error: asd\n    at C:\\RandomDir1\\AnotherDir\\5-star-tasker\\src\\tests\\prisma.test.ts:35:43\n    at file:///D:/SomeDir/SomeOtherDir/5-star-tasker/node_modules/@vitest/runner/dist/index.js:256:72\n    at file:///E:/YetAnotherDir/LastDir/5-star-tasker/node_modules/@vitest/runner/dist/index.js:51:26\n    at runTest (file:///F:/FinalDir/5-star-tasker/node_modules/@vitest/runner/dist/index.js:613:17)`,
	`Error: asd\n    at D:\\NewFolder\\ExampleFolder\\5-star-tasker\\src\\tests\\random.test.ts:55:33\n    at file:///G:/AnotherRandomDir/YetAnotherRandomDir/5-star-tasker/node_modules/@vitest/runner/dist/index.js:333:29\n    at runTest (file:///H:/OneMoreDir/5-star-tasker/node_modules/@vitest/runner/dist/index.js:624:17)`,
	`Error: asd\n    at E:\\Misc\\Random\\5-star-tasker\\src\\tests\\misc.test.ts:12:11\n    at file:///I:/SomeFolder/SomeOtherFolder/5-star-tasker/node_modules/@vitest/runner/dist/index.js:100:7\n    at withEnv (file:///J:/FinalTestDir/5-star-tasker/node_modules/vitest/dist/entry.js:70:5)`,
	`Error: sample\n    at A:\\Dir1\\RandomFolder\\5-star-tasker\\tests\\unit.test.ts:15:29\n    at file:///Z:/Random1/Example1/5-star-tasker/node_modules/@test/runner/index.js:1:1\n    at testRun (file:///Y:/Dir2/Dir3/5-star-tasker/node_modules/@test/runner/index.js:12:12)`,
	`Error: sample2\n    at B:\\DifferentDir\\SomeFolder\\5-star-tasker\\tests\\feature.test.ts:40:50\n    at file:///X:/Rand/Dir4/5-star-tasker/node_modules/@sample/runner/index.js:20:20\n    at context (file:///W:/Sample1/Sample2/5-star-tasker/node_modules/@test/context.js:30:5)`,
	`Error: sample3\n    at C:\\YetAnotherDir\\LastFolder\\5-star-tasker\\tests\\api.test.ts:55:55\n    at file:///V:/Another1/Another2/5-star-tasker/node_modules/@api/runner/index.js:5:5\n    at apiRun (file:///U:/Check1/Check2/5-star-tasker/node_modules/@api/runner/index.js:60:6)`,
] as const;

const projectName = "5-star-tasker";

describe("parseToCleanedStackframe", () => {
	it.each(testDataArray)(
		formatTestDescription("should strip out unrelated directories correctly"),
		(str) => {
			const stackFrames = parseToCleanedStackFrame(str);
			for (const { file } of stackFrames) {
				const firstPart = file!.slice(0, projectName.length)
				expect(firstPart).toBe(projectName);
			}
		}
	);
});

describe("stripDirectoryPath", () => {
	it.each(testDataArray)(
		formatTestDescription("should strip out unrelated directories correctly"),
		(str) => {
			const stackframes = parse(str);
			for (const { file } of stackframes) {
				if (!file) {
					throw new Error("Unexpectedly did not find file path in stack frame");
				}
				const result = stripDirectoryPath(file);
				const firstPart = result.slice(0, projectName.length);
				expect(firstPart).toBe(projectName);
			}
		}
	);
});

describe("TraceData", () => {
	let sampleStackTraceString: string;
	let results: StackFrame[];
	let resultWithMethodName: StackFrame;
	let first: StackFrame;
	beforeAll(() => {
		sampleStackTraceString = `Error: asd\n    at C:\\RandomDir1\\AnotherDir\\5-star-tasker\\src\\tests\\prisma.test.ts:35:43\n    at file:///D:/SomeDir/SomeOtherDir/5-star-tasker/node_modules/@vitest/runner/dist/index.js:256:72\n    at file:///E:/YetAnotherDir/LastDir/5-star-tasker/node_modules/@vitest/runner/dist/index.js:51:26\n    at runTest (file:///F:/FinalDir/5-star-tasker/node_modules/@vitest/runner/dist/index.js:613:17)`;
		results = parse(sampleStackTraceString);
		resultWithMethodName = results[3];
		first = results[0];
	});

	it("should find 4 directories from the test sample", () => {
		expect(results.length).toBe(4);
	});

	it("should parse information correctly for first item", () => {
		expect(first.file).toBe(
			"C:\\RandomDir1\\AnotherDir\\5-star-tasker\\src\\tests\\prisma.test.ts"
		);
		expect(first.lineNumber).toBe(35);
		expect(first.column).toBe(43);
		expect(first.methodName).toBe("<unknown>");
		expect(first.arguments).toEqual([]);
	});

	it("should parse information correctly for last item which has a method name", () => {
		expect(resultWithMethodName.file).toBe(
			"file:///F:/FinalDir/5-star-tasker/node_modules/@vitest/runner/dist/index.js"
		);
		expect(resultWithMethodName.lineNumber).toBe(613);
		expect(resultWithMethodName.column).toBe(17);
		expect(resultWithMethodName.methodName).toBe("runTest");
		expect(resultWithMethodName.arguments).toEqual([]);
	});

	it("should find 19 directories in total from original test data sample", () => {
		let res: number | null = null;
		const stackTraceObjects: StackFrame[] = [];

		for (const data of testDataArray) {
			const result = parse(data);
			stackTraceObjects.push(...result);
		}
		res = stackTraceObjects.length;

		expect(res).toBe(19);
	});
});
