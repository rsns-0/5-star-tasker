import { ApplyOptions } from "@sapphire/decorators"

import { Listener, Store } from "@sapphire/framework"

import { blue, gray, green, magenta, magentaBright, white, yellow } from "colorette"

const dev = process.env.NODE_ENV !== "production"

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
	private readonly style = dev ? yellow : blue

	public override run() {
		this.printBanner()
		this.printStoreDebugInformation()
		this.runStartupTasks()
	}

	private printBanner() {
		const success = green("+")

		const llc = dev ? magentaBright : white
		const blc = dev ? magenta : blue

		const line01 = llc("")
		const line02 = llc("")
		const line03 = llc("")

		// Offset Pad
		const pad = " ".repeat(7)

		console.log(
			String.raw`
${line01} ${pad}${blc("1.0.0")}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc("<")}${llc("/")}${blc(">")} ${llc("DEVELOPMENT MODE")}` : ""}
		`.trim()
		)
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container
		const stores = [...client.stores.values()]
		const last = stores.pop()!

		for (const store of stores) logger.info(this.styleStore(store, false))
		logger.info(this.styleStore(last, true))
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(
			`${last ? "└─" : "├─"} Loaded ${this.style(store.size.toString().padEnd(3, " "))} ${
				store.name
			}.`
		)
	}

	private async runStartupTasks() {
		this.container.dbLogger.info("Starting startup tasks...")

		await Promise.all(Object.values(this.jobs).map((s) => s()))
		this.startCronJobs()

		this.container.dbLogger.info("Finished startup tasks.")
	}

	private startCronJobs() {
		setInterval(this.jobs.updateDb, 1000 * 60 * 10)
		setInterval(this.jobs.sendReminders, 1000 * 60)
	}

	private jobs = {
		updateDb: () => this.container.updaterService.updateDb(),
		sendReminders: async () => this.container.prisma.reminders.sendDueReminders(),
	}
}
