import { Awaitable, ClientEvents, CommandInteraction, Events, SlashCommandBuilder } from "discord.js";
import { ClientHandler, InteractionHandler } from './handler';

export type CommandExport = {
	data: SlashCommandBuilder;
	execute: InteractionHandler;
}

export type EventExport = {
	name: Events
	once?: boolean
	execute: (...args: ClientEvents[]) => Awaitable<void>
}



export type FolderOptions = "events" | "commands";
