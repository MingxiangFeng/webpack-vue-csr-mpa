'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.conf')

const webpackConfig = merge(baseWebpackConfig, {
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]/[name].[chunkhash:8].js',
    chunkFilename: (pathData) => {
      return `${pathData.chunk.runtime}/${pathData.chunk.id}.[chunkhash:8].js`
    },
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          'postcss-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          'postcss-loader', 
          { loader: 'sass-loader', options: { sourceMap: true } },
        ]
      },
    ]
  },
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new MiniCssExtractPlugin(
      {
        filename: '[name]/style.[contenthash:8].css'
      }
    ),
    // new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          ecma: 2015,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          // Deprecated
          output: null,
          format: null,
          toplevel: false,
          nameCache: null,
          ie8: true,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: true,
        },
        extractComments: false
      }),
    ],
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  },
  stats: 'errors-only'
})

module.exports = webpackConfig