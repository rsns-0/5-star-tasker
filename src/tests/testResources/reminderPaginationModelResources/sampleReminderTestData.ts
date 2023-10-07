import { _01_01_2050_unix, _02_01_2050_unix } from "./constants";

import { Prisma, reminders } from "@prisma/client"
import Decimal from "decimal.js"


export const sampleReminderTestData: reminders[] = [
	{
		id: 94,
		created_at: new Date("2050-01-01T10:00:00Z"),
		user_id: "11111",
		channel_id: "44444",
		reminder_message: "hello world",
		time: new Date(new Decimal(_01_01_2050_unix).toNumber() * 1000),
		webhook_id: "webhook1",
	},
	{
		id: 96,
		created_at: new Date("2050-02-01T12:00:00Z"),
		user_id: "11111",
		channel_id: "55555",
		reminder_message: "go to store",
		time: new Date(new Decimal(_02_01_2050_unix).toNumber() * 1000),
		webhook_id: "webhook2",
	},
	{
		id: 1,
		created_at: new Date("2050-01-01T10:00:00Z"),
		user_id: "11111",
		channel_id: "44444",
		reminder_message: "hwed",
		time: new Date(new Decimal(12345).toNumber() * 1000),
		webhook_id: "webhook1",
	},
	{
		id: 2,
		created_at: new Date("2050-01-02T12:00:00Z"),
		user_id: "11111",
		channel_id: "55555",
		reminder_message: "sde",
		time: new Date(new Decimal(67890).toNumber() * 1000),
		webhook_id: "webhook2",
	},
	{
		id: 3,
		created_at: new Date("2050-01-03T14:00:00Z"),
		user_id: "22222",
		channel_id: "66666",
		reminder_message: "meeting at 2 PM",
		time: new Date(new Decimal(98765).toNumber() * 1000),
		webhook_id: "webhook3",
	},
	{
		id: 4,
		created_at: new Date("2050-01-04T16:00:00Z"),
		user_id: "22222",
		channel_id: "77777",
		reminder_message: "submit report",
		time: new Date(new Decimal(54321).toNumber() * 1000),
		webhook_id: "webhook4",
	},
	{
		id: 5,
		created_at: new Date("2050-01-05T18:00:00Z"),
		user_id: "22222",
		channel_id: "88888",
		reminder_message: "call mom",
		time: new Date(new Decimal(13579).toNumber() * 1000),
		webhook_id: "webhook5",
	},
	{
		id: 6,
		created_at: new Date("2050-01-06T20:00:00Z"),
		user_id: "66666",
		channel_id: "99999",
		reminder_message: "buy groceries",
		time: new Date(new Decimal(24680).toNumber() * 1000),
		webhook_id: "webhook6",
	},
	{
		id: 7,
		created_at: new Date("2050-01-07T22:00:00Z"),
		user_id: "77777",
		channel_id: "15432",
		reminder_message: "send email",
		time: new Date(new Decimal(86420).toNumber() * 1000),
		webhook_id: "webhook7",
	},
	{
		id: 8,
		created_at: new Date("2050-01-08T00:00:00Z"),
		user_id: "88888",
		channel_id: "11111",
		reminder_message: "exercise",
		time: new Date(new Decimal(11111).toNumber() * 1000),
		webhook_id: "webhook8",
	},
	{
		id: 9,
		created_at: new Date("2050-01-09T02:00:00Z"),
		user_id: "99999",
		channel_id: "22222",
		reminder_message: "read a book",
		time: new Date(new Decimal(22222).toNumber() * 1000),
		webhook_id: "webhook9",
	},
	{
		id: 10,
		created_at: new Date("2050-01-10T04:00:00Z"),
		user_id: "00000",
		channel_id: "33333",
		reminder_message: "attend webinar",
		time: new Date(new Decimal(33333).toNumber() * 1000),
		webhook_id: "webhook10",
	},
]

export const user11111 = {
	id: "11111",
	username: "testUser_11111",
}

export const userData: Prisma.discord_userCreateManyInput[] = [
	user11111,
	{
		id: "22222",
		username: "testUser_22222",
	},
	{
		id: "66666",
		username: "testUser_66666",
	},
	{
		id: "77777",
		username: "testUser_77777",
	},
	{
		id: "88888",
		username: "testUser_88888",
	},
	{
		id: "99999",
		username: "testUser_99999",
	},
	{
		id: "00000",
		username: "testUser_00000",
	},
]
