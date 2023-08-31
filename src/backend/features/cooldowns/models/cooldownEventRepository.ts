import { Collection } from "discord.js";
import { UserCommandCooldownEvent } from "./cooldownEvent";
import { logger as _logger } from "@/backend/logger/logger";

/**
 * !Not ready to be used as a public class yet. Used internally for CooldownService.
 * CooldownEventRepository is a class that manages the cooldown events of users.
 *
 * It provides methods to set and delete cooldown events, cleanup expired cooldowns,
 * and get cooldown events for specific users or commands.
 */
export class _CooldownEventRepository {
	/**
	 * @property userCooldownData - A collection of UserCommandCooldownEvent objects.
	 */
	private userCooldownData: Collection<string, UserCommandCooldownEvent> = new Collection();

	/**
	 * @property intervalRef - Reference to the interval used for cleaning up expired cooldowns.
	 */
	private intervalRef?: NodeJS.Timeout;

	/**
	 * Creates an instance of CooldownEventRepository.
	 *
	 * 
	 * @param logger - Logger used for logging information about the cleanup process. Default is _logger.
	 */
	constructor(
		
		private logger = _logger
	) {
		
		
	}

	/**
	 * Sets a cooldown event for a user command.
	 *
	 * @param userId - The ID of the user.
	 * @param commandName - The name of the command.
	 * @param expireTime - The time (in milliseconds) when the cooldown expires.
	 */
	public setCooldown(userId: string, commandName: string, expireTime: number) {
		const cooldownEvent = new UserCommandCooldownEvent(userId, commandName, expireTime);
		const eventId = createKey(userId, commandName);
		this.userCooldownData.set(eventId, cooldownEvent);
	}

	/**
	 * Deletes a cooldown event for a user command.
	 *
	 * @param userId - The ID of the user.
	 * @param commandName - The name of the command.
	 */
	public deleteCooldownEvent(userId: string, commandName: string) {
		const eventId = createKey(userId, commandName);
		this.userCooldownData.delete(eventId);
	}

	/**
	 * Cleans up expired cooldowns.
	 *
	 * @returns The number of cooldown events that were removed.
	 */
	public cleanupExpiredCooldowns() {
		return this.userCooldownData.sweep((val) => val.isExpired());
	}

	/**
	 * Starts an interval to clean up expired cooldowns.
	 *
	 * @param interval - The time interval (in milliseconds) at which expired cooldowns are cleaned up.
	 * @returns The reference to the interval.
	 */
	public setCleanupInterval(interval: number) {
		if(this.intervalRef){
			this.logger.info(`There is an existing interval with id ${this.intervalRef}. Clearing it before adding new cleanup interval.`)
			clearInterval(this.intervalRef);
		}
		const intervalRef = setInterval(() => this.cleanupExpiredCooldowns(), interval);
		this.logger.info(
			`Started cooldown cleanup interval with id ${intervalRef} and interval ${interval}`
		);
		this.intervalRef = intervalRef
		return intervalRef;
	}

	/**
	 * Stops the cleanup interval if it is running.
	 */
	public stopCleanupInterval(){
		if(this.intervalRef){
			this.logger.info(`Stopping cleanup interval with id ${this.intervalRef}`)
			clearInterval(this.intervalRef);
			return
		}
		this.logger.info(`No cleanup interval to stop.`)
	}

	/**
	 * Gets the cooldown event for a user command.
	 *
	 * @param userId - The ID of the user.
	 * @param commandName - The name of the command.
	 * @returns The UserCommandCooldownEvent object if it exists, or undefined.
	 */
	public getCooldownEvent(userId: string, commandName: string) {
		const eventId = createKey(userId, commandName);
		return this.userCooldownData.get(eventId);
	}

	/**
	 * Gets all cooldown events for a command.
	 *
	 * @param commandName - The name of the command.
	 * @returns A collection of UserCommandCooldownEvent objects.
	 */
	public getCooldownEventsForCommand(commandName: string) {
		return this.userCooldownData.filter((data) => data.commandName === commandName);
	}
}

/**
 * Creates a key for storing a cooldown event in the collection.
 *
 * @param userId - The ID of the user.
 * @param commandName - The name of the command.
 * @returns The key as a string.
 */
function createKey(userId: string, commandName: string) {
	return `${userId}-${commandName}`;
}
