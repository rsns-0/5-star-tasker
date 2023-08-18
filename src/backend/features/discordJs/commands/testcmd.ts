import { ChannelType, ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

// export const data = new SlashCommandBuilder()
// 	.setName('ping')
// 	.setDescription('Replies with Pong!')

// export async function execute(interaction: CommandInteraction) {
// 	await interaction.reply('Pong!');

// }


export const testCommand = new SlashCommandBuilder()
	.setName('embedCreator')
	.setDescription('Creates embed from user input.')
	.addStringOption(option =>
		option
			.setName('title')
			.setDescription("Set the title for the embed.")
			.setRequired(true)
			.setMinLength(1)
			.setMaxLength(256)
	)
	.addStringOption(option => 
		option
			.setName("description")
			.setDescription("Set the description for the embed.")
			.setRequired(false)
			.setMaxLength(2000)
	)
	.addChannelOption(option =>
		option
			.setName("channel")
			.setDescription("Select a channel to send the embed")
			.addChannelTypes(ChannelType.GuildText)
	)



export async function execute(interaction: ChatInputCommandInteraction) {

	
	const fields:Record<string,string> = {
		title:"",
		description:""
	}

	for(const key in fields){
		fields[key] = interaction.options.getString(key)!
	}

	const embed = embedExample(
		{
			title: fields['title'],
			description: fields['description'],
			color: "Blurple"
		}
	)
	
	
	const msg = await interaction.reply({
		content:"Success"
	})

	const emojiList = [
		"✅",
		"⛔"
	]
	// emojiList.forEach(emoji => {
	// 	msg.react(emoji)
	// })

	
}


type EmbedExampleArguments = {
	title: string,
	description: string,
	color:ColorResolvable
} // theres way more options, not gonna add

const embedExample = (embedOptions: EmbedExampleArguments) => {
	const embedExample = new EmbedBuilder()
		.setColor(embedOptions.color)
		.setTitle(`${embedOptions.title}`)
		.setDescription(`${embedOptions.description}`)
		.setImage("https://i.imgur/random.png")
	return embedExample
}	


class Examp{
	private _value:number = 0

	get value(){
		return this._value
	}
	set value(value:number){
		this._value = value
	}

	
}