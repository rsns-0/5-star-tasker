import { CategoryChannel, GuildBasedChannel } from 'discord.js';
import { PrivateThreadChannel, PublicThreadChannel } from 'discord.js';

export type ThreadChannel = PrivateThreadChannel | PublicThreadChannel;
export type WebhookChannel = Exclude<GuildBasedChannel, ThreadChannel | CategoryChannel>;
