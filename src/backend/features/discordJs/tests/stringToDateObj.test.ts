import dayjs, { Dayjs, OptionType } from "dayjs";
import { describe, expect, it } from "vitest";
import {
	timezoneNegativeOptions,
	timezonePositiveOptions,
} from "../models/selectBoxForTimezones";

import timeStringToDateObj from "../services/stringToDayjsObj";

describe("Possible inputs for timeStringToDateObj", () => {
	it("Should return a date object", () => {
		const timeString = "0";
		const timezone = "America/New_York";
		const dateObject = timeStringToDateObj(timeString, timezone);
		expect(dateObject).toBeDefined();
	});
	it("Should work with strings out of order, returning a valid Data type", () => {
		const timeString = "30m 2h 3y 1d 2mm";
		const timezone = "America/New_York";
		const dateObject = timeStringToDateObj(timeString, timezone);
		const date = typeof new Date();
		expect(date).toEqual(typeof dateObject);
	});
	it("Should handle a time string with no components, returning a valid Data type", () => {
		const timeString = "";
		const timezone = "America/New_York";
		const dateObject = timeStringToDateObj(timeString, timezone);
		const date = typeof new Date();
		expect(date).toEqual(typeof dateObject);
	});
	it("Should handle a time string with duplicate components, returning a valid Data type, since it'll sum the numbers (1y + 1y = 2y)", () => {
		const timeString = "2d 2d 3h 3h 1y 1y";
		const timezone = "America/New_York";
		const dateObject = timeStringToDateObj(timeString, timezone);
		const date = typeof new Date();
		expect(date).toEqual(typeof dateObject);
	});
	it("Should handle a time string with decimal values, returning a valid Data type", () => {
		const timeString = "1.5y 0.5h";
		const timezone = "America/New_York";
		const dateObject = timeStringToDateObj(timeString, timezone);
		const date = typeof new Date();
		expect(date).toEqual(typeof dateObject);
	});
	it("Should handle a time string without spaces, returning a valid Data type", () => {
		const timeString = "30m1y2h";
		const timezone = "America/New_York";
		const dateObject = timeStringToDateObj(timeString, timezone);
		const date = typeof new Date();
		expect(date).toEqual(typeof dateObject);
	});

    
});

describe("For each entry value in the options, dayjs should be able to parse the data correctly", () => {
	const testDataPos = timezonePositiveOptions.map(({ data }) => data);
	const testDataNeg = timezoneNegativeOptions.map(({ data }) => data);

	it.each(testDataPos)("positive data: %s", (data) => {
		const res = dayjs().tz(data.value);

		expect(res.isValid()).toBe(true);
	});

	it.each(testDataNeg)("negative data: %s", (data) => {
		const res = dayjs().tz(data.value);

		expect(res.isValid()).toBe(true);
	});
});
