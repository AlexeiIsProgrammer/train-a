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
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};

export default config;
