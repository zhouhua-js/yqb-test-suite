module.exports = {
    collectCoverage: true,
    verbose: true,
    // collectCoverageFrom: ['src/**.{js,jsx,ts,tsx,vue}'],
    coverageDirectory: '<rootDir>/coverage',
    coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/libs/'],
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    testMatch: ['**/__tests__/**/*.(spec|test).js?(x)', 'src/**/*.(spec|test).js?(x)'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__tests__/lib/fileMock.js',
        '\\.(css|less|styl|scss|sass|sss)$': 'identity-obj-proxy'
    },

    transform: {
        '^.+\\.tsx?$': 'ts-jest',


        '^.+\\.jsx?$': 'babel-jest'
    },
    setupTestFrameworkScriptFile: '<rootDir>/__tests__/libs/setup.js'
};
