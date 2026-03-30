module.exports = {
  testEnvironment: 'jsdom',
  verbose: true,
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^../../js/(.*)$': '<rootDir>/js/$1',
  },
};
