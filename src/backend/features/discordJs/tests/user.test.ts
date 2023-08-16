import { describe, expect, it } from "vitest";

import { User } from "../models/user";

describe("user.toJsonString", () => {

	it("When given the same user data, a regular object that is stringified and the model that is stringified should end up being equivalent strings.", () => {
		const preExpectedData = {
			id: 1,
			username: "test",
			role: "admin",
		};
		const stringifiedExpectedData = JSON.stringify(preExpectedData);
		const userModel = new User(1, "test", "admin");
		const modelStringifiedData = userModel.toJsonString();
		expect(modelStringifiedData).toEqual(stringifiedExpectedData);
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
