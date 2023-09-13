import { Collection } from "discord.js";
import { UserCommandCooldownEvent } from "./cooldownEvent";

/**
 * !Not ready to be used as a public class yet. Used internally for
 * CooldownService. CooldownEventRepository is a class that manages the cooldown
 * events of users.
 *
 * It provides methods to set and delete cooldown events, cleanup expired
 * cooldowns, and get cooldown events for specific users or commands.
 */
export class _CooldownEventRepository {
	/**
	 * @property userCooldownData - A collection of UserCommandCooldownEvent
	 *   objects.
	 */
	private userCooldownData: Collection<string, UserCommandCooldownEvent> = new Collection();

	/** Creates an instance of CooldownEventRepository. */
	constructor() {}

	/**
	 * Sets a cooldown event for a user command. Automatically deletes the
	 * cooldown event when it expires.
	 *
	 * @param userId - The ID of the user.
	 * @param commandName - The name of the command.
	 * @param expireTime - The time (in milliseconds) when the cooldown expires.
	 */
	public setCooldown(userId: string, commandName: string, expireTime: number) {
		const cooldownEvent = new UserCommandCooldownEvent(userId, commandName, expireTime);

		const eventId = createKey(userId, commandName);
		this.userCooldownData.set(eventId, cooldownEvent);
		setTimeout(() => {
			this.userCooldownData.delete(eventId);
		}, cooldownEvent.timeRemaining());
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
