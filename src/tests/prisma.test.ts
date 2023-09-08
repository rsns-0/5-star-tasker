import { PrismaClient } from '@prisma/client';
import prisma from '../db/prismaInstance';

describe('base functionality check', () => {
	it('should have return 10 records with take set to 10', async () => {
		const prisma = new PrismaClient();

		const res = await prisma.test_countries.findMany({
			where: {
				id: { lte: 20 }
			},
			take: 10
		});
		expect(res.length).toBeGreaterThan(0);
		expect(res.length).toEqual(10);
	});
});

describe('logging', () => {
	const data = {
		tags: ['testtag1', 'testtag2'],
		level: 3,
		message: 'test message',
		json: {
			ob: new Date()
		}
	};
	it('should generate array text type properly', async () => {
		const res = await prisma.logs.create({
			data
		});
		expect(res.tags.includes('testtag1')).toBe(true);
	});
	it('should successfully generate json object from error', async () => {
		try {
			throw new Error('test error', { cause: new Error('asd') });
		} catch (err) {
			if (!(err instanceof Error)) {
				throw err;
			}
			const res = await prisma.logs.logError(err).then((res) => res.json);
			expect(res).not.toEqual({});
			expect(res).toBeDefined();
		}
	});
});
