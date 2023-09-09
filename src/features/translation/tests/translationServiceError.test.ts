import { ZodError, z } from 'zod';

import { AxiosError } from 'axios';
import { TranslationServiceErrorFactory } from '../models/translationServiceError';

describe('TranslationServiceError', () => {
	const axiosStatusCode = '418';

	const zodSchema = z.object({
		id: z.number().int().positive(),
		email: z.string().email()
	});

	const zodIssueContainer = zodSchema.safeParse({ id: -5, email: 'invalid' });
	if (zodIssueContainer.success) {
		throw new Error('Unexpected success');
	}
	const issues = zodIssueContainer.error.issues;
	const axiosErr = TranslationServiceErrorFactory.fromError(new AxiosError('test', axiosStatusCode));
	const zodErr = TranslationServiceErrorFactory.fromError(new ZodError(issues));

	// setup ^^^

	it('Should correctly unwrap errors', () => {
		expect(axiosErr.isNetworkError()).toBe(true);
		expect(zodErr.isValidationError()).toBe(true);
	});

	it('axiosErr should have status code', () => {
		if (!axiosErr.isNetworkError()) {
			throw new Error('failed check to be network error');
		}
		const res = axiosErr.statusCode;
		expect(res).toBe(axiosStatusCode);
	});

	it('zodErr should exist', () => {
		if (!zodErr.isValidationError()) {
			throw new Error('failed check to be validation error');
		}

		expect(zodErr.friendlyErrorMessage).toBeTruthy();
	});
});
