import { Awaitable, ClientEvents, Events, SlashCommandBuilder } from "discord.js";

import { InteractionHandler } from './handler';

/**
 * Represents a command export.
 * @typedef {Object} CommandExport
 * @property {SlashCommandBuilder} data - The command data.
 * @property {InteractionHandler} execute - The command execution handler.
 * @property {number} [cooldown] - The cooldown duration in milliseconds (optional).
 */
export type CommandExport = {
	data: SlashCommandBuilder;
	execute: InteractionHandler;
	cooldown?: number
}

/**
 * Represents an event export.
 */
export type EventExport = {
	name: Events
	once?: boolean
	execute: (...args: ClientEvents[]) => Awaitable<void>
}

export type EventHandlerExport = {
	name: string
	execute: (...args: ClientEvents[]) => Awaitable<void>
	cooldown?:number
}

export type EventHandlersData = {
	[folderName: string]: EventHandlerExport[]
}



export type FolderOptions = "events" | "commands";