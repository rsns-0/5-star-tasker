export class EnvVarError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'APIKeyError';
	}
}
