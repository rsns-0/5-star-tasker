import { Collection, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

type MenuItemData = {
	label: string;
	description: string;
	emoji: string;
	value: string;
};

export class DateMenuInput {
	constructor(public data: MenuItemData) {}

	toMenuItem(): StringSelectMenuOptionBuilder {
		const data = this.data;
		const res = new StringSelectMenuOptionBuilder()
			.setLabel(data.label)
			.setDescription(data.description)
			.setEmoji(data.emoji)
			.setValue(data.value);
		return res;
	}
}

export class DateMenuInputCollection extends Collection<string, DateMenuInput> {
	constructor(data: MenuItemData[]) {
		super();
		const items = data.map((data) => new DateMenuInput(data));
		for (const item of items) {
			this.set(item.data.label, item);
		}
	}

	toMenuItems() {
		const items = this.map((item) => item.toMenuItem());
		return items;
	}

    toArray(){
        return Array.from(this.values())
    }
}



export const timezonePositiveOptions = new DateMenuInputCollection([
	{
		label: "UTC+0",
		description: "Greenwich Mean Time",
		emoji: "🌐",
		value: "Etc/GMT+0",
	},
	{
		label: "UTC+1",
		description: "Western African & Central European",
		emoji: "🌐",
		value: "Etc/GMT-1",
	},
	{
		label: "UTC+2",
		description: "Central/South African & Eastern European",
		emoji: "🌐",
		value: "Etc/GMT-2",
	},
	{
		label: "UTC+3",
		description: "Eastern African & Arabia Standard",
		emoji: "🌐",
		value: "Etc/GMT-3",
	},
	{
		label: "UTC+4",
		description: "Gulf/Georgia/Armenia/Moscow/Samara...",
		emoji: "🌐",
		value: "Etc/GMT-4",
	},
	{
		label: "UTC+5",
		description: "Mawson/Aqtobe/Turkmenistan/Maldives...",
		emoji: "🌐",
		value: "Etc/GMT-5",
	},
	{
		label: "UTC+6",
		description: "Vostok/Kirgizstan/Bangladesh/Bhutan...",
		emoji: "🌐",
		value: "Etc/GMT-6",
	},
	{
		label: "UTC+7",
		description: "Indochina/West Indonesia/Osmk/Hovd...",
		emoji: "🌐",
		value: "Etc/GMT-7",
	},
	{
		label: "UTC+8",
		description: "China/Central Indonesia/Philippines...",
		emoji: "🌐",
		value: "Etc/GMT-8",
	},
	{
		label: "UTC+9",
		description: "Japan/Korea/Palau/East Indonesia...",
		emoji: "🌐",
		value: "Etc/GMT-9",
	},
	{
		label: "UTC+10",
		description: "Australia/Chuuk/Papua/Chamorro...",
		emoji: "🌐",
		value: "Etc/GMT-10",
	},
	{
		label: "UTC+11",
		description: "Sakhalin/Vladivostok/Vanuatu...",
		emoji: "🌐",
		value: "Etc/GMT-11",
	},
	{
		label: "UTC+12",
		description: "Marshall Islands/New Zealand...",
		emoji: "🌐",
		value: "Etc/GMT-12",
	},
	{
		label: "UTC+13",
		description: "Tonga/Phoenix/West Samoa...",
		emoji: "🌐",
		value: "Etc/GMT-13",
	},
	{
		label: "UTC+14",
		description: "Line Is. Time",
		emoji: "🌐",
		value: "Etc/GMT-14",
	},
]);
export const timezoneNegativeOptions = new DateMenuInputCollection([
	{
		label: "UTC-0",
		description: "Greenwich Mean Time",
		emoji: "🌐",
		value: "Etc/GMT-0",
	},
	{
		label: "UTC-1",
		description: "Azores/Cape Verde/Eastern Greenland",
		emoji: "🌐",
		value: "Etc/GMT-1",
	},
	{
		label: "UTC-2",
		description: "Fernando de Noronha/South Georgia",
		emoji: "🌐",
		value: "Etc/GMT-2",
	},
	{
		label: "UTC-3",
		description: "Brasilia/Argetine/Suriname/Uruguay...",
		emoji: "🌐",
		value: "Etc/GMT-3",
	},
	{
		label: "UTC-4",
		description: "Atlantic/Chile/Amazon/Paraguay...",
		emoji: "🌐",
		value: "Etc/GMT-4",
	},
	{
		label: "UTC-5",
		description: "Eastern Standard Time/Cuba/Peru...",
		emoji: "🌐",
		value: "Etc/GMT-5",
	},
	{
		label: "UTC-6",
		description: "Central Standard Time/Galapagos...",
		emoji: "🌐",
		value: "Etc/GMT-6",
	},
	{
		label: "UTC-7",
		description: "Mountain Standard Time",
		emoji: "🌐",
		value: "Etc/GMT-7",
	},
	{
		label: "UTC-8",
		description: "Pacific & Metlakatla Standard Time",
		emoji: "🌐",
		value: "Etc/GMT-8",
	},
	{
		label: "UTC-9",
		description: "Gambier & Alaska Standard Time",
		emoji: "🌐",
		value: "Etc/GMT-9",
	},
	{
		label: "UTC-10",
		description: "Hawaii/Tahiti/Cook Is./Tokelau...",
		emoji: "🌐",
		value: "Etc/GMT-10",
	},
	{
		label: "UTC-11",
		description: "Niue & Samoa Standard Time",
		emoji: "🌐",
		value: "Etc/GMT-11",
	},
	{
		label: "UTC-12",
		description: "GMT-12:00",
		emoji: "🌐",
		value: "Etc/GMT-12",
	},
]);

export const timezonePositivesv2 = new StringSelectMenuBuilder()
	.setCustomId("positives")
	.setPlaceholder("Positive timezones UTC+")
	.setMaxValues(1)
	.setMinValues(1)
	.addOptions(timezonePositiveOptions.toMenuItems());

export const timezoneNegativesv2 = new StringSelectMenuBuilder()
	.setCustomId("negatives")
	.setPlaceholder("Negative timezones UTC-")
	.setMaxValues(1)
	.setMinValues(1)
	.addOptions(timezoneNegativeOptions.toMenuItems());

export const timezonesPositives = new StringSelectMenuBuilder()
	.setCustomId("positives")
	.setPlaceholder("Positive timezones UTC+")
	.setMaxValues(1)
	.setMinValues(1)
	.addOptions(
		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+0")
			.setDescription("Greenwich Mean Time")
			.setEmoji("🌐")
			.setValue("Etc/GMT+0"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+1")
			.setDescription("Western African & Central European")
			.setEmoji("🌐")
			.setValue("Etc/GMT-1"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+2")
			.setDescription("Central/South African & Eastern European")
			.setEmoji("🌐")
			.setValue("Etc/GMT-2"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+3")
			.setDescription("Eastern African & Arabia Standard")
			.setEmoji("🌐")
			.setValue("Etc/GMT-3"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+4")
			.setDescription("Gulf/Georgia/Armenia/Moscow/Samara...")
			.setEmoji("🌐")
			.setValue("Etc/GMT-4"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+5")
			.setDescription("Mawson/Aqtobe/Turkmenistan/Maldives...")
			.setEmoji("🌐")
			.setValue("Etc/GMT-5"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+6")
			.setDescription("Vostok/Kirgizstan/Bangladesh/Bhutan...")
			.setEmoji("🌐")
			.setValue("Etc/GMT-6"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+7")
			.setDescription("Indochina/West Indonesia/Osmk/Hovd...")
			.setEmoji("🌐")
			.setValue("Etc/GMT-7"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+8")
			.setDescription("China/Central Indonesia/Philippines...")
			.setEmoji("🌐")
			.setValue("Etc/GMT-8"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+9")
			.setDescription("Japan/Korea/Palau/East Indonesia...")
			.setEmoji("🌐")
			.setValue("Etc/GMT-9"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+10")
			.setDescription("Australia/Chuuk/Papua/Chamorro...")
			.setEmoji("🌐")
			.setValue("Etc/GMT-10"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+11")
			.setDescription("Sakhalin/Vladivostok/Vanuatu...")
			.setEmoji("🌐")
			.setValue("Etc/GMT-11"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+12")
			.setDescription("Marshall Islands/New Zealand...")
			.setEmoji("🌐")
			.setValue("Etc/GMT-12"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+13")
			.setDescription("Tonga/Phoenix/West Samoa...")
			.setEmoji("🌐")
			.setValue("Etc/GMT-13"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+14")
			.setDescription("Line Is. Time")
			.setEmoji("🌐")
			.setValue("Etc/GMT-14")
	);

export const timezonesNegatives = new StringSelectMenuBuilder()
	.setCustomId("negatives")
	.setPlaceholder("Negative timezones UTC-")
	.setMaxValues(1)
	.setMinValues(1)
	.addOptions(
		new StringSelectMenuOptionBuilder()
			.setLabel("UTC+0")
			.setDescription("Greenwich Mean Time")
			.setEmoji("🌐")
			.setValue("Etc/GMT+0"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC-1")
			.setDescription("Azores/Cape Verde/Eastern Greenland")
			.setEmoji("🌐")
			.setValue("Etc/GMT+1"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC-2")
			.setDescription("Fernando de Noronha/South Georgia")
			.setEmoji("🌐")
			.setValue("Etc/GMT+2"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC-3")
			.setDescription("Brasilia/Argetine/Suriname/Uruguay...")
			.setEmoji("🌐")
			.setValue("Etc/GMT+3"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC-4")
			.setDescription("Atlantic/Chile/Amazon/Paraguay...")
			.setEmoji("🌐")
			.setValue("Etc/GMT+4"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC-5")
			.setDescription("Eastern Standard Time/Cuba/Peru...")
			.setEmoji("🌐")
			.setValue("Etc/GMT+5"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC-6")
			.setDescription("Central Standard Time/Galapagos...")
			.setEmoji("🌐")
			.setValue("Etc/GMT+6"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC-7")
			.setDescription("Mountain Standard Time")
			.setEmoji("🌐")
			.setValue("Etc/GMT+7"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC-8")
			.setDescription("Pacific & Metlakatla Standard Time")
			.setEmoji("🌐")
			.setValue("Etc/GMT+8"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC-9")
			.setDescription("Gambier & Alaska Standard Time")
			.setEmoji("🌐")
			.setValue("Etc/GMT+9"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC-10")
			.setDescription("Hawaii/Tahiti/Cook Is./Tokelau...")
			.setEmoji("🌐")
			.setValue("Etc/GMT+10"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC-11")
			.setDescription("Niue & Samoa Standard Time")
			.setEmoji("🌐")
			.setValue("Etc/GMT+11"),

		new StringSelectMenuOptionBuilder()
			.setLabel("UTC-12")
			.setDescription("GMT-12:00")
			.setEmoji("🌐")
			.setValue("Etc/GMT+12")
	);
