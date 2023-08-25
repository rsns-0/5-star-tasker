export type TupleToUnion<T> = T extends readonly (infer U)[] ? U : never;

export type HandleAcceptableErrorsOptions<TError extends readonly Error[] = readonly Error[]> = {
	acceptableErrorTypes?: TError;
	filter?: (message: string) => boolean;
};

export const handleAcceptableErrors = <TError extends readonly Error[] = readonly Error[]>(
	unknownError: unknown,
	options: HandleAcceptableErrorsOptions<TError> = {}
): TupleToUnion<TError> | never => {
	const acceptableErrorTypes = options.acceptableErrorTypes ?? ([new Error()] as any as TError);
	const { filter = () => true } = options;

	for (const errorType of acceptableErrorTypes) {
		if (
			unknownError instanceof errorType.constructor &&
			filter((unknownError as Error).message)
		) {
			return unknownError as TupleToUnion<TError>;
		}
	}
	throw unknownError;
};
