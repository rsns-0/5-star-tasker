import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	DiscordAPIError,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
} from "discord.js";
import { timezonesNegatives, timezonesPositives } from "../models/selectBoxForTimezones";

import { Logger } from "@/backend/logger/logger";
import timeStringToDayjsObj from "../services/stringToDayjsObj";

export const data = new SlashCommandBuilder()
	.setName("reminder")
	.setDescription("Create a reminder")
	.addStringOption((option) =>
		option
			.setName("time")
			.setDescription("send 0 (zero) for better explanation")
			.setRequired(true)
			.setMaxLength(50)
	)
	.addStringOption(
		(option) =>
			option
				.setName("reminder")
				.setDescription("What do you want to be pinged for? (200 chars limit)")
				.setRequired(false)
				.setMaxLength(200) // can be reduced or increased
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const timeString = interaction.options.getString("time")!;
	const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(timezonesNegatives);
	const row2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(timezonesPositives);
	if (timeString === "0") {
		interaction.reply({
			content: "Explanation",
			ephemeral: true,
		});
	} else {
		const response = await interaction.reply({
			content: "Select your timezone",
			components: [row1.toJSON(), row2.toJSON()],
			ephemeral: true,
		});

		try {
			/*
            Potential unwanted behavior: When doing 2-step prompt, If the user waits a long time during selection,
            the time string from the first interaction will be stale.
            
            Recommended options:
                1. Store user information in database
                    Split this command into two commands. One for setting the timezone and one for the reminder.
                    On first interaction with the bot, the user uses the timezone setting command.
                    Persist user ID & timezone to database.
                    On future interactions with the bot, the user uses the reminder creation command.
                        During this interaction, the listener can fetch the user's timezone to calculate the reminder time.
                    Also better UX not having to select the timezone every time.
                OR
                2. Timestamps
                    Get a timestamp on the first interaction and a timestamp on the second interaction.
                    Use the difference of these to get the elapsed time.
                    Use the elapsed time along with the user's provided reminder time to calculate the adjust reminder time.

            */
			const confirmation = await response.awaitMessageComponent({
				filter: (i) => i.user.id === interaction.user.id,
				time: 60000,
			});
			if (
				confirmation.isStringSelectMenu() &&
				(confirmation.customId === "positives" || confirmation.customId === "negatives")
			) {
				const dayJsObj = timeStringToDayjsObj(
					timeString.toLowerCase(),
					confirmation.values[0]
				);
				await confirmation.update({
					content: `Reminder Added Successfully <t:${dayJsObj.unix()}:F>`,
					components: [],
				});
			}
		} catch (e) {
			if (e instanceof DiscordAPIError) {
				await interaction.editReply({
					content: "You had 1 minute to select your timezone, please try again later",
					components: [],
				});
			} else {
                new Logger().logError(e)
				throw e;
			}
		}
	}
};
