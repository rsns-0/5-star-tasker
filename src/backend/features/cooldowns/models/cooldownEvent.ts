/**
 * CooldownEvent is a class that represents a cooldown event.
 *
 * It provides methods to check if the cooldown has expired and to get the time remaining on the cooldown.
 */
export class CooldownEvent {
	/**
	 * Creates an instance of CooldownEvent.
	 *
	 * @param expireTime - The time (in milliseconds) when the cooldown expires.
	 */
	constructor(private readonly expireTime: number) {}

	/**
	 * Checks if the cooldown has expired.
	 *
	 * @returns true if the cooldown has expired, false otherwise.
	 */
	public isExpired() {
		return this.expireTime <= Date.now();
	}

	/**
	 * Gets the time remaining on the cooldown.
	 *
	 * @returns The time remaining in seconds. If the cooldown has expired, returns 0.
	 */
	public timeRemaining() {
		const timeRemaining = this.expireTime - Date.now();
		return timeRemaining < 0 ? 0 : timeRemaining / 1000;
	}
}

/**
 * UserCommandCooldownEvent is a class that extends CooldownEvent to include user and command information.
 */
export class UserCommandCooldownEvent extends CooldownEvent {
	/**
	 * Creates an instance of UserCommandCooldownEvent.
	 *
	 * @param userId - The ID of the user.
	 * @param commandName - The name of the command.
	 * @param expireTime - The time (in milliseconds) when the cooldown expires.
	 */
	constructor(
		public readonly userId: string,
		public readonly commandName: string,
		expireTime: number
	) {
		super(expireTime);
	}
}
