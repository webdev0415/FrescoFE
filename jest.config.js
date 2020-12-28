module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileTransformer.js',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^utils/(.*)': '<rootDir>/src/utils/$1',
    '\\.(css|less|sass|scss|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/assetsTransformer.js',
  },

  setupTestFrameworkScriptFile: '<rootDir>/localStorageMock.js',
  modulePaths: ['<rootDir>/src'],
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/app/components/InviteMemberModal',
    '<rootDir>/src/app/containers/BoardList',
    '<rootDir>/src/app/containers/Categories',
    '<rootDir>/src/app/containers/Dashboard',
    '<rootDir>/src/app/containers/SignIn',
    '<rootDir>/src/app/containers/WelcomePage',
    '<rootDir>/src/app/components/Chat',
  ],
};
