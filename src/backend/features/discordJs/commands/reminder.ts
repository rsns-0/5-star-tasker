import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import timeStringToDateObj from "../services/stringToDateObj";

export const data = new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Create a reminder")
    .addStringOption((option) =>
        option
            .setName("time")
            .setDescription("send 0 (zero) for better explanation")
            .setRequired(true)
    )
    .addStringOption(
        (option) =>
            option
                .setName("reminder")
                .setDescription(
                    "What do you want to be pinged for? (200 chars limit)"
                )
                .setRequired(false)
                .setMaxLength(200) // can be reduced or increased
    );

export const execute = async (interaction: ChatInputCommandInteraction) => {
    const timeString = interaction.options.getString("time")!;
    if (timeString === "0") {
        interaction.reply({
            content: "Explanation",
            ephemeral: true,
        });
    } else {
        const timezone = "America/New_York";
        const dateObject = timeStringToDateObj(timeString, timezone);
        interaction.reply({
            content: dateObject.toString(),
            ephemeral: true,
        });
    }
};
