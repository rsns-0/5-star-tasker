import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { cooldownServiceInstanceForDiscordJs } from "../services/cooldownServiceInstance";

const name = "embed"

export const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription("Creates embed from user")
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
export const cooldown = 10000
export const execute = async (interaction: ChatInputCommandInteraction) => {
	
	const result = await cooldownServiceInstanceForDiscordJs.processUserCooldown(interaction.user.id, name)
	if(result.isOnCooldown){
		interaction.reply({
			content: `You are on cooldown for ${result.timeRemaining} ${result.unit}.`
		})
		return
	}
	
	const fields: Record<string, string> = {
		title: "",
		description: "",
	};

	for (const key in fields) {
		fields[key] = interaction.options.getString(key)!;
	}

	interaction.reply({
		content: `This is what you provided. For the title you entered ${fields.title}. For the description you entered ${fields.description}.`,
	});
};