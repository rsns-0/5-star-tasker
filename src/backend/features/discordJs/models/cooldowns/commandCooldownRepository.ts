import { Collection, CommandInteraction } from "discord.js";

import { CommandExport } from "../../types/types";
import { setTimeout } from "timers";

function handleCooldown(
	timestamps: Map<string, number>,
	command: CommandExport,
	interaction: CommandInteraction
) {
	const now: number = Date.now();
	const defaultCooldownDuration: number = 3;
	const cooldownAmount: number = (command.cooldown ?? defaultCooldownDuration) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime: number = timestamps.get(interaction.user.id)! + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp: number = Math.round(expirationTime / 1000);
			return interaction.reply({
				content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
				ephemeral: true,
			});
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	return null;
}

export class CommandCooldownRepository {
	private commandCooldownData: Collection<string, number> = new Collection();

	constructor(private _defaultCooldown: number = 1000) {}

	public getDefaultCooldown(): number {
		return this._defaultCooldown;
	}

	public setDefaultCooldown(value: number) {
		this._defaultCooldown = value;
	}

	public registerCooldown(commandName: string, cooldown: number) {
		if (cooldown) {
			this.setCooldown(commandName, cooldown);
			return;
		}
		this.applyDefaultCooldown(commandName);
	}

	private setCooldown(commandName: string, cooldown: number) {
		this.commandCooldownData.set(commandName, cooldown);
	}

	private applyDefaultCooldown(commandName: string) {
		this.setCooldown(commandName, this._defaultCooldown);
	}

	public getCooldown(commandName: string) {
		const res = this.commandCooldownData.get(commandName);
		return res;
	}
}

