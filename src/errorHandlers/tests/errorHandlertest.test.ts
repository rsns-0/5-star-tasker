import { describe, expect, it } from "vitest";

import { AxiosError } from "axios";
import { EnvVarError } from "@/utils/errors/EnvVarError";
import { handleAcceptableErrors } from "../errorHandler";

describe("error types only", () => {
	it("should throw when error type is not in acceptable types", () => {
		expect(() => {
			const e = new EnvVarError("test") as unknown;
			const acceptableErrorTypes = [new ReferenceError(), new AxiosError()] as const;
			const res = handleAcceptableErrors(e, { acceptableErrorTypes });
		}).toThrowError(EnvVarError);
	});

	it("should not throw when error is in acceptable types", () => {
		expect(() => {
			const e = new EnvVarError("test") as unknown;
			const acceptableErrorTypes = [
				new ReferenceError(),
				new AxiosError(),
				new EnvVarError(),
			] as const;
			const res = handleAcceptableErrors(e, { acceptableErrorTypes });
		}).not.toThrow();
	});

	it("should not throw when Error is in the acceptable types", () => {
		// all errors are instances of Error
		expect(() => {
			const e = new EnvVarError("test") as unknown;
			const acceptableErrorTypes = [new Error(), new TypeError()] as const;
			const res = handleAcceptableErrors(e, { acceptableErrorTypes });
		}).not.toThrow();
	});

	it("should throw if Error is the type of error being passed in and it is not in acceptable error types", () => {
		expect(() => {
			const e = new Error("test") as unknown;
			const acceptableErrorTypes = [
				new ReferenceError(),
				new AxiosError(),
				new EnvVarError(),
			] as const;
			const res = handleAcceptableErrors(e, { acceptableErrorTypes });
		}).toThrow();
	});

	it("should not throw when error is in acceptable types", () => {
		expect(() => {
			const e = [
				new EnvVarError("test") as unknown,
				new AxiosError("test") as unknown,
				new ReferenceError("test") as unknown,
			];
			const acceptableErrorTypes = [
				new ReferenceError(),
				new AxiosError(),
				new EnvVarError(),
				new TypeError(),
			] as const;
			for (const err of e) {
				const res = handleAcceptableErrors(err, { acceptableErrorTypes });
			}
		}).not.toThrow();
	});
});

describe("miscellaneous", () => {
	it("error message should be the expected value", () => {
		const expectedMessage = "test hello world";
		const e = new EnvVarError(expectedMessage) as unknown;
		const acceptableErrorTypes = [
			new ReferenceError(),
			new AxiosError(),
			new EnvVarError(),
		] as const;
		const res = handleAcceptableErrors(e, { acceptableErrorTypes });
		expect(res.message).toBe(expectedMessage);
	});
});

describe("message filter only", () => {
	const e = [
		new EnvVarError("test123") as unknown,
		new AxiosError("test456") as unknown,
		new ReferenceError("test789") as unknown,
	];
	it("by default should allow any error types to pass through, and only the filter should matter", () => {
		expect(() => {
			for (const err of e) {
				const res = handleAcceptableErrors(err, {
					filter: (message) => message.includes("test"),
				});
			}
		}).not.toThrow();
	});

	it("should throw if the includes filter only catches one error's message, '456'", () => {
		expect(() => {
			for (const err of e) {
				const res = handleAcceptableErrors(err, {
					filter: (message) => message.includes("456"),
				});
			}
		}).toThrow();
	});
});

describe("error types and message filter", () => {
	const e = [
		new EnvVarError("test123") as unknown,
		new AxiosError("test456") as unknown,
		new ReferenceError("test789") as unknown,
	];
	const acceptableErrorTypes = [
		new ReferenceError(),
		new AxiosError(),
		new EnvVarError(),
		new TypeError(),
	] as const;
	it("When acceptable errors are specified and an includes filter 'test' is passed which all errors have in their messages, it should not throw.", () => {
		expect(() => {
			for (const err of e) {
				const res = handleAcceptableErrors(err, {
					acceptableErrorTypes,
					filter: (message) => message.includes("test"),
				});
			}
		}).not.toThrow();
	});

	it("When acceptable errors are specified and an includes filter '456' is passed which only one error object has, it should throw.", () => {
		expect(() => {
			for (const err of e) {
				const res = handleAcceptableErrors(err, {
					acceptableErrorTypes,
					filter: (message) => message.includes("456"),
				});
			}
		}).toThrow();
	});
});
