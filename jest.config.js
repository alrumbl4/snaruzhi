module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@shopify/react-native-skia$': '<rootDir>/test-utils/skiaMock.tsx',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
};
