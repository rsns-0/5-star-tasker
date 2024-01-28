import { StackFrame, parse } from "stacktrace-parser"

export function stripDirectoryPath(dir: string) {
	const res = dir.indexOf("5-star-tasker")
	if (res === -1) {
		throw new Error("Not found")
	}
	return dir.slice(res)
}

export function parseToCleanedStackframe(stackTrace: string): StackFrame[] {
	return parse(stackTrace).map((frame) => {
		if (!frame.file) {
			throw new Error("Unexpectedly did not find file path in stack frame")
		}
		return { ...frame, file: stripDirectoryPath(frame.file) }
	})
}
