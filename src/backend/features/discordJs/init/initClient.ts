import { IntentsBitField, Partials } from "discord.js";
import { REST, Routes } from "discord.js";
import { getCommandExports, getEventExports } from "../services/exportService";

import { CommandExport } from "../types/types";
import ReadyClient from "../models/client";
import { descendToFolderThenGetExportsFromFolder } from "../../fileParsing/services/fileParsingService";

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

	const client = new ReadyClient({
		intents: intents,
		partials: partials,
	});
	return client;
};
export async function registerCommandsToClient(client: ReadyClient) {
	const res = await getCommandExports();
	for (const { data, execute } of res) {
		client.commands.set(data.name, { data, execute });
	}
}

export async function registerEventsToClient(client: ReadyClient) {
	const res = await getEventExports();

	for (const { name, once, execute } of res) {
		const _name = name as string;
		if (once) {
			client.once(_name, execute);
		} else {
			client.on(_name, execute);
		}
	}
}

export const registerCommandsToDiscord = async (
	clientId: string,
	guildId: string,
	token: string
) => {
	if (!clientId || !guildId || !token) {
		throw new Error("Missing discord settings");
	}
	const commandArr = await descendToFolderThenGetExportsFromFolder<CommandExport>(
		"commands",
		__dirname
	);
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
