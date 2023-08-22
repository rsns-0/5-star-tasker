import { describe, expect, it } from "vitest";

import { PrismaClient } from "@prisma/client";

describe("country", () => {
	it("should have return 10 records with take set to 10", async () => {
		const prisma = new PrismaClient();
		const res = await prisma.countries.findMany({
			where: {
				id: { lte: 20 ,},
			},
      take: 10,
		});
		expect(res.length).toBeGreaterThan(0)
    expect(res.length).toEqual(10)
		
	});
});
