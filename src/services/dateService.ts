import { SupportedDateTypes, type USStringDateTime } from "./../types/types"

import { DateTime } from "luxon"

type AcceptableDateInputs = SupportedDateTypes | null | undefined

/** Utility class for handling date conversions. */
class DateConverterService {
	constructor(public impl: typeof DateTime) {}

	public convertDate(date: AcceptableDateInputs) {
		const res = this.resolveInput(date)
		return res
	}

	/** Formats the date as MM/DD/YYYY hh:mm A by default */
	public formatDate(date: AcceptableDateInputs) {
		const res = this.resolveInput(date)
		return res.toFormat("MM/dd/yyyy hh:mm a" as const) as USStringDateTime
	}

	public resolveDateType(input: SupportedDateTypes): DateTime
	public resolveDateType(input: SupportedDateTypes, to: "js"): Date
	public resolveDateType(input: SupportedDateTypes, to: "luxon"): DateTime
	public resolveDateType(
		input: SupportedDateTypes,
		to: "js" | "luxon" = "luxon"
	): DateTime | Date {
		if (input instanceof Date) {
			return to === "js" ? input : DateTime.fromJSDate(input)
		}
		return input
	}

	private resolveInput(input: AcceptableDateInputs) {
		if (!input) {
			return this.impl.now()
		}
		return this.resolveDateType(input, "luxon")
	}
}

export const dateConverter = new DateConverterService(DateTime)
