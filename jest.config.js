// jest.config.js
const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["<rootDir>/e2e"],
  testMatch: ["**/tests/*.[jt]s?(x)"],
  moduleNameMapper: {
    "^app/(.*)$": "<rootDir>/app/$1",
    "^components/(.*)$": "<rootDir>/components/$1",
    "^lib/(.*)$": "<rootDir>/lib/$1",
  },
  transform: {
    // Transform .js files, including those in node_modules, using Babel
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: ["/node_modules/(?!nanoid).+\\.(js|jsx|mjs|cjs|ts|tsx)$"],
};

module.exports = createJestConfig(customJestConfig);
