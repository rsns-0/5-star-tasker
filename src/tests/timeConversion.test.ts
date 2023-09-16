import dayjs from "dayjs"
import { localizedParseTimeInput, timeStringToDayjsObj } from "../services/timezoneService"
import {
	timezonePositiveOptions,
	timezoneNegativeOptions,
} from "../features/reminders/selectBoxForTimezones"

describe("localizedParseTimeInput", () => {
	it("should correctly create date data using the user's input and the user's id (to get the timezone)", async () => {
		const timeDifferential = "1h"
		const res = await localizedParseTimeInput(timeDifferential, "732655727000158310").then(
			(res) => res.unwrap()
		)
		const result = res.utc()

		const expected = dayjs().utc().add(1, "hour")

		expect(result.hour()).toBe(expected.hour())
	})
})

describe("Possible inputs for timeStringToDayjsObj", () => {
	it("correctly converts timezones", () => {
		const timeDifferential = "1h"
		const expected = dayjs().tz("America/New_York").add(1, "hour")
		const result = timeStringToDayjsObj(timeDifferential, "America/New_York")

		expect(result.hour()).toBe(expected.hour())
	})

	it("correctly converts timezones to utc", () => {
		const timeDifferential = "1h"
		const expected = dayjs().tz("America/New_York").add(1, "hour")
		const result = timeStringToDayjsObj(timeDifferential, "America/New_York")

		expect(result.utc().hour()).toBe(expected.utc().hour())
	})
	it("Should return a valid dayjs object", () => {
		const timeString = "0"
		const timezone = "America/New_York"
		const dateObject = timeStringToDayjsObj(timeString, timezone)
		expect(dateObject.isValid()).toBe(true)
	})
	it("Should work with strings out of order, returning a valid Data type", () => {
		const timeString = "30m 2h 3y 1d 2mm"
		const timezone = "America/New_York"
		const dateObject = timeStringToDayjsObj(timeString, timezone)
		expect(dateObject.isValid()).toBe(true)
	})
	it("Should handle a time string with no components, returning a valid Data type", () => {
		const timeString = ""
		const timezone = "America/New_York"
		const dateObject = timeStringToDayjsObj(timeString, timezone)
		expect(dateObject.isValid()).toBe(true)
	})
	it("Should handle a time string with duplicate components, returning a valid Data type", () => {
		const timeString = "2d 2d 3h 3h 1y 1y"
		const timezone = "America/New_York"
		const dateObject = timeStringToDayjsObj(timeString, timezone)
		expect(dateObject.isValid()).toBe(true)
	})
	it("Should handle a time string with decimal values, returning a valid Data type", () => {
		const timeString = "1.5y 0.5h"
		const timezone = "America/New_York"
		const dateObject = timeStringToDayjsObj(timeString, timezone)
		expect(dateObject.isValid()).toBe(true)
	})
	it("Should handle a time string without spaces, returning a valid Data type", () => {
		const timeString = "30m1y2h"
		const timezone = "America/New_York"
		const dateObject = timeStringToDayjsObj(timeString, timezone)
		expect(dateObject.isValid()).toBe(true)
	})
})

describe("For each entry value in the options, dayjs should be able to parse the data correctly", () => {
	const testDataPos = timezonePositiveOptions.map(({ data }) => data)
	const testDataNeg = timezoneNegativeOptions.map(({ data }) => data)

	it.each(testDataPos)("positive data: %s", (data) => {
		const res = dayjs().tz(data.value)

		expect(res.isValid()).toBe(true)
	})

	it.each(testDataNeg)("negative data: %s", (data) => {
		const res = dayjs().tz(data.value)

		expect(res.isValid()).toBe(true)
	})
})
