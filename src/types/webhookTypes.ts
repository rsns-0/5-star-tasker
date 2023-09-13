import { type Webhook } from "discord.js";

export type OwnedWebhook = Webhook & { token: string };
