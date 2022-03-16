const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:{
        options: "./src/index.js", report: './src/report.js'
    },
    output: {
        path: path.join(__dirname, 'production')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        },
        {
            test: /\.css$/,
            exclude: /node_modules/,
            use:
                ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'Options Page',
            template: './src/index.html',
            inject:true,
            chunks: ['options'],
            filename: 'index.html'
        }),
        new htmlWebpackPlugin({
            title: 'Results Page',
            template: './src/index.html',
            inject:true,
            chunks: ['report'],
            filename: 'report.html'
        })
    ]
}