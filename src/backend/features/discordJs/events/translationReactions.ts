import { Events } from 'discord.js';

const name = Events.MessageReactionAdd;
const execute = async (message:any, user:any) => {
	
	console.log(message, user);
};


export { name, execute }	