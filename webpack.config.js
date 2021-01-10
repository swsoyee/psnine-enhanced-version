const path = require('path');
const monkey = require('./monkey.config');
const webpack = require('webpack');

const Terser = require('terser-webpack-plugin');
const BannerPlugin = require('webpack/lib/BannerPlugin');

module.exports = {
    entry: monkey.config.entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename:
            monkey.header.name.toLowerCase().replace(' ', '-') + '.user.js'
    },
    mode: 'none',
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /(node_modules)/,
                use: [{ loader: 'css-loader' }, { loader: 'postcss-loader' }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: ['url-loader']
            }
        ]
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new Terser({
            terserOptions: {
                mangle: false,
                output: {
                    beautify: true
                }
            }
        }),
        new BannerPlugin({
            banner: monkey.buildedHeader(),
            raw: true
        })
    ]
};
