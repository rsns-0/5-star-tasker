import { AxiosError } from 'axios';
import { ZodError } from 'zod';

export class TranslationServiceErrorFactory {
	static fromError(error: unknown) {
		if (error instanceof TranslationServiceError) {
			return error;
		}
		if (error instanceof ZodError) {
			return new TranslationValidationError(error);
		}
		if (error instanceof AxiosError) {
			return new TranslationNetworkError(error);
		}
		if (error instanceof Error) {
			return new TranslationServiceError(error);
		}
		throw error;
	}
}

export class TranslationServiceError<TError extends Error = Error> extends Error {
	protected e: TError;

	constructor(error: TError) {
		super(error.message);
		this.message = error.message;
		this.name = error.name;
		this.e = error;
	}

	isNetworkError(): this is TranslationNetworkError {
		return (this.e as unknown as AxiosError).isAxiosError;
	}

	isValidationError(): this is TranslationValidationError {
		return this.e instanceof ZodError;
	}

	autoResolve() {
		if (this.isNetworkError()) {
			if (this.statusCode === undefined) {
				return {
					status: 500,
					message: 'Unknown error at DeepL API interface'
				};
			}
			return {
				status: parseInt(this.statusCode),
				message: this.message
			};
		}
		if (this.isValidationError()) {
			return {
				status: 400,
				message: this.friendlyErrorMessage
			};
		}
		this.message = `Could not auto resolve error. Original error message: ${this.message}`;
		throw this;
		// return {
		// 	status: 500,
		// 	message: "Unknown server error."
		// }
	}
}

export class TranslationNetworkError extends TranslationServiceError<AxiosError> {
	get statusCode() {
		return this.e.code;
	}
}

export class TranslationValidationError extends TranslationServiceError<ZodError> {
	get friendlyErrorMessage() {
		return this.e.issues.map((issue) => issue.message).join('\n');
	}
}
