import { StackFrame, parse } from "stacktrace-parser"

export function stripDirectoryPath(dir: string) {
	const res = dir.indexOf("5-star-tasker")
	if (res === -1) {
		throw new Error("Not found")
	}
	return dir.slice(res)
}

export function parseToCleanedStackframe(stackTrace: string | undefined): StackFrame[] {
	stackTrace = stackTrace ?? ""
	return parse(stackTrace).map((frame) => {
		if (!frame.file) {
			throw new Error("Unexpectedly did not find file path in stack frame")
		}
		return { ...frame, file: stripDirectoryPath(frame.file) }
	})
}

export function parseToCleanedStackFrameString(stackTrace: string | undefined): string {
	return parseToCleanedStackframe(stackTrace)
		.map((frame) => frame.file)
		.join("\n")
}