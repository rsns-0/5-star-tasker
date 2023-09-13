import { PaginatedMessageAction } from "@sapphire/discord.js-utilities";

export const builtInSapphireDefaultActions: PaginatedMessageAction[] = [
	{
		customId: "@sapphire/paginated-messages.goToPage",
		type: 3,
		options: [],
		run: ({ handler, interaction }) =>
			interaction.isStringSelectMenu() &&
			(handler.index = parseInt(interaction.values[0], 10)),
	},
	{
		customId: "@sapphire/paginated-messages.firstPage",
		style: 1,
		emoji: "⏪",
		type: 2,
		run: ({ handler }) => (handler.index = 0),
	},
	{
		customId: "@sapphire/paginated-messages.previousPage",
		style: 1,
		emoji: "◀️",
		type: 2,
		run: ({ handler }) => {
			if (handler.index === 0) {
				handler.index = handler.pages.length - 1;
			} else {
				--handler.index;
			}
		},
	},
	{
		customId: "@sapphire/paginated-messages.nextPage",
		style: 1,
		emoji: "▶️",
		type: 2,
		run: ({ handler }) => {
			if (handler.index === handler.pages.length - 1) {
				handler.index = 0;
			} else {
				++handler.index;
			}
		},
	},
	{
		customId: "@sapphire/paginated-messages.goToLastPage",
		style: 1,
		emoji: "⏩",
		type: 2,
		run: ({ handler }) => (handler.index = handler.pages.length - 1),
	},
	{
		customId: "@sapphire/paginated-messages.stop",
		style: 4,
		emoji: "⏹️",
		type: 2,
		run: ({ collector }) => {
			collector.stop();
		},
	},
];
