
export function isKeyOf<T extends Object>(key: string | number | symbol, obj: T): key is keyof T {
	return key in obj;
}
