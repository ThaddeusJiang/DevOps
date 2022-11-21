module.exports = {
  collectCoverageFrom: ["**/*.{ts,tsx}", "!**/*.d.ts", "!**/node_modules/**"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFiles: ["dotenv/config"],
  globalTeardown: "<rootDir>/globalTeardown.ts",
  testTimeout: 50000,
};
