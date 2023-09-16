import { JsonValue } from "@prisma/client/runtime/library";

export class CustomId<const TData extends CustomIdData> {
	constructor(public readonly data: TData) {}

	public toString() {
		return JSON.stringify(this.data);
	}
}
export type CustomIdData = { [key: string]: JsonValue; type: string };
