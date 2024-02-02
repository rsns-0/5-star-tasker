import prisma from "../db/prismaInstance"

describe("logging", () => {
	const data = {
		tags: ["testtag1", "testtag2"],
		level: 3,
		message: "test message",
		json: {
			ob: new Date(),
		},
	}
	it("should generate array text type properly", async () => {
		const res = await prisma.logs.create({
			data,
		})
		expect(res.tags.includes("testtag1")).toBe(true)
	})
	it("should successfully generate json object from error", async () => {
		try {
			throw new Error("test error", { cause: new Error("asd") })
		} catch (err) {
			if (!(err instanceof Error)) {
				throw err
			}
			const res = await prisma.logs.logError(err).then((res) => res)
			expect(res).not.toEqual({})
			expect(res).toBeDefined()
		}
	})
})

type _TestPaginationData = {
	id: number
	name: string
	value: number
	text: string
}

function createTestPaginationData(amount: number) {
	const results: _TestPaginationData[] = []
	for (let i = 0; i < amount; i++) {
		const data: _TestPaginationData = {
			id: i,
			name: `name${i}`,
			value: i,
			text: `text${i}`,
		}
		results.push(data)
	}
	return results
}

describe("pagination", () => {
	beforeAll(async () => {
		const data = createTestPaginationData(100)
		const p1 = prisma.test_pagination.deleteMany()
		const p2 = prisma.test_pagination.createMany({ data })
		await prisma.$transaction([p1, p2])
	})
	it("pagination sanity check", async () => {
		const page1 = await prisma.test_pagination.paginate({
			limit: 40,
			page: 1,
		})
		const page2 = await page1.nextPage()
		const page3 = await page2.nextPage()
		const page4 = await page3.nextPage()
		const page5 = await page4.nextPage()
		expect(page5.count).toEqual(100)
		expect(page1.hasPrevPage).toEqual(false)
		expect(page3.hasNextPage).toEqual(false)
		expect(page2.hasNextPage).toEqual(true)
		expect(page2.hasPrevPage).toEqual(true)

		expect(page2.result[10].name).toEqual("name50")

		expect(page1.result.length).toEqual(40)
		expect(page2.result.length).toEqual(40)
		expect(page3.result.length).toEqual(20)
		expect(page4.result.length).toEqual(0)
		expect(page5.result.length).toEqual(0)
	})
})
