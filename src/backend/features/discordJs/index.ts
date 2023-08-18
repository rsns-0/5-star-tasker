import { Client, CommandInteraction, Events, GatewayIntentBits, SlashCommandBuilder } from "discord.js";

import { Collection } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

type RealizedClient = Client & {
	commands: Collection<string, Command>;
};

type Command = {
	data: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
};

type MaybeCommand = Partial<Command>;

const token = process.env.DISCORD_TOKEN;
if (!token) {
	throw new Error("Missing discord token");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as Client & {
	commands: Collection<string, Command>;
};
client.commands = new Collection();

client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);

function getCommandPathAndFiles() {
	const commandsPath = path.join(__dirname, "commands");
	const commandFileNames = fs.readdirSync(commandsPath).filter((file) => {
		return file.endsWith(".ts") || file.endsWith(".js");
	});
	return {
		commandsPath,
		commandFileNames,
	};
}

function getCommandsFromFiles() {
	const { commandsPath, commandFileNames } = getCommandPathAndFiles();
	return commandFileNames.map(async (commandFileName) => {
		const filePath = path.join(commandsPath, commandFileName);
		const { data, execute }: MaybeCommand = await import(filePath);
		if (!data || !execute) {
			throw new Error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
		const res: Command = { data, execute };
		return res;
	});
}

function registerCommandsToClient(client: RealizedClient) {
	const { commandsPath, commandFileNames: commandFiles } = getCommandPathAndFiles();
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		import(filePath).then(({ data, execute }: MaybeCommand) => {
			// Destructure the imported module
			if (data && execute) {
				client.commands.set(data.name, { data, execute });
			} else {
				throw new Error(
					`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
				);
			}
		});
	}
}

registerCommandsToClient(client);

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const client = interaction.client as RealizedClient;
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
});

class CommandClass {
	data: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
	constructor(data: SlashCommandBuilder, execute: (interaction: CommandInteraction) => Promise<void>) {
		this.data = data;
		this.execute = execute;
	}
}

type FormItem = {
    label: string
    style: string
    placeholder: string
    required: boolean
}


type FormData = {
    label: string
    value: string
}

type EmbedConstructor = {
    title:string
    description:string
    color: string
    timestamp: Date
}

class Embed{
    title: string
    description: string
    color: string
    timestamp: Date
    private imageUrl: string = ""
    constructor({title, description, color, timestamp}:EmbedConstructor){
        this.title = title
        this.description = description
        this.color = color
        this.timestamp = timestamp
    }
    setImage(url:string){
        this.imageUrl = url
    }
}

class Message{

    
}

class EmbeddingService{


    public static sendEmbed(embed:Embed){
        // something
        return 
    }    
}

class ExplanationModal{
    children: FormData[] = []
    formItems: FormItem[] = []
    

    constructor(){
        this.addItem({
            label: "title",
            placeholder: "enter title here..",
            required: true,
            style: "regular"
        })
        this.addItem({
            label: "description",
            placeholder: "enter description here...",
            required: false,
            style: "regular"
        })
    }

    private addItem(item: FormItem){
        this.formItems.push(item)
    }

    private onUserSubmit(jsonData:Record<string,string>[], interaction:any){
        for (const jsonItem of jsonData){
            const formDataObj:FormData = {
                label:jsonItem.label,
                value:jsonItem.value
            }
            this.children.push(formDataObj)
        }
        this.callback(interaction)
    }

    public async callback(interaction:any){
        const dayObj = new Date(Date.now())
        const embed = new Embed({
            title: this.getItemByLabel("title").value,
            description: this.getItemByLabel("description").value,
            color: "test",
            timestamp: dayObj
        })
        
        
        // rest of impl
    }

    public getItemByLabel(label:string){
        return this.children.filter(child => child.label === label)[0]
    }
    
}

