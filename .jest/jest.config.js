module.exports = {
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      lines: 85
    }
  },
  globals: {
    'ts-jest': {
      tsconfig: '../../tsconfig.json'
    }
  },
  preset: 'ts-jest',
  setupFiles: ['dotenv/config', '../../.jest/configurePorts.ts'],
  silent: false,
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  testTimeout: 30000,
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { configFile: '../../.jest/.swcrc' }]
  },
  verbose: true
}
