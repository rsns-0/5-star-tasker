import { languageRepository } from '../models/languageRepository';

describe('Language Abbreviation Queries', () => {
	it('should return a truthy value when searched by country name (optimized)', async () => {
		const res = await languageRepository.getLanguageAbbreviation('Germany', 'byCountryNameOptimized');
		expect(res).toBeTruthy();
	});

	it('should return a truthy value when searched by country name', async () => {
		const res = await languageRepository.getLanguageAbbreviation('Germany', 'byCountryName');
		expect(res).toBeTruthy();
	});

	it('should return a truthy value when searched by language name', async () => {
		const res = await languageRepository.getLanguageAbbreviation('spanish', 'byName');
		expect(res).toBeTruthy();
	});

	it('should return a truthy value when searched by abbreviation', async () => {
		const res = await languageRepository.getLanguageAbbreviation('DE', 'byAbbreviation');
		expect(res).toBeTruthy();
	});

	it('should return a truthy value when searched by emoji', async () => {
		const res = await languageRepository.getLanguageAbbreviation('🇩🇪', 'byEmoji');
		expect(res).toBeTruthy();
	});
});

describe('Language Abbreviation Queries (Case Insensitive)', () => {
	it('should return a truthy value when searched by country name (optimized)', async () => {
		const res = await languageRepository.getLanguageAbbreviation('GeRmAnY', 'byCountryNameOptimized');
		expect(res).toBeTruthy();
	});

	it('should return a truthy value when searched by country name', async () => {
		const res = await languageRepository.getLanguageAbbreviation('gErMaNy', 'byCountryName');
		expect(res).toBeTruthy();
	});

	it('should return a truthy value when searched by language name', async () => {
		const res = await languageRepository.getLanguageAbbreviation('SpAnIsH', 'byName');
		expect(res).toBeTruthy();
	});

	it('should return a truthy value when searched by abbreviation', async () => {
		const res = await languageRepository.getLanguageAbbreviation('De', 'byAbbreviation');
		expect(res).toBeTruthy();
	});

	it('should return a truthy value when searched by emoji', async () => {
		const res = await languageRepository.getLanguageAbbreviation('🇩🇪', 'byEmoji');
		expect(res).toBeTruthy();
	});
});
