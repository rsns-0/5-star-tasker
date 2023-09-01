import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    DiscordAPIError,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
} from "discord.js";
import {
    timezonesNegatives,
    timezonesPositives,
} from "../models/selectBoxForTimezones";

import { logger } from "@/backend/logger/logger";
import prisma from "@/backend/db/prismaInstance";
import { firstRegistration } from "@/backend/functionForFirstRegistration";
import {
    reminderExplanationEmbed,
    reminderFinishedEmbed,
    reminderSelectTimezoneEmbed,
    reminderSomethingWrongEmbed,
    reminderTimezoneRegisteredEmbed,
} from "../utils/createReminderExplanationEmbed";
import { timeStringToDayjsObj } from "../services/stringToDayjsObj";
import { connect } from "http2";

export const data = new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Create a reminder")
    .addStringOption((option) =>
        option
            .setName("time")
            .setDescription("send 0 (zero) for better explanation")
            .setRequired(true)
            .setMaxLength(25)
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
    await interaction.deferReply({ ephemeral: true }); // with this, the bot don't need to reply within 3s, so no bugs, also feel free to delete my comments
    try {
        const timeString = interaction.options.getString("time")!;
        if (timeString === "0") {
            interaction.editReply({
                embeds: [reminderExplanationEmbed()],
            });
            return;
        }
        const result = await prisma.discord_user.findUnique({
            where: {
                id: parseInt(interaction.user.id),
            },
            include: {
                timezones: {
                    select: {
                        value: true,
                        label: true,
                        description: true,
                    },
                },
            },
        });
        const userTimezoneDescription = result?.timezones?.description;
        const userTimezoneName = result?.timezones?.label;
        const userTimezone = result?.timezones?.value;
        if (userTimezone === undefined || userTimezone === null) {
            const row1 =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    timezonesNegatives
                );
            const row2 =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    timezonesPositives
                );
            const embedToUpdate = reminderSelectTimezoneEmbed();
            const response = await interaction.editReply({
                embeds: [reminderSelectTimezoneEmbed()],
                components: [row1.toJSON(), row2.toJSON()],
            });
            const confirmation = await response.awaitMessageComponent({
                filter: (i): boolean => i.user.id === interaction.user.id,
                time: 60000,
            });
            if (
                confirmation.isStringSelectMenu() &&
                (confirmation.customId === "positives" ||
                    confirmation.customId === "negatives")
            ) {
                await confirmation.update({
                    embeds: [
                        embedToUpdate
                            .setTitle("Saving your timezone...")
                            .setDescription(" "),
                    ],
                    components: [],
                }); // block user to select smth else while bot processing, no reason to make like a catch but feel free to do it, nvm just (Matuz TODO)
                await firstRegistration(interaction.user);
                const tzinfo = await prisma.timezones.findFirst({
                    where: {
                        value: confirmation.values[0],
                    },
                });
                await prisma.discord_user.update({
                    where: {
                        id: parseInt(interaction.user.id),
                    },
                    data: {
                        timezone_id: tzinfo?.id,
                    },
                });
                await interaction.followUp({
                    // Matuz TODO: Make another command and call that command here, so no repetitive use of things (soon)
                    // edit: reading on the next day, I'm now confused, I'll do it later
                    embeds: [
                        reminderTimezoneRegisteredEmbed(tzinfo, timeString),
                    ],
                    ephemeral: true,
                });
            }
        } else {
            let reminder = interaction.options.getString("reminder")!;
            if (!reminder) {
                reminder = "Pong 🏓";
            }
            const channelId = parseInt(interaction.channelId);
            const date = timeStringToDayjsObj(timeString, userTimezone);
            await prisma.reminders.create({
                data: {
                    reminder: reminder,
                    discord_user: {
                        connect: {
                            id: parseInt(interaction.user.id),
                        },
                    },
                    time: date.unix(),
                },
            });
            await interaction.editReply({
                embeds: [reminderFinishedEmbed(date, reminder)],
            });
        }
    } catch (e) {
        if (e instanceof DiscordAPIError) {
            await interaction.editReply({
                embeds: [reminderSomethingWrongEmbed()],
            });
        } else {
            logger.error(e);
            throw e;
        }
    }
};
