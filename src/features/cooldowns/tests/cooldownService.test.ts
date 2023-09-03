import { CooldownService } from "../services/cooldownService";
import { _CommandCooldownRepository } from "../models/commandCooldownRepository";
import { _CooldownEventRepository } from "../models/cooldownEventRepository";
import { hoursToMilliseconds } from "date-fns";

describe("kitchen sink test", () => {
	it("see comments in test",async  () => {
		const commandName = "testcmd1";
		const userId = "testuser1";
		const cooldown = hoursToMilliseconds(1);
		vi.useFakeTimers();
		const cooldownService = new CooldownService();
		cooldownService.registerCommandCooldown(commandName, cooldown);

		// on the first call, the returned result should be a result not on cooldown.
		const cooldownResult = await cooldownService.processUserCooldown(userId, commandName);
		expect(cooldownResult.isOnCooldown).toBe(false);

		const res = await cooldownService.getUsersOnCooldownForCommand(commandName);
		expect(res.size).toBe(1);

		// on the second call, the returned result should be a result on cooldown
		const cooldownResult2 = await cooldownService.processUserCooldown(userId, commandName);
		expect(cooldownResult2.isOnCooldown).toBe(true);

		// advance the timer by 15 minutes
		vi.advanceTimersByTime(15 * 60 * 1000);

		// on the third call, the returned result should be a result on cooldown
		const cooldownResult3 = await  cooldownService.processUserCooldown(userId, commandName);
		expect(cooldownResult3.isOnCooldown).toBe(true);

		// advance the timer by 50 minutes
		vi.advanceTimersByTime(50 * 60 * 1000);

		// on the fourth call, the returned result should be a result not on cooldown
		const cooldownResult4 =await  cooldownService.processUserCooldown(userId, commandName);
		expect(cooldownResult4.isOnCooldown).toBe(false);
	});
});

describe("CooldownService", () => {
	let cooldownService: CooldownService;
	
	
	let commandName: string;
	let cooldown: number;

	beforeEach(() => {
		cooldownService = new CooldownService();
		commandName = "testCommand";
		cooldown = 5000;
		cooldownService.registerCommandCooldown(commandName, cooldown);
	});

	describe("registerCommandCooldown", () => {
		it("should register the cooldown for a command",async () => {
			expect(await cooldownService.getCommandCooldown(commandName)).toBeDefined();
		});
	});

	describe("processUserCooldown", () => {
		it("should return CooldownResult.asExpired() if the user is not on cooldown", async () => {
			const userId = "testUser";
			const result =await  cooldownService.processUserCooldown(userId, commandName);

			expect(result.isOnCooldown).toBe(false);
		});

		it("should return the remaining cooldown time in seconds if the user is on cooldown", async () => {
			const userId = "testUser";

			vi.useFakeTimers();

			await cooldownService.processUserCooldown(userId, commandName);
			vi.advanceTimersByTime(1000);
			const result2 =await  cooldownService.processUserCooldown(userId, commandName);

			expect(result2.isOnCooldown).toBe(true);
		});
	});

	describe("getUsersOnCooldownForCommand", () => {
		it("should return the cooldown events for a command", async () => {
			const userId = "testUser";

			await  cooldownService.processUserCooldown(userId, commandName);
			const usersOnCooldown = await cooldownService.getUsersOnCooldownForCommand(commandName);

			expect(usersOnCooldown.size).toBe(1);
		});
	});
});

