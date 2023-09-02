import * as testCmd from "../commands/testcmd";

import ReadyClient from "../models/client";
import { initTestClient } from "./initScripts/initTestClient";
import { registerCommandsToClient } from "../init/initClient";
import { registerEventsToClient } from "../init/initClient";

describe("init", () => {
	let client: ReadyClient;

	beforeEach(async () => {
		client = await initTestClient();
	});

	it("registerCommandsToClient should register at least one command", async () => {
		await registerCommandsToClient(client);
		const numberOfCommands = client.commands.size;

		expect(numberOfCommands).toBeGreaterThan(0);
	});

	it("registerEventsToClient should register at least two events", async () => {
		await registerEventsToClient(client);

		const numberOfEvents = client.eventNames().length;

		expect(numberOfEvents).toBeGreaterThan(1);
	});
});

describe("testcmd", () => {
	let client: ReadyClient;

	beforeEach( () => {
		client = initTestClient();
	});

	it("When reply on the event is called, it should receive an object whose content field is a string that contains both of the values in the store.", async () => {
		const store: Record<string, string> = {
			title: "testTitle1",
			description: "testDescription1",
		};

		const mockGetString = jest.fn((key) => store[key]);
		const mockReply = jest.fn((obj) => {
			const text = obj.content;
			console.log(text);
			for (const value of Object.values(store)) {
				expect(text).toContain(value);
			}
		});
		const mockMessage: any = {
			user: {
				id: "testid1",
			},
			options: { getString: mockGetString },
			reply: mockReply,
		};
		mockReply.mockImplementationOnce(() => {
			console.log("Replaced impl once.");
		});

		await registerCommandsToClient(client);
		const cmd = client.commands.get(testCmd.data.name)!;
		const executeSpy = jest.spyOn(cmd, "execute");
		cmd.execute(mockMessage);
		expect(executeSpy).toHaveBeenCalled();
		expect(executeSpy).toHaveBeenCalledWith(mockMessage);
	});

	it("When reply on the event is called, it should receive an object whose content field is a string that contains both of the values in the store.", async () => {
		const store: Record<string, string> = {
			title: "testTitle1",
			description: "testDescription1",
		};

		const mockGetString = jest.fn((key) => store[key]);
		const mockReply = jest.fn((obj) => {
			const text = obj.content;
			console.log(text);
			for (const value of Object.values(store)) {
				expect(text).toContain(value);
			}
		});
		const mockMessage: any = {
			user: {
				id: "testid1",
			},
			options: { getString: mockGetString },
			reply: mockReply,
		};
		mockReply.mockImplementationOnce(() => {
			console.log("Replaced impl once.");
		});

		await registerCommandsToClient(client);
		const cmd = client.commands.get(testCmd.data.name)!;
		const executeSpy = jest.spyOn(cmd, "execute");
		cmd.execute(mockMessage);
		expect(executeSpy).toHaveBeenCalled();
		expect(executeSpy).toHaveBeenCalledWith(mockMessage);
	});
});
