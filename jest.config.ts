import type {Config} from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './',
});

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    reporters: [
        'default',
        ['jest-sonar-reporter', {
            outputDirectory: 'coverage',
            outputName: 'test-report.xml',
        }],
    ],
};

export default createJestConfig(config);
