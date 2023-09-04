import { PrismaClient } from '@prisma/client';
import utils from './extensions/utills';

const prisma = new PrismaClient().$extends(utils);

export default prisma;
