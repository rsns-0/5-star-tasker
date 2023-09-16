import { Collection } from "discord.js";
import { paginateArrays } from "../../utils/paginateArrays";

type FromArrayOptions = {
	limit: number;
	offset?: number;
};

export class PaginatedCollection<V> extends Collection<number, V> {
	private constructor() {
		super();
	}

	public static fromArray<TValue>(
		array: TValue[],
		{ limit, offset: offset = 0 }: FromArrayOptions
	) {
		const index = offset;
		const arrays = paginateArrays(array, limit);
		const collection = new this<TValue[]>();
		for (const item of arrays) {
			collection.set(index, item);
		}
		return collection;
	}
}
