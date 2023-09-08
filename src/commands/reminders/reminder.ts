import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	DiscordAPIError,
	PermissionFlagsBits,
	SlashCommandBuilder,
	StringSelectMenuBuilder
} from 'discord.js';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import {
	reminderExplanationEmbed,
	reminderFinishedEmbed,
	reminderSelectTimezoneEmbed,
	reminderSomethingWrongEmbed,
	reminderTimezoneRegisteredEmbed
} from '../../features/reminders/commandComponents/createReminderExplanationEmbed';
import { timezonesNegatives, timezonesPositives } from '../../features/reminders/selectBoxForTimezones';

import { Subcommand } from '@sapphire/plugin-subcommands';
import { firstRegistration } from '../../features/reminders/commandComponents/firstRegistration';
import prisma from '../../db/prismaInstance';
import { timeStringToDayjsObj } from '../../features/reminders/services/stringToDayjsObj';
import { logger } from '../../logger/logger';

const reminderData = new SlashCommandBuilder()
	.setName('reminder')
	.setDescription('Create a reminder')
	.addSubcommand((subcommand) => subcommand.setName('edit').setDescription('Edit your reminders'))
	.addSubcommand((subcommand) =>
		subcommand
			.setName('set')
			.setDescription('Info about a user')
			.addStringOption((option) =>
				option.setName('time').setDescription('set the time for the reminder, more info in /reminder help').setRequired(true).setMaxLength(25)
			)
			.addStringOption((option) =>
				option.setName('message').setDescription('What do you want to be pinged for? (200 chars limit)').setRequired(false)
			)
	)
	.addSubcommand((subcommand) => subcommand.setName('help').setDescription('Explanation of how to use /reminder'));

//? apparently sapphire has built in error handling?
@ApplyOptions<Subcommand.Options>({
	name: 'reminder',
	description: 'Manage reminders. Use help for more information.',

	subcommands: [
		{
			name: 'help',
			chatInputRun: 'help'
		},
		{
			name: 'set',
			chatInputRun: 'set'
		},
		{
			name: 'edit',
			chatInputRun: 'edit'
		}
	]
})
export class UserCommand extends Subcommand {
	public override registerApplicationCommands(registry: Subcommand.Registry) {
		// Register slash command

		registry.registerChatInputCommand(reminderData);
	}

	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks])
	public help(interaction: ChatInputCommandInteraction) {
		interaction.reply({
			embeds: [reminderExplanationEmbed()]
		});
	}

	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks])
	public async set(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply({ ephemeral: true }); // with this, the bot don't need to reply within 3s, so no bugs, also feel free to delete my comments

			// * Check db for user timezone data
			const timeString = interaction.options.getString('time')!;
			const result = await prisma.discord_user.findUnique({
				where: {
					id: parseInt(interaction.user.id)
				},
				include: {
					timezones: {
						select: {
							value: true
						}
					}
				}
			});
			const userTimezone = result?.timezones?.value;
			//* If user doesn't exist or has no timezone data, prompt user and persist data.
			if (userTimezone === undefined || userTimezone === null) {
				const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(timezonesNegatives);
				const row2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(timezonesPositives);
				const embedToUpdate = reminderSelectTimezoneEmbed();
				const response = await interaction.editReply({
					embeds: [reminderSelectTimezoneEmbed()],
					components: [row1.toJSON(), row2.toJSON()]
				});
				const confirmation = await response.awaitMessageComponent({
					filter: (i): boolean => i.user.id === interaction.user.id,
					time: 60000
				});
				if (confirmation.isStringSelectMenu() && (confirmation.customId === 'positives' || confirmation.customId === 'negatives')) {
					await confirmation.update({
						embeds: [embedToUpdate.setTitle('Saving your timezone...').setDescription(' ')],
						components: []
					}); // block user to select smth else while bot processing, no reason to make like a catch but feel free to do it, nvm just (Matuz TODO)
					//? The bot already blocks actions while it is processing a command for a user.
					await firstRegistration(interaction.user);

					const tzinfo = await prisma.timezones.findFirst({
						where: {
							value: confirmation.values[0]
						}
					});
					if (!tzinfo) {
						throw new Error(
							'Assertion error: Timezone not found. Check to make sure the form field options align with the database data.'
						);
					}
					await prisma.discord_user.update({
						where: {
							id: parseInt(interaction.user.id)
						},
						data: {
							timezone_id: tzinfo?.id
						}
					});
					await interaction.followUp({
						// Matuz TODO: Make another command and call that command here, so no repetitive use of things (soon)
						// edit: reading on the next day, I'm now confused, I'll do it later
						embeds: [reminderTimezoneRegisteredEmbed(tzinfo, timeString)],
						ephemeral: true
					});
				}
			}
			// * Else create reminder for user.
			else {
				let reminder = interaction.options.getString('reminder') ?? 'Pong 🏓';

				const date = timeStringToDayjsObj(timeString, userTimezone);
				await prisma.reminders.create({
					data: {
						reminder_message: reminder,
						discord_user: {
							connect: {
								id: parseInt(interaction.user.id)
							}
						},
						time: date.unix()
					}
				});
				await interaction.editReply({
					embeds: [reminderFinishedEmbed(date, reminder)]
				});
			}
		} catch (e) {
			if (e instanceof DiscordAPIError) {
				await interaction.editReply({
					embeds: [reminderSomethingWrongEmbed()]
				});
			} else {
				logger.error(e);
				throw e;
			}
		}
	}

	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks])
	public async edit(interaction: ChatInputCommandInteraction) {
		//TODO: getUserReminders
		interaction;
		throw new Error('Assertion error: Method not implemented.');
	}
}
