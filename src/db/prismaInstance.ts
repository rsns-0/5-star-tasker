import { PrismaClient } from '@prisma/client';
import languages from './extensions/languages';
import logging from './extensions/logging';
import reminders from './extensions/reminders';
import utils from './extensions/utills';

const prisma = new PrismaClient().$extends(utils).$extends(logging).$extends(reminders).$extends(languages);

export default prisma;
