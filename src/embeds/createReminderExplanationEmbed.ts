import { Prisma } from "@prisma/client"
import { Dayjs } from "dayjs"
import { EmbedBuilder } from "discord.js"

const DEFAULT_IDLE_COLOR = 0x0099ff
const DEFAULT_CONFIRMED_COLOR = 0x00ff62
const DEFAULT_NEGATIVE_COLOR = 0x00ff62

export const reminderExplanationEmbed = (): EmbedBuilder => {
	const embed = new EmbedBuilder()
		.setColor(DEFAULT_IDLE_COLOR)
		.setTitle("EXPLANATION")
		.setDescription("Please, check out the documentation for better explanation")
		.addFields({
			name: "⏲RELATIVE TIME:",
			value:
				"**Options:** `Ny Nmm Nd Nh Nm Ns Nms`" +
				"\n***N** stands for a number of your choice*" +
				"\n*`y = year` | `mm = month` | `d = day` | `h = hour` | `m = minute` | `ms = milliseconds`*" +
				"\nAll options are optional, means you don't need to use what you don't want to" +
				"\n**Examples:** `1y` | `2h 30m` | `5m` | `7d` | `1y 2h 30m 5m 7d`",
			inline: false,
		})
		.addFields({ name: " ", value: " ", inline: false })
		.addFields({
			name: "📆ABSOLUTE TIME:",
			value:
				"This bot is currently using [Day.js](https://day.js.org/) library, " +
				"means that, as long as you input something in a [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601), it should works." +
				"\nIf you don't want to check there for possible inputs, here are some examples..." +
				"\n**Examples: ** `HH:MM:SS` | `YYYY-MM-DD HH:MM:MS`",
			inline: false,
		})
		.setThumbnail("https://i.imgur.com/cHfyNQu.png")
		.setImage("https://i.imgur.com/LGzUbus.png")

	return embed
}

export const reminderSelectTimezoneEmbed = (): EmbedBuilder => {
	const embed = new EmbedBuilder()
		.setColor(DEFAULT_IDLE_COLOR)
		.setTitle("SELECT YOUR TIMEZONE")
		.setDescription("To provide accurate information, please specify your timezone.")
	return embed
}

export const reminderTimezoneRegisteredEmbed = (
	tzinfo: Prisma.timezonesGetPayload<true>
): EmbedBuilder => {
	const embed = new EmbedBuilder()
		.setColor(DEFAULT_CONFIRMED_COLOR)
		.setTitle("DONE")
		.setDescription(
			"Your timezone is now set to " +
				`${tzinfo?.emoji} **${tzinfo?.label}** (${tzinfo?.description})` +
				"\n\nuse `/timezone` to change it" +
				"\n\nYou can now use the `/reminder set` command"
		)
	return embed
}

export const reminderFinishedEmbed = (date: Dayjs, reminder: string): EmbedBuilder => {
	const embed = new EmbedBuilder()
		.setColor(DEFAULT_CONFIRMED_COLOR)
		.setTitle("DONE")
		.setDescription(
			"Your reminder has been set to " +
				`<t:${date.unix()}:F>` +
				" and you'll be pinged with " +
				`\`${reminder}\``
		)
	return embed
}

export const reminderSomethingWrongEmbed = (): EmbedBuilder => {
	const embed = new EmbedBuilder()
		.setColor(DEFAULT_NEGATIVE_COLOR)
		.setTitle("ERROR")
		.setDescription("Something went wrong while creating the reminder. Please try again later.")
	return embed
}

export const reminderEditEmbed = (reminder: string, date: Dayjs, id: number): EmbedBuilder => {
	const embed = new EmbedBuilder()
		.setColor(DEFAULT_CONFIRMED_COLOR)
		.setTitle("DONE")
		.setDescription(
			"Your reminder has been edited to " +
				`<t:${date.unix()}:F>` +
				" and you'll be pinged with " +
				`\`${reminder}\``
		)
		.addFields(
			{
				name: "Reminder ID:",
				value: `\`${id}\``,
				inline: false,
			},
			{
				name: "Reminder Date:",
				value: `<t:${date.unix()}:F>`,
				inline: false,
			}
		)
	return embed
}

export const givingBackUserInputEmbed = (timeString: string): EmbedBuilder => {
	const embed = new EmbedBuilder()
		.setColor(DEFAULT_IDLE_COLOR)
		.setTitle(timeString)
		.setDescription(
			"Since it's the first time you're using `/reminder set` command " +
				"we need to know your timezone so we can provide accurate information" +
				"\nYou can change it anytime using `/reminder timezone` command"
		)
		.setFooter({
			text: "For Mobile users: hold on the tittle to copy your input",
		})
	return embed
}
