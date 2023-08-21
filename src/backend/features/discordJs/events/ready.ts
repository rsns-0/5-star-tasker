import { Events } from 'discord.js';
import ReadyClient from '../models/client';

const name = Events.ClientReady;
const once = true;
const execute = (client: ReadyClient) => {
		console.log(`Ready! Logged in as ${client.user.tag}`);
};

export { name, once, execute}