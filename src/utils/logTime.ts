import { formatInTimeZone } from "date-fns-tz";

type DateArgs = Parameters<typeof formatInTimeZone>[0];

export function logTime(time: DateArgs) {
	console.log(createLogTimeMessage(time));
}

export function createLogTimeMessage(time: DateArgs) {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const res = formatInTimeZone(time, timezone, "yyyy-MM-dd hh:mm:ss a");
	const msg = `${res} (Estimated server timezone: ${timezone})`;
	return msg;
}
