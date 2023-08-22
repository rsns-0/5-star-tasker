import * as testCmd from "../commands/testcmd";

import { describe, expect, it, vi as jest } from "vitest";
import { registerCommandsToClient, registerEventsToClient } from "..";

import { MessageReaction } from "discord.js";
import { O } from "ts-toolbelt";
import { generateExecuteSpy } from "./testUtils/generateExecuteSpy";
import { initTestClient } from "./initScripts/initTestClient";

describe("init", async () => {
	const client = await initTestClient();

	it("registerCommandsToClient should register at least one command", async () => {
		await registerCommandsToClient(client);
		const numberOfCommands = client.commands.size;

		expect(numberOfCommands).toBeGreaterThan(0);
	});

	it("registerEventsToClient should register at least two events", async () => {
		await registerEventsToClient(client);

		const numberOfEvents = client.eventNames().length;

		expect(numberOfEvents).toBeGreaterThan(1);
		console.log(numberOfEvents);
	});
});

describe("testcmd", async () => {
	const client = await initTestClient();

	it("When reply on the event is called, it should receive an object whose content field is a string that contains both of the values in the store.", async () => {
		const executeSpy = jest.spyOn(testCmd, "execute");
		const store: Record<string, string> = {
			title: "testTitle1",
			description: "testDescription1",
		};

		const mockGetString = jest.fn((key) => store[key]);
		const mockReply = jest.fn((obj) => {
			const text = obj.content;
			for (const value of Object.values(store)) {
				expect(text).toContain(value);
			}
		});
		const mockMessage: any = {
			options: { getString: mockGetString },
			reply: mockReply,
		};
		await registerCommandsToClient(client);
		client.commands.get("embed")?.execute(mockMessage);
		expect(executeSpy).toHaveBeenCalledWith(mockMessage);
		expect(executeSpy).toHaveBeenCalledOnce();
	});
});

describe("Discord Emoji Service", () => {
	const emojiServiceRef: any = () => {};
	it.todo(
		"when translating from english to spanish, translation method or function should have been called at least once and contain 'hola mundo'",
		() => {
			const emojiSpy = generateExecuteSpy(emojiServiceRef);

			const mockReply = jest.fn(({ content }) => {
				const lower = (content as string).toLowerCase();
				expect(lower).toContain("hola mundo");
			});

			const mockReaction: O.Partial<MessageReaction, "deep"> = {
				emoji: {
					id: "testid1",
				},
				message: {
					reply: mockReply,
					content: "hello world",
				},
			};
			//@ts-ignore
			mockReaction.message?.reply(mockReaction.message?.content)

			emojiServiceRef.execute(mockReaction?.message?.content as any);
			expect(emojiSpy).toHaveBeenCalled();
		}
	);
});
