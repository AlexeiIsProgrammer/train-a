import type { Config } from 'jest';

const config: Config = {
    clearMocks: true,
    coverageProvider: 'v8',
    preset: 'jest-preset-angular',
    resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|js|mjs|html|svg)$': [
            'jest-preset-angular',
            {
                tsconfig: '<rootDir>/tsconfig.spec.json',
                stringifyContentPathRegex: '\\.(html|svg)$',
            },
        ],
    },
    moduleNameMapper: {
        '@shared/(.*)': '<rootDir>/src/app/shared/$1',
        '@core/(.*)': '<rootDir>/src/app/core/$1',
        '@interface/(.*)': '<rootDir>/src/app/interface/$1',
        '@pages/(.*)': '<rootDir>/src/app/pages/$1',
        '@store/(.*)': '<rootDir>/src/app/store/$1',
    },
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};

export default config;
