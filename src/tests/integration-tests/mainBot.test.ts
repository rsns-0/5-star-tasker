import { container } from "@sapphire/framework"
import { WebhookClient } from "discord.js"
import { main } from "../../init/initBot.js"
import { testCreateReminderDTOFactory } from "./createReminderDTOFactoryTest.js"
import { config } from "dotenv"
config()

describe.skipIf(!process.env.RUN_BOT_TESTS)("Bot tests that require startup", () => {
	let c: typeof container

	beforeAll(async () => {
		await main()
		c = container
	})
	afterAll(async () => {
		await container.client.destroy()
	})
	it("webhook test functional test", async () => {
		const res = await c.prisma.webhooks.findFirstOrThrow({
			where: { url: process.env.TEST_WEBHOOK_URL! },
		})
		const resp = await new WebhookClient({
			id: res!.id.toString(),
			token: res!.token!,
			url: res!.url,
		}).send(`hello world 123`)
		expect(resp.content).toContain("hello world 123")
	}, 60000)

	testCreateReminderDTOFactory()
})
