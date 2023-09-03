import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
	description: 'A basic slash command'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder //
					.setName(this.name)
					.setDescription(this.description),
			{ idHints: ['1147812199616745522'] }
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		return interaction.reply({ content: 'Hello world!' });
	}
}
