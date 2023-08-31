import { beforeEach, describe, expect, it, vi as jest } from "vitest";

import { CooldownService } from "../services/cooldownService";
import { _CommandCooldownRepository } from "../models/commandCooldownRepository";
import { _CooldownEventRepository } from "../models/cooldownEventRepository";
import { hoursToMilliseconds } from "date-fns";

describe("kitchen sink test", () => {
	it("see comments in test", () => {
		const commandName = "testcmd1";
		const userId = "testuser1";
		const cooldown = hoursToMilliseconds(1);
		jest.useFakeTimers();
		const cooldownService = new CooldownService();
		cooldownService.registerCommandCooldown(commandName, cooldown);

		// on the first call, the returned result should be a result not on cooldown.
		const cooldownResult = cooldownService.processUserCooldown(userId, commandName);
		expect(cooldownResult.isOnCooldown).toBe(false);

		const res = cooldownService.getUsersOnCooldownForCommand(commandName);
		expect(res.size).toBe(1);

		// on the second call, the returned result should be a result on cooldown
		const cooldownResult2 = cooldownService.processUserCooldown(userId, commandName);
		expect(cooldownResult2.isOnCooldown).toBe(true);

		// advance the timer by 15 minutes
		jest.advanceTimersByTime(15 * 60 * 1000);

		// on the third call, the returned result should be a result on cooldown
		const cooldownResult3 = cooldownService.processUserCooldown(userId, commandName);
		expect(cooldownResult3.isOnCooldown).toBe(true);

		// advance the timer by 50 minutes
		jest.advanceTimersByTime(50 * 60 * 1000);

		// on the fourth call, the returned result should be a result not on cooldown
		const cooldownResult4 = cooldownService.processUserCooldown(userId, commandName);
		expect(cooldownResult4.isOnCooldown).toBe(false);
	});
});

describe("CooldownService", () => {
	let cooldownService: CooldownService;
	let commandCooldownRepository: _CommandCooldownRepository;
	
	let commandName: string;
	let cooldown: number;

	beforeEach(() => {
		cooldownService = new CooldownService();
		commandCooldownRepository = cooldownService._commandCooldownRepository;
		
		commandName = "testCommand";
		cooldown = 5000;

		cooldownService.registerCommandCooldown(commandName, cooldown);
	});

	describe("registerCommandCooldown", () => {
		it("should register the cooldown for a command", () => {
			expect(commandCooldownRepository.getCooldown(commandName)).toBeDefined();
		});
	});

	describe("processUserCooldown", () => {
		it("should return CooldownResult.asExpired() if the user is not on cooldown", () => {
			const userId = "testUser";
			const result = cooldownService.processUserCooldown(userId, commandName);

			expect(result.isOnCooldown).toBe(false);
		});

		it("should return the remaining cooldown time in seconds if the user is on cooldown", () => {
			const userId = "testUser";

			jest.useFakeTimers();

			const result = cooldownService.processUserCooldown(userId, commandName);
			jest.advanceTimersByTime(1000);
			const result2 = cooldownService.processUserCooldown(userId, commandName);

			expect(result2.isOnCooldown).toBe(true);
		});
	});

	describe("getUsersOnCooldownForCommand", () => {
		it("should return the cooldown events for a command", () => {
			const userId = "testUser";

			const result = cooldownService.processUserCooldown(userId, commandName);
			const usersOnCooldown = cooldownService.getUsersOnCooldownForCommand(commandName);

			expect(usersOnCooldown.size).toBe(1);
		});
	});
});

describe("Cooldown service internal cooldown event repository", () => {
	it("Cleanup should remove all expired entries on an interval.", () => {
		jest.useFakeTimers();
		const cmdCooldownRepository = new _CommandCooldownRepository();
		const cooldownEventRepository = new _CooldownEventRepository(hoursToMilliseconds(1));
		const service = new CooldownService(cmdCooldownRepository, cooldownEventRepository);
		const { _cooldownEventRepository } = service;

		const userId = "testUser";
		const commandName = "testCommand";
		const cooldown = 5000;

		service.registerCommandCooldown(commandName, cooldown);
		service.processUserCooldown(userId, commandName);

		const result = service.processUserCooldown(userId, commandName);
		expect(result.isOnCooldown).toBe(true);

		const res = _cooldownEventRepository.getCooldownEvent(userId, commandName);
		expect(res).toBeDefined();
		jest.advanceTimersByTime(hoursToMilliseconds(2));
		const res2 = _cooldownEventRepository.getCooldownEvent(userId, commandName);
		expect(res2).toBeUndefined();
	});
});
