import * as testCmd from "../commands/testcmd";

import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { afterEach, beforeEach } from "node:test";
import { beforeAll, describe, expect, it, vi as jest } from "vitest";
import {
	partiallyInitializeClient,
	registerCommandsToClient,
	registerEventsToClient,
} from "../init/initClient";

import ReadyClient from "../models/client";
import { assertExists } from "@/utils/assertExists";
import { cooldownServiceInstanceForDiscordJs } from "../services/cooldownServiceInstance";

describe("Integration with cooldown service", async () => {
	let client:ReadyClient

	beforeAll(async () => {
		client = partiallyInitializeClient();
		
		await registerCommandsToClient(client);
		await registerEventsToClient(client);
	})
	

	it("test commmand should be present in cooldown service after initializing discordjs client", async () => {
		
		const command = client.commands.get("embed");
		

		assertExists(command, "doesn't exist");
		const { name } = command.data;
		const res = await cooldownServiceInstanceForDiscordJs.getCommandCooldown(name);
		expect(res).toBeDefined();
	});

	it("With a cooldown of 10 seconds, the test command should reply with the failure case (cooldown has not yet expired) until more than 10 seconds have elapsed, at which point the command should enter the success case.", async () => {
		jest.useFakeTimers();
		const mockInteraction = {
			user: { id: "123" },
			options: {
				getString: jest.fn((key) => (key === "title" ? "Test Title" : "Test Description")),
			},
			reply: jest.fn(),
		};

		const { execute } = testCmd;

		await execute(mockInteraction as any);

		// Check if .reply was called
		expect(mockInteraction.reply).toHaveBeenCalled();
		await execute(mockInteraction as any);
		const res = mockInteraction.reply.mock.calls[1][0].content as string;
		const num = res.split(" ")[5];

		expect(parseInt(num)).toBeGreaterThan(0);
		jest.advanceTimersByTime(5000);
		await execute(mockInteraction as any);
		const res2 = mockInteraction.reply.mock.calls[2][0].content as string;
		const num2 = res2.split(" ")[5];
		expect(parseInt(num2)).toBeGreaterThan(0);

		jest.advanceTimersByTime(5000);
		await execute(mockInteraction as any);
		const res3 = mockInteraction.reply.mock.calls[3][0] as Object;
		expect(res3).toHaveProperty("content");
	});
});

