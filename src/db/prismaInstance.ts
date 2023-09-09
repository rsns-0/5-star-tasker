import { PrismaClient } from '@prisma/client';
import guildsAndChannels from './extensions/guildsAndChannels';
import languages from './extensions/languages';
import logging from './extensions/logging';
import reminders from './extensions/reminders';
import utils from './extensions/utills';
import webhooks from './extensions/webhooks';

const prisma = new PrismaClient()
	.$extends(utils)
	.$extends(logging)
	.$extends(reminders)
	.$extends(languages)
	.$extends(guildsAndChannels)
	.$extends(webhooks);

export default prisma;
