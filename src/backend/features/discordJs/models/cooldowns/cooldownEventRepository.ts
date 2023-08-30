import { Collection } from "discord.js";
import { UserCommandCooldownEvent } from "./cooldownEvent";
import { logger as _logger } from "@/backend/logger/logger";

export class CooldownEventRepository {
    
	private userCooldownData: Collection<string, UserCommandCooldownEvent> = new Collection();
    private cleanupInterval = 6*3600*1000
    private intervalRef:NodeJS.Timeout

    constructor(private logger = _logger){
        
        const intervalRef = this.startCleanupInterval(this.cleanupInterval)
        this.intervalRef = intervalRef
    }

	public registerCooldown(userId: string, commandName: string, expireTime: number) {
		const cooldownEvent = new UserCommandCooldownEvent(userId, commandName, expireTime);
		const eventId = createKey(userId, commandName);
		this.userCooldownData.set(eventId, cooldownEvent);
	}

    public deleteCooldown(userId:string, commandName:string){
        const eventId = createKey(userId, commandName)
        this.userCooldownData.delete(eventId)
    }

	public cleanupExpiredCooldowns() {
		for (const [eventId, cooldownEvent] of this.userCooldownData) {
			if (cooldownEvent.isExpired()) {
				this.userCooldownData.delete(eventId);
			}
		}
	}

	private startCleanupInterval(interval: number) {
		const intervalRef = setInterval(() => this.cleanupExpiredCooldowns(), this.cleanupInterval);
        this.logger.info(`Started cooldown cleanup interval with id ${intervalRef} and interval ${interval}`)
        return intervalRef
	}

    public getCooldownEvent(userId:string, commandName:string){
        const eventId = createKey(userId, commandName)
        return this.userCooldownData.get(eventId)
    }
}

function createKey(userId:string, commandName:string){
    return `${userId}-${commandName}`
}