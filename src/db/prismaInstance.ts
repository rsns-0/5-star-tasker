import { PrismaClient } from "@prisma/client";
import pagination from "prisma-paginate";
import guildsAndChannels from "./extensions/guildsAndChannels";
import languages from "./extensions/languages";
import logging from "./extensions/logging";
import reminders from "./extensions/reminders";
import users from "./extensions/users";
import utils from "./extensions/utills";
import webhooks from "./extensions/webhooks";
import { config } from "dotenv"
config()
export const prisma = new PrismaClient({ log: process.env.DISABLE_LOGGING ? [] : ["query"] })
	.$extends(utils)
	.$extends(logging)
	.$extends(reminders)
	.$extends(languages)
	.$extends(guildsAndChannels)
	.$extends(webhooks)
	.$extends(pagination)
	.$extends(users)

export default prisma

