import { CommandInteraction } from "discord.js";
import ReadyClient from "../models/client";

export type InteractionHandler = (interaction: CommandInteraction) => Promise<void>;
export type ClientHandler = (client: ReadyClient) => Promise<void>;
