const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Try the environment variable, otherwise use root
const ASSET_PATH = process.env.ASSET_PATH || '/';

const fileDep = path.resolve(__dirname, 'sample.txt');

module.exports = (env, argv) => {
  return {
    mode: argv.mode || 'development',
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
      historyApiFallback: {
        index: '/'
      },
    },
    plugins: [
      // This makes it possible for us to safely use env vars on our code
      new webpack.DefinePlugin({
        'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
        __MODE__: JSON.stringify(env.target),
        __BUILT_AT__: webpack.DefinePlugin.runtimeValue(Date.now, {
          fileDependencies: [fileDep],
        }),
      }),
      new HtmlWebpackPlugin({
        title: 'Output Management',
        template: 'src/index.html'
      }),
    ],
    output: {
      publicPath: ASSET_PATH,
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
  }
};