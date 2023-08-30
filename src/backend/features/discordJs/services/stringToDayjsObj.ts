import dayjs, { Dayjs } from "dayjs";

import timezonePlugin from "dayjs/plugin/timezone";
import utcPlugin from "dayjs/plugin/utc";

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

function timeStringToDayjsObj(userInput: string, timezone: string): Dayjs {
    const timeParsed: Dayjs = dayjs(userInput, timezone);

    if (!timeParsed.isValid()) {
        const matches = userStringToTimeData(userInput);
        return constructDateFromTimeData(matches).tz(timezone);
    } else {
        return timeParsed;
    }
}

// to do: check result and stop in middle
const userStringToTimeData = (userInput: string): RegExpMatchArray[] => {
    const timeParsedPattern = [
        "(?:(\\d+)y)?\\s*", // Capture years
        "(?:(\\d+)mm)?\\s*", // Capture months
        "(?:(\\d+)d)?\\s*", // Capture days
        "(?:(\\d+)h)?\\s*", // Capture hours
        "(?:(\\d+)m)?\\s*", // Capture minutes
        "(?:(\\d+)s)?\\s*", // Capture seconds
        "(?:(\\d+)ms)?", // Capture milliseconds
    ].join("");
    const regex = new RegExp(timeParsedPattern, "g");
    const matches = Array.from(userInput.matchAll(regex));
    return matches;
};

const constructDateFromTimeData = (matches: RegExpMatchArray[]): Dayjs => {
    let dayjsObj: Dayjs = dayjs();
    matches.forEach((match) => {
        const [_, years, months, days, hours, minutes, seconds, milliseconds] =
            match;
        dayjsObj = dayjsObj
            .add(parseInt(years || "0"), "year")
            .add(parseInt(months || "0"), "month")
            .add(parseInt(days || "0"), "day")
            .add(parseInt(hours || "0"), "hour")
            .add(parseInt(minutes || "0"), "minute")
            .add(parseInt(seconds || "0"), "second")
            .add(parseInt(milliseconds || "0"), "millisecond");
    });
    return dayjsObj;
};

export default timeStringToDayjsObj;
