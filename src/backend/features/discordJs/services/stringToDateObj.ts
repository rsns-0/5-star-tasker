const anyDateParser = require("any-date-parser");

function timeStringToDateObj(time: string, timezone: string): Date {
    const timeParsed = anyDateParser.fromString(time);
    var date = new Date();
    if (timeParsed instanceof Date) {
        date = new Date(timeParsed);
    } else {
        const timeParsed = [
            "(?:(\\d+)y)?\\s*", // Capture years
            "(?:(\\d+)mm)?\\s*", // Capture months
            "(?:(\\d+)d)?\\s*", // Capture days
            "(?:(\\d+)h)?\\s*", // Capture hours
            "(?:(\\d+)m)?\\s*", // Capture minutes
            "(?:(\\d+)s)?\\s*", // Capture seconds
            "(?:(\\d+)ms)?", // Capture milliseconds
        ].join("");
        const regex = new RegExp(timeParsed, "g");
        const matches = Array.from(time.matchAll(regex));
        let years = 0,
            months = 0,
            days = 0,
            hours = 0,
            minutes = 0,
            seconds = 0,
            milliseconds = 0;
        matches.forEach((match) => {
            years += match[1] ? parseInt(match[1]) : 0;
            months += match[2] ? parseInt(match[2]) : 0;
            days += match[3] ? parseInt(match[3]) : 0;
            hours += match[4] ? parseInt(match[4]) : 0;
            minutes += match[5] ? parseInt(match[5]) : 0;
            seconds += match[6] ? parseInt(match[6]) : 0;
            milliseconds += match[7] ? parseInt(match[7]) : 0;
        });
        date.setFullYear(date.getFullYear() + years);
        date.setMonth(date.getMonth() + months);
        date.setDate(date.getDate() + days);
        date.setHours(date.getHours() + hours);
        date.setMinutes(date.getMinutes() + minutes);
        date.setSeconds(date.getSeconds() + seconds);
        date.setMilliseconds(date.getMilliseconds() + milliseconds);
    }
    const convertedDate = convertTZ(date, timezone);
    return convertedDate;
}

function convertTZ(date: Date, timezone: string) {
    return new Date(
        (typeof date === "string" ? new Date(date) : date).toLocaleString(
            "en-US",
            { timeZone: timezone }
        )
    );
}

export default timeStringToDateObj;
