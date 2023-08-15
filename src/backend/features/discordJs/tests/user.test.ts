import { describe, expect, it } from "vitest";

import { User } from "../models/user";

describe("user.toJson", () => {
	it("should return a string equal to the expected test object", () => {
		const expectedPre = {
			id: 1,
			username: "test",
			role: "admin",
		};
		const expected = JSON.stringify(expectedPre);
		const user = new User(1, "test", "admin");
		const actual = user.toJsonString();
		expect(actual).toEqual(expected);
	});

	it("should return a string object not equal to the test object", () => {
		const testDataPre = {
			id: 2,
			username: "testabc",
			role: "user",
		};
		const testData = JSON.stringify(testDataPre);
		const user = new User(1, "test", "admin");
		const actual = user.toJsonString();
		expect(actual).not.toEqual(testData);
	});
});
