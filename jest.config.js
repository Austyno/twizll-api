module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    moduleDirectories: ["node_modules", "<rootDir>"],
    modulePaths: ['<rootDir>'],
    globals: {
      "js-jest": {
        isolatedModules: true,
      },
    }
    
};