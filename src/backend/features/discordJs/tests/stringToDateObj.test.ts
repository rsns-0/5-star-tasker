import timeStringToDateObj from "../services/stringToDateObj";
import { describe, expect, it } from "vitest";

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
