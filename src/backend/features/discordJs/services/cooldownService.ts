import { CommandCooldownRepository } from "../models/cooldowns/commandCooldownRepository";
import { CooldownEventRepository } from "../models/cooldowns/cooldownEventRepository";
import { assertExists } from "@/utils/assertExists";
import { logger } from "@/backend/logger/logger";

export class CooldownService {
	private commandCooldownRepository: CommandCooldownRepository = new CommandCooldownRepository();
	private cooldownEventRepository: CooldownEventRepository = new CooldownEventRepository();
	private logger = logger;
	

	public registerCommandCooldown(commandName: string, cooldown: number) {
		this.commandCooldownRepository.registerCooldown(commandName, cooldown);
	}

	/**
	 * Checks if the user is on cooldown for the given command.
	 * @param userId
	 * @param commandName
	 * @returns
	 */
	public checkUserOnCooldownForCommand(userId: string, commandName: string) {
		const cooldownEvent = this.cooldownEventRepository.getCooldownEvent(userId, commandName);
		const commandCooldown = this.commandCooldownRepository.getCooldown(commandName);
		assertExists(
			commandCooldown,
			`Assertion error: No cooldown found for command ${commandName}`
		);
		if (!cooldownEvent) {
			this.createCooldownEvent(userId, commandName, commandCooldown)
			return false;
		}
		if (cooldownEvent.isExpired()) {
			this.logger.info(`Cooldown for user ${userId} for command ${commandName} expired`);
            this.cooldownEventRepository.deleteCooldown(userId, commandName)
			return false;
		}
		this.logger.info(`Cooldown for user ${userId} for command ${commandName} is still active`);
		return true;
	}

	private createCooldownEvent(userId: string, commandName: string, commandCooldown: number) {
		const expireTime = Date.now() + commandCooldown;
		this.cooldownEventRepository.registerCooldown(userId, commandName, expireTime);
		this.logger.info(
			`Registered cooldown for user ${userId} for command ${commandName} with expire time ${expireTime}`
		);
		
	}
}
