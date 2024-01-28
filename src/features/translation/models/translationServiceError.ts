import { AxiosError } from "axios"
import { ZodError } from "zod"
import { match, P } from "ts-pattern"
import { AuthorizationError, ConnectionError, DeepLError } from "deepl-node"

const catchAllErrors = P.union(
	P.instanceOf(DeepLError),
	P.instanceOf(ConnectionError),
	P.instanceOf(AuthorizationError),
	P.instanceOf(Error)
)

export class TranslationServiceError<TError extends Error = Error> extends Error {
	protected e: TError

	constructor(error: TError) {
		super(error.message)
		this.message = error.message
		this.name = error.name
		this.e = error
	}

	static fromError(error: unknown) {
		return match(error)
			.with(P.instanceOf(TranslationServiceError), (e) => e)
			.with(P.instanceOf(ZodError), (e) => new TranslationValidationError(e))
			.with(P.instanceOf(AxiosError), (e) => new TranslationNetworkError(e))
			.with(catchAllErrors, (e) => new TranslationServiceError(e))
			.otherwise(() => {
				throw error
			})
	}

	isNetworkError(): this is TranslationNetworkError {
		return this.e instanceof AxiosError
	}

	isValidationError(): this is TranslationValidationError {
		return this.e instanceof ZodError
	}

	autoResolve() {
		if (this.isNetworkError()) {
			if (this.statusCode === undefined) {
				return {
					status: 500,
					message: "Unknown error at DeepL API interface",
				} as const
			}
			return {
				status: parseInt(this.statusCode),
				message: this.message,
			} as const
		}
		if (this.isValidationError()) {
			return {
				status: 400,
				message: this.friendlyErrorMessage,
			} as const
		}
		this.message = `Could not auto resolve error. Original error message: ${this.message}`
		throw this
	}
}

export class TranslationNetworkError extends TranslationServiceError<AxiosError> {
	get statusCode() {
		return this.e.code
	}
}

export class TranslationValidationError extends TranslationServiceError<ZodError> {
	get friendlyErrorMessage() {
		return this.e.issues.map((issue) => issue.message).join("\n")
	}
}
