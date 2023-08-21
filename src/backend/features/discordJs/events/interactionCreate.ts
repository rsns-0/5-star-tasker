import {CommandInteraction, Events} from "discord.js"

import ReadyClient from "../models/client";

const name = Events.InteractionCreate;
const execute = async (interaction:CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;
    const client = interaction.client as ReadyClient
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
}

export { name, execute }