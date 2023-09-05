import { CategoryChannel, GuildBasedChannel, PrivateThreadChannel, PublicThreadChannel } from 'discord.js';

import { ThreadChannel } from './types';

export type ValueOf<T> = T[keyof T];

export type PublicKeyOf<T> = Exclude<keyof T, `_${string}`>;
export type ThreadChannel = PrivateThreadChannel | PublicThreadChannel;
export type WebhookChannel = Exclude<GuildBasedChannel, ThreadChannel | CategoryChannel>;
