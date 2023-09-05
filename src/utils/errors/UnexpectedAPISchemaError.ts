export class UnexpectedAPISchemaError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'UnexpectedAPISchemaError';
	}
}
