module.exports = {
   transform: {
      '^.+\\.jsx?$': 'babel-jest',
   },
   testEnvironment: 'jsdom',
   transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
   resetMocks: false,
   setupFiles: ['jest-localstorage-mock'],
}
