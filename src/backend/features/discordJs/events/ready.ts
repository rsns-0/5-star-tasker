import { Events } from 'discord.js';
import ReadyClient from '../models/client';

const event = {
	name: Events.ClientReady,
	once: true,
	execute(client:ReadyClient) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};

export default event