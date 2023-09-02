import nextJest from "next/jest.js";

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
	// Add more setup options before each test is run
	// setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

	moduleNameMapper: {
		"@/*$": ["./src/**$1"],
	},
	moduleFileExtensions: ["js", "json", "ts"],
	rootDir: "./",
	testRegex: ".*\\.test\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	collectCoverageFrom: ["**/*.(t|j)s"],
	moduleDirectories: ["node_modules", "<rootDir>/"],
	coverageDirectory: "../coverage",
	testEnvironment: "node",
};

export default createJestConfig(config);
