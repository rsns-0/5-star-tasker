import ReadyClient from '../../models/client';
import dotenv from 'dotenv';

export function initTestClient(){
	dotenv.config();
	const token = process.env.DISCORD_TOKEN;

	if (!token) {
		throw new Error("Missing discord token");
	}
	

	const client = new ReadyClient({ intents: [] })
	return client
}