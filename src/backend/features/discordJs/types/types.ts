import { Awaitable, ClientEvents, Events, SlashCommandBuilder } from "discord.js";

import { InteractionHandler } from './handler';

export type CommandExport = {
	data: SlashCommandBuilder;
	execute: InteractionHandler;
	cooldown?: number
}

export type EventExport = {
	name: Events
	once?: boolean
	execute: (...args: ClientEvents[]) => Awaitable<void>
}



export type FolderOptions = "events" | "commands";