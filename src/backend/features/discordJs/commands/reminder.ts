import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
} from "discord.js";
import timeStringToDayjsObj from "../services/stringToDayjsObj";
import {
    timezonesNegatives,
    timezonesPositives,
} from "../models/selectBoxForTimezones";

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
                .setDescription(
                    "What do you want to be pinged for? (200 chars limit)"
                )
                .setRequired(false)
                .setMaxLength(200) // can be reduced or increased
    );

export const execute = async (interaction: ChatInputCommandInteraction) => {
    const timeString = interaction.options.getString("time")!;
    const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        timezonesNegatives
    );
    const row2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        timezonesPositives
    );
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

        const collectorFilter = (i: any) => i.user.id === interaction.user.id;
        try {
            const confirmation: any = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 60000,
            });
            if (
                confirmation.customId == "positives" ||
                confirmation.customId == "negatives"
            ) {
                const dayJsObj = timeStringToDayjsObj(
                    timeString.toLowerCase(),
                    confirmation.values
                );
                await confirmation.update({
                    content: `Reminder Added Successfully <t:${dayJsObj.unix()}:F>`,
                    components: [],
                });
            }
        } catch (e) {
            await interaction.editReply({
                content:
                    "You had 1 minute to select your timezone, please try again later",
                components: [],
            });
            console.log(e);
        }
    }
};
