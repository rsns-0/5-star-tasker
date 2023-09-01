import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { describe, expect, it, vi as jest } from "vitest";

import { cooldownServiceInstanceForDiscordJs } from "../services/cooldownServiceInstance";

/**
 *
 * Export a variable named cooldown with the cooldown in milliseconds to use it.
 */
const exampleCmdFile = () => {
	const name = "testcmd123"; // move name into a separate variable to reuse in the execute function and in setName
	const data = new SlashCommandBuilder() // export
		.setName(name)
		.setDescription("Creates embed from user")
		.addStringOption((option) =>
			option
				.setName("title")
				.setDescription("Set the title for the embed.")
				.setRequired(true)
				.setMinLength(1)
				.setMaxLength(256)
		)
		.addStringOption((option) =>
			option
				.setName("description")
				.setDescription("Set the description for the embed.")
				.setRequired(false)
				.setMaxLength(2000)
		);
	const cooldown = 10000; // export
	// export execute too
	const execute = async (interaction: ChatInputCommandInteraction) => {
		// pass in user's id and the command name to the cooldown service
		const result = await cooldownServiceInstanceForDiscordJs.processUserCooldown(
			interaction.user.id,
			name
		);
		if (result.isOnCooldown) {
			interaction.reply({
				content: `COOLDOWN ${result.timeRemaining.toString()} ${result.unit}.`,
			});
			return result; // normally you don't return this
		}
		// with generic types this allows powerful enough type checking to determine that the timeRemaining is exactly 0
		const { timeRemaining } = result;

		const resultOfSomeReallyExpensiveOperationYouWantCooldownsOn = (() => {
			// for example multiple api calls or large dataset processing
			return true;
		})();

		interaction.reply({
			content: `This is the result: ${resultOfSomeReallyExpensiveOperationYouWantCooldownsOn}. The time remaining was ${timeRemaining}`,
		});
		return result; // normally you don't return this
	};
	return { execute, data, cooldown }; // this is normally an export
};

describe("Integration Example", () => {
	it("Example with test cmd", async () => {
		// setup
		jest.useFakeTimers();
		const { execute, cooldown, data } = exampleCmdFile();
		await cooldownServiceInstanceForDiscordJs.registerCommandCooldown(data.name, cooldown);
		const mockInteraction = {
			user: { id: "123" },
			options: {
				getString: jest.fn((key) => (key === "title" ? "Test Title" : "Test Description")),
			},
			reply: jest.fn((res) => {
				console.log("RESULT OF REPLY: " + res.content);
			}),
		};

		const res = await execute(mockInteraction as any);
		expect(res.isOnCooldown).toBe(false);
		const res2 = await execute(mockInteraction as any);
		expect(res2.isOnCooldown).toBe(true);

		jest.advanceTimersByTime(1500);
		const res2_5 = await execute(mockInteraction as any);
		if (res2_5.timeRemaining === 0 || res2.timeRemaining === 0) {
			throw new Error("Unexpected result");
		}
		expect(res2_5.isOnCooldown).toBe(true);
		expect(res2_5.timeRemaining.toNumber()).toBeLessThan(res2.timeRemaining.toNumber());

		jest.advanceTimersByTime(cooldown + 1000);
		const res3 = await execute(mockInteraction as any);
		expect(res3.isOnCooldown).toBe(false);
	});
});
