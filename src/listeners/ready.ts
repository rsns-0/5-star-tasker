import { ApplyOptions } from '@sapphire/decorators';
import fs from 'fs';
import { Listener, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';

const dev = process.env.NODE_ENV !== 'production';

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
	private readonly style = dev ? yellow : blue;

	public override run() {
		this.printBanner();
		this.printStoreDebugInformation();
		this.getWebhooks();
		// this.createWebHooks();
	}

	private printBanner() {
		const success = green('+');

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('1.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}

	private createWebHooks() {
		const { client, logger } = this.container;
		client.guilds.cache.each(async (guild) => {
			// Loop over all channels in the guild
			guild.channels.cache.each(async (channel) => {
				// Check if the channel is a TextChannel (because voice channels don't support webhooks)
				// Also check that the bot has the necessary permissions ('MANAGE_WEBHOOKS')
				if (channel.isTextBased() && channel.permissionsFor(client.user!)?.has('ManageWebhooks') && !channel.isThread()) {
					try {
						// Create the webhook
						const res = await channel.createWebhook({
							name: Math.random().toString()
						});
						logger.debug(`Created webhook in channel "${channel.name}" (${channel.id}) of guild "${guild.name}" (${guild.id})`);
					} catch (err) {
						logger.debug(`Failed to create webhook in channel "${channel.name}" (${channel.id}) of guild "${guild.name}" (${guild.id})`);
						logger.error(err);
					}
				}
			});
		});
	}

	private getWebhooks() {
		const { client, logger, prisma } = this.container;
		client.guilds.cache.each(async (guild) => {
			const res = await guild.fetchWebhooks();
			const results = res.map((webhook) => {
				return JSON.stringify(webhook);
			});
			logger.debug(results);
			await prisma.logs.createMany({
				data: results.map((hook) => {
					const json = JSON.parse(hook);
					return {
						json
					};
				})
			});
		});
	}
}
