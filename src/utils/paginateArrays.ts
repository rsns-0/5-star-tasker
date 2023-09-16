export function paginateArrays<T>(array: T[], limit: number): T[][] {
	const results: T[][] = [];
	for (let i = 0; i < array.length; i += limit) {
		const chunk = array.slice(i, i + limit);
		results.push(chunk);
	}
	return results;
}
