import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";
import {CommandInteraction, Events} from "discord.js"



@ApplyOptions<Listener.Options>({ event: Events.InteractionCreate })
export class UserEvent extends Listener {
	public override async run(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        const commandStore = this.container.stores.get("commands")
        const command = commandStore.get(interaction.commandName);
    
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        if(!command.chatInputRun){
            console.error(`No messageRun function found for ${interaction.commandName}.`);
            return;
        }

        
    
        try {
            await command.chatInputRun(interaction, {commandId: interaction.commandName, commandName: interaction.commandName});
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
    }