import { PaginatedMessageAction } from "@sapphire/discord.js-utilities";

export interface ReminderComponentData {
	id: bigint;
	button: PaginatedMessageAction;
	message: string;
	time: Date;
}
export type FromRemindersOptions = {
	pageSize: number;
};
