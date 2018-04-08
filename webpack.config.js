const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader',
            include: [path.resolve(__dirname, 'src')]
        }]
    },
    plugins: [
        new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })
    ],
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src')
        }
    },
    target: 'node',
    node: {
        path: false,
        fs: false,
        __dirname: false,
        __filename: false
    }
};
