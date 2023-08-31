import { Collection } from "discord.js";

/**
 * ! Not ready to be used as a public class yet. Used internally for CooldownService.
 * CommandCooldownRepository is a class that manages cooldowns for commands.
 *
 * It provides methods to register, set, and get command cooldowns. It also allows setting and getting default cooldowns.
 */
export class _CommandCooldownRepository {
	/**
	 * Constructor for _CommandCooldownRepository.
	 *
	 * @param _defaultCooldown - The default cooldown time in milliseconds (defaults to 1000).
	 */
	private commandCooldownData: Collection<string, number> = new Collection();

	constructor(private _defaultCooldown: number = 1000) {}

	/**
	 * Gets the default cooldown time.
	 *
	 * @returns The default cooldown time in milliseconds.
	 */
	public getDefaultCooldown(): number {
		return this._defaultCooldown;
	}

	/**
	 * Sets the default cooldown time.
	 *
	 * @param value - The cooldown time to set as default.
	 */
	public setDefaultCooldown(value: number) {
		this._defaultCooldown = value;
	}

	/**
	 * Registers a cooldown for a command. If no cooldown time is provided, the default cooldown time is applied.
	 *
	 * @param commandName - The name of the command to register.
	 * @param cooldown - The cooldown time for the command in milliseconds.
	 */
	public registerCooldown(commandName: string, cooldown: number) {
		if (cooldown) {
			this.setCooldown(commandName, cooldown);
			return;
		}
		this.applyDefaultCooldown(commandName);
	}

	/**
	 * Sets a specific cooldown time for a command.
	 *
	 * @param commandName - The name of the command.
	 * @param cooldown - The cooldown time for the command in milliseconds.
	 */
	private setCooldown(commandName: string, cooldown: number) {
		this.commandCooldownData.set(commandName, cooldown);
	}

	/**
	 * Applies the default cooldown time to a command.
	 *
	 * @param commandName - The name of the command.
	 */
	private applyDefaultCooldown(commandName: string) {
		this.setCooldown(commandName, this._defaultCooldown);
	}

	/**
	 * Gets the cooldown time for a specific command.
	 *
	 * @param commandName - The name of the command.
	 * @returns The cooldown time for the command in milliseconds, or undefined if no cooldown has been set.
	 */

	public getCooldown(commandName: string) {
		const res = this.commandCooldownData.get(commandName);
		return res;
	}
}
