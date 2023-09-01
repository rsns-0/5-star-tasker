// IDK where to put this, we might call it not only with the bot but whenever a user make login in the site as well, idk
import { User } from "discord.js";
import prisma from "./db/prismaInstance";

export const firstRegistration = async (user: User) => {
    await prisma.discord_user.create({
        data: {
            id: parseInt(user.id),
            username: user.username,
        },
    });
};

// might do a updateUser() in the future, in case user change username or smth esle
