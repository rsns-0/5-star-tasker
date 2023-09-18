import { ButtonStyle, ComponentType } from "discord.js"

type PageButtonConstructor = {
	style: ButtonStyle
	label: string
	run: Function
	customId: string
}

export class PageButton {
	public readonly style
	public readonly label
	public readonly customId
	public run
	public type = ComponentType.Button
	constructor({ style = ButtonStyle.Primary, label, run, customId }: PageButtonConstructor) {
		this.style = style
		this.label = label
		this.customId = customId
		this.run = run
	}
}
