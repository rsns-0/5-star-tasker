import {
	CategoryChannel,
	GuildBasedChannel,
	PrivateThreadChannel,
	PublicThreadChannel,
} from "discord.js";

export type ThreadChannel = PrivateThreadChannel | PublicThreadChannel;
export type WebhookChannel = Exclude<GuildBasedChannel, ThreadChannel | CategoryChannel>;
