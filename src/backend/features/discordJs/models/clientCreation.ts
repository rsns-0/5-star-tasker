import { Client, IntentsBitField, Partials } from "discord.js";
import ReadyClient from "./client";
import { Collection } from "discord.js";


const intents = new IntentsBitField();
intents.add(
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
);


const partials = [
    Partials.Message,   
    Partials.Channel,
    Partials.Reaction,
    Partials.User
];


const client = new Client({ 
    intents: intents,
    partials: partials
}) as ReadyClient;


client.commands = new Collection();


export default client;