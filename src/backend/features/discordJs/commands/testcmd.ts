import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

// export const data = new SlashCommandBuilder()
// 	.setName('ping')
// 	.setDescription('Replies with Pong!')

// export async function execute(interaction: CommandInteraction) {
// 	await interaction.reply('Pong!');

// }

export const data = new SlashCommandBuilder()
	.setName("embedcreator")
	.setDescription("Creates embed from user input.")
	.addStringOption((option) =>
		option
			.setName("title")
			.setDescription("Set the title for the embed.")
			.setRequired(true)
			.setMinLength(1)
			.setMaxLength(256)
	)
	.addStringOption((option) =>
		option
			.setName("description")
			.setDescription("Set the description for the embed.")
			.setRequired(false)
			.setMaxLength(2000)
	);

export const execute = (interaction: ChatInputCommandInteraction) => {
	const fields: Record<string, string> = {
		title: "",
		description: "",
	};

	for (const key in fields) {
		fields[key] = interaction.options.getString(key)!;
	}

	interaction.reply({
		content: JSON.stringify(fields),
	});
}
