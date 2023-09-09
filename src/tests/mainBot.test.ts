import { WebhookClient } from 'discord.js';
import { container } from '@sapphire/framework';
import { main } from '../init/initBot.js';

describe.skipIf(!process.env.RUN_BOT_TESTS)('Bot tests that require startup', () => {
	let c: typeof container;

	beforeAll(async () => {
		await main();
		c = container;
	});
	afterAll(async () => {
		await container.client.destroy();
	});
	it('webhook test functional test', async () => {
		const res = await c.prisma.webhooks.findFirst({ where: { name: '5StarWebhookPrimary' } });
		const resp = await new WebhookClient({
			id: res!.id.toString(),
			token: res!.token!,
			url: res!.url
		}).send(`hello world 123`);
		expect(resp.content).toContain('hello world 123');
	}, 60000);
});
