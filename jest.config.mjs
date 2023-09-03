

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
config = {
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

export default config
