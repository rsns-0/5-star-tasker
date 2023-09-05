import { User } from 'discord.js';
import prisma from '../../../db/prismaInstance';

// IDK where to put this, we might call it not only with the bot but whenever a user make login in the site as well, idk

export const firstRegistration = async (user: User) => {
	await prisma.discord_user.create({
		data: {
			id: parseInt(user.id),
			username: user.username
		}
	});
};
