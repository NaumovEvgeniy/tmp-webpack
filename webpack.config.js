const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './src/index.ts',

    output: {
        filename: 'index_bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },

    plugins: [
        new HtmlWebpackPlugin({
          title: 'Car',
          template: './src/index.html',
          minify: false
        }),
        /*new CopyPlugin({
            patterns: [
              {
                  from: "src/assets",
                  to: "dist/assets",
                  force: true
              }
            ],
        })*/
    ],

    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    },

    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
    },

    devtool: 'source-map'
};

//config.plugins = commonPlugins.concat(devPlugins);