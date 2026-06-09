module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-redux|reselect)/)',
  ],
  moduleNameMapper: {
    '^@reduxjs/toolkit$': '<rootDir>/node_modules/@reduxjs/toolkit/dist/cjs/index.js',
    '^@reduxjs/toolkit/(.*)$': '<rootDir>/node_modules/@reduxjs/toolkit/dist/cjs/$1',
  },
};
