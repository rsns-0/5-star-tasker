import { time } from "discord.js";
import z from "zod";

export const dateToUnixTimestampPipeline = z
	.date()
	.transform((val) => {
		return Math.floor(val.getTime() / 1000);
	})
	.brand("unixTimestamp");

export const unixTimestampToDatePipeline = z.number().transform((val) => {
	return new Date(val * 1000);
});

export const dateToISO8601Pipeline = z.date().transform((val) => {
	return val.toISOString();
});

export const ISO8601ToDatePipeline = z
	.string()
	.transform((val) => {
		return new Date(val);
	})
	.refine((val) => {
		return !isNaN(val.getTime());
	});

export const unixTimestampToDiscordJsTimestampPipeline = z.coerce
	.number()
	.int()
	.transform((val) => {
		const date = new Date(val * 1000);
		return time(date);
	});

export const dateToDiscordJsTimestampPipeline = z.date().transform((val) => {
	return time(val);
});
