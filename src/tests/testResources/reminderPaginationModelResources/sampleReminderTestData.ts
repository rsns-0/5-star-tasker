import { _01_01_2050_unix, _02_01_2050_unix } from "./constants";

import { reminders } from "@prisma/client";
import Decimal from "decimal.js";
import { Collection } from "discord.js";

export const sampleReminderTestData: reminders[] = [
	{
		id: BigInt(94),
		created_at: new Date("2050-01-01T10:00:00Z"),
		user_id: "11111",
		channel_id: "44444",
		reminder_message: "hello world",
		time: new Date(new Decimal(_01_01_2050_unix).toNumber() * 1000),
		webhook_id: "webhook1",
	},
	{
		id: BigInt(96),
		created_at: new Date("2050-02-01T12:00:00Z"),
		user_id: "22222",
		channel_id: "55555",
		reminder_message: "go to store",
		time: new Date(new Decimal(_02_01_2050_unix).toNumber() * 1000),
		webhook_id: "webhook2",
	},
	{
		id: BigInt(1),
		created_at: new Date("2050-01-01T10:00:00Z"),
		user_id: "11111",
		channel_id: "44444",
		reminder_message: "hwed",
		time: new Date(new Decimal(12345).toNumber() * 1000),
		webhook_id: "webhook1",
	},
	{
		id: BigInt(2),
		created_at: new Date("2050-01-02T12:00:00Z"),
		user_id: "22222",
		channel_id: "55555",
		reminder_message: "sde",
		time: new Date(new Decimal(67890).toNumber() * 1000),
		webhook_id: "webhook2",
	},
	{
		id: BigInt(3),
		created_at: new Date("2050-01-03T14:00:00Z"),
		user_id: "33333",
		channel_id: "66666",
		reminder_message: "meeting at 2 PM",
		time: new Date(new Decimal(98765).toNumber() * 1000),
		webhook_id: "webhook3",
	},
	{
		id: BigInt(4),
		created_at: new Date("2050-01-04T16:00:00Z"),
		user_id: "44444",
		channel_id: "77777",
		reminder_message: "submit report",
		time: new Date(new Decimal(54321).toNumber() * 1000),
		webhook_id: "webhook4",
	},
	{
		id: BigInt(5),
		created_at: new Date("2050-01-05T18:00:00Z"),
		user_id: "55555",
		channel_id: "88888",
		reminder_message: "call mom",
		time: new Date(new Decimal(13579).toNumber() * 1000),
		webhook_id: "webhook5",
	},
	{
		id: BigInt(6),
		created_at: new Date("2050-01-06T20:00:00Z"),
		user_id: "66666",
		channel_id: "99999",
		reminder_message: "buy groceries",
		time: new Date(new Decimal(24680).toNumber() * 1000),
		webhook_id: "webhook6",
	},
	{
		id: BigInt(7),
		created_at: new Date("2050-01-07T22:00:00Z"),
		user_id: "77777",
		channel_id: "15432",
		reminder_message: "send email",
		time: new Date(new Decimal(86420).toNumber() * 1000),
		webhook_id: "webhook7",
	},
	{
		id: BigInt(8),
		created_at: new Date("2050-01-08T00:00:00Z"),
		user_id: "88888",
		channel_id: "11111",
		reminder_message: "exercise",
		time: new Date(new Decimal(11111).toNumber() * 1000),
		webhook_id: "webhook8",
	},
	{
		id: BigInt(9),
		created_at: new Date("2050-01-09T02:00:00Z"),
		user_id: "99999",
		channel_id: "22222",
		reminder_message: "read a book",
		time: new Date(new Decimal(22222).toNumber() * 1000),
		webhook_id: "webhook9",
	},
	{
		id: BigInt(10),
		created_at: new Date("2050-01-10T04:00:00Z"),
		user_id: "00000",
		channel_id: "33333",
		reminder_message: "attend webinar",
		time: new Date(new Decimal(33333).toNumber() * 1000),
		webhook_id: "webhook10",
	},
];

function _initMappings() {
	const _reminderDataMappings = new Collection<string, reminders>();

	for (const entry of sampleReminderTestData) {
		_reminderDataMappings.set(entry.id.toString(), entry);
	}
}

export const reminderDataMappings = _initMappings();
