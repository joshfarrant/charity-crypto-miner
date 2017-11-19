const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const env = require('./utils/env');
const { version } = require('./package.json');

const plugins = [
  // expose and write the allowed env vars on the compiled bundle
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
    version: JSON.stringify(version || ''),
  }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'src', 'popup.html'),
    filename: 'popup.html',
    chunks: ['popup'],
  }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'src', 'background.html'),
    filename: 'background.html',
    chunks: ['background'],
  }),
  new WriteFilePlugin(),
  new CopyWebpackPlugin([{
    from: path.join(__dirname, 'assets'),
    to: path.join(__dirname, 'build', 'assets'),
  }]),
];

const entryPoints = {
  popup: path.join(__dirname, 'src', 'js', 'popup.jsx'),
  background: path.join(__dirname, 'src', 'js', 'background.js'),
};

const entry = {
  popup: ['babel-polyfill', entryPoints.popup],
  background: ['babel-polyfill', entryPoints.background],
};

module.exports = {
  entry,
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          }, {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      }, {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          query: {
            babelrc: false,
            presets: ['es2015', 'react'],
            plugins: [
              [
                'react-css-modules',
                {
                  filetypes: {
                    '.scss': {
                      syntax: 'postcss-scss',
                    },
                  },
                },
              ],
              'transform-class-properties',
              'transform-object-rest-spread',
              'transform-export-extensions',
            ],
          },
        },
      },
    ],
  },
};
