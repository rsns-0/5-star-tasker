import { Events, IntentsBitField, Partials } from "discord.js";
import { REST, Routes } from "discord.js";
import { getCommandExports, getEventExports } from "../services/exportService";

import ReadyClient from "../models/client";
import { cooldownServiceInstanceForDiscordJs } from "../services/cooldownServiceInstance";
import { logger } from "@/backend/logger/logger";

export const partiallyInitializeClient = () => {
	const intents = new IntentsBitField();
	intents.add(
		IntentsBitField.Flags.DirectMessageReactions,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.DirectMessages
	);
	const partials = [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User];
	logger.info(`Intents loaded: ${intents.toArray()}`)
	logger.info(`Partials loaded (enum values): ${partials}`)
	const client = new ReadyClient({
		intents: intents,
		partials: partials,
	});
	logger.info(`Successfully added intents and partials to client.`)
	return client;
};
export async function registerCommandsToClient(client: ReadyClient) {
	
	const res = await getCommandExports();
	const seen = new Set<string>()
	for (const { data, execute, cooldown } of res) {
		if(seen.has(data.name)){
			throw new Error(`Assertion error: Duplicate command name ${data.name}.`)
		}
		seen.add(data.name)
		cooldownServiceInstanceForDiscordJs.registerCommandCooldown(data.name, cooldown)
		client.commands.set(data.name, { data, execute });
	}
	logger.info(`Successfully registered ${seen.size} commands.`)
}

export async function registerEventsToClient(client: ReadyClient) {
	const res = await getEventExports();
	const seen = new Set<Events>()

	for (const { name, once, execute } of res) {
		
		if(seen.has(name)){
			throw new Error(`Assertion error: Duplicate event name ${name}; You should not be creating more than one event listener with the channel. Have the event listener act as the controller to direct the event to the appropriate function instead.`)
		}
		
		seen.add(name)
		const _name = name as string;
		if (once) {
			client.once(_name, execute);
		} else {
			client.on(_name, execute);
		}
		logger.info(`Successfully registered event listener for event: ${name}.`)
	}
	logger.info(`Successfully registered ${seen.size} event listeners.`)
}

export const registerCommandsToDiscord = async (
	{
		clientId,
		guildId,
		token,
	} : {
		clientId: string;
		guildId: string;
		token: string;
	}
) => {
	
	const commandArr = await getCommandExports()
	const serializedCommands = commandArr.map((command) => command.data.toJSON());
	const rest = new REST().setToken(token);
	try {
		console.log(`Started refreshing ${serializedCommands.length} application (/) commands.`);
		const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: serializedCommands,
		});
		if (Array.isArray(data)) {
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} else {
			console.warn(
				"Sent response to discord server but it was not an array." + JSON.stringify(data)
			);
		}
	} catch (error) {
		console.error(error);
	}
};
