export class User {
	constructor(
		public id: number,
		public username?: string,
		public role?: string
	) {}


    public toJsonString(): string {
        return JSON.stringify(this);
    }
}
