import Decimal from "decimal.js";
import { _CommandCooldownRepository } from "../models/commandCooldownRepository";
import { _CooldownEventRepository } from "../models/cooldownEventRepository";
import { assertExists } from "@/utils/assertExists";
import { createLogTimeMessage } from "@/utils/logTime";
import { logger } from "@/backend/logger/logger";

/**
 * CooldownService is a class that manages command cooldowns.
 *
 * It provides methods to register and process user command cooldowns, and to get users currently on cooldown for a specific command.
 */
export class CooldownService {
	private logger = logger;
	_commandCooldownRepository: _CommandCooldownRepository;
	_cooldownEventRepository: _CooldownEventRepository;

	/**
     * Constructor for CooldownService.
     *
     * @param commandCooldownRepository - An instance of _CommandCooldownRepository (defaults to a new instance).
     * @param cooldownEventRepository - An instance of _CooldownEventRepository (defaults to a new instance).
     */
	constructor(
		commandCooldownRepository = new _CommandCooldownRepository(),
		cooldownEventRepository = new _CooldownEventRepository()
	) {
		this._commandCooldownRepository = commandCooldownRepository;
		this._cooldownEventRepository = cooldownEventRepository;
	}

	/**
	 * Gets the cooldown time for a command.
	 * @param commandName - The name of the command.
	 * @returns The cooldown time for the command in milliseconds.
	 */
	public async getCommandCooldown(commandName:string){
		const commandCooldown = this._commandCooldownRepository.getCooldown(commandName);
		return commandCooldown
	}

	/**
     * Registers a command with a specified cooldown time.
     *
     * @param commandName - The name of the command to register.
     * @param cooldown - The cooldown time for the command in milliseconds.
     */
	public async registerCommandCooldown(commandName: string, cooldown?: number) {
		
		this._commandCooldownRepository.registerCooldown(commandName, cooldown);
	}

	/**
     * Processes a user's cooldown for a given command. If the user is not on cooldown, a new cooldown event is registered for them.
     *
     * @param userId - The ID of the user.
     * @param commandName - The name of the command.
     * @returns A CooldownResult representing the user's cooldown state.
     */
	public async processUserCooldown(userId: string, commandName: string) {
		const cooldownEvent = this._cooldownEventRepository.getCooldownEvent(userId, commandName);
		const commandCooldown = this._commandCooldownRepository.getCooldown(commandName);
		assertExists(
			commandCooldown,
			`Assertion error: No cooldown found for command ${commandName}`
		);
		
		if (!cooldownEvent || cooldownEvent.isExpired()) {
			this.logger.info(
				`Cooldown not found or has expired for user ${userId} for command ${commandName}`
			);
			
			this.registerCooldownEvent(userId, commandName, commandCooldown);
			return CooldownResult.asExpired();
		}

		const r = cooldownEvent.timeRemaining()
		this.logger.info(`Cooldown for user ${userId} for command ${commandName} is still active`);
		return CooldownResult.milliecondsToSeconds(cooldownEvent.timeRemaining());
	}

	/**
     * Gets all users currently on cooldown for a specific command.
     *
     * @param commandName - The name of the command.
     * @returns An array of cooldown events for the specified command.
     */
	public async getUsersOnCooldownForCommand(commandName: string) {
		const cooldownEvents =
			this._cooldownEventRepository.getCooldownEventsForCommand(commandName);
		return cooldownEvents;
	}

	/**
     * Registers a cooldown event for a user.
     *
     * @param userId - The ID of the user.
     * @param commandName - The name of the command.
     * @param commandCooldown - The cooldown time for the command in milliseconds.
     */
	private registerCooldownEvent(userId: string, commandName: string, commandCooldown: number) {
		const expireTime = Date.now() + commandCooldown;
		this._cooldownEventRepository.setCooldown(userId, commandName, expireTime);
		const msg = createLogTimeMessage(expireTime)
		this.logger.info(`Registered cooldown event for command ${commandName} for user ${userId} which is set to expire at ${msg}`);
	}
}

/**
 * CooldownResult is a generic class that represents the result of a cooldown check.
 *
 * It provides static methods to create instances representing different states and units of time.
 */
export class CooldownResult<TUnit extends "milliseconds" | "seconds", TOnCooldown extends boolean, TNumber extends number |Decimal> {
	/**
	 * Creates an instance of CooldownResult in milliseconds.
	 *
	 * @param milliseconds - The time remaining on the cooldown in milliseconds.
	 * @returns An instance of CooldownResult with the provided time and unit set to "milliseconds".
	 */
	public static asMilliseconds(milliseconds: number) {
		return new CooldownResult(true, milliseconds, "milliseconds");
	}
	/**
	 * Converts milliseconds to seconds and creates an instance of CooldownResult.
	 *
	 * @param milliseconds - The time remaining on the cooldown in milliseconds.
	 * @returns An instance of CooldownResult with the provided time converted to seconds and unit set to "seconds".
	 */
	public static milliecondsToSeconds(milliseconds: number) {
		
		return new CooldownResult(true, new Decimal(milliseconds / 1000).toDecimalPlaces(3), "seconds");
	}
	/**
	 * Creates an instance of CooldownResult representing an expired cooldown.
	 *
	 * @returns An instance of CooldownResult with isOnCooldown set to false, timeRemaining set to 0, and unit set to "seconds".
	 */
	public static asExpired() {
		return new CooldownResult(false, 0, "milliseconds");
	}
	/**
	 * Private constructor for CooldownResult. Use the public static methods to create instances.
	 *
	 * @param isOnCooldown - Whether the cooldown is active.
	 * @param timeRemaining - The time remaining on the cooldown.
	 * @param unit - The unit of time for the remaining time (either "milliseconds" or "seconds").
	 */
	private constructor(
		public readonly isOnCooldown: TOnCooldown,
		public readonly timeRemaining: TNumber,
		public readonly unit: TUnit
	) {}
}

export const cooldownServiceInstanceForDiscordJs = new CooldownService();
