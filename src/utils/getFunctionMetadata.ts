export type FunctionMetaData = {
	functionName: string;
	parameterNames: string[];
};

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

export function getFunctionMetadata(func: Function): FunctionMetaData {
	const fnStr = func.toString().replace(STRIP_COMMENTS, "");
	let result = fnStr.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")")).match(ARGUMENT_NAMES);
	if (!result) {
		throw new Error("Unexpected null value");
	}
	return {
		functionName: func.name,
		parameterNames: result,
	};
}
