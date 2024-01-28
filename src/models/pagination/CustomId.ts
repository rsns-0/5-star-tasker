import { JsonValue } from "@prisma/client/runtime/library";



export type CustomId = { [key: string]: JsonValue; type: string }

export function createCustomIdString<TData extends CustomId>(data: TData) {
	return JSON.stringify(data)
}
