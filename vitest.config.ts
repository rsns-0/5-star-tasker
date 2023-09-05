import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		outputFile: { json: 'testLogs/testResults.json' },
		reporters: ['json', 'default']
	},
	resolve: {
		alias: {
			jest: 'vi'
		}
	}
});
