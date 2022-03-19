'use strict'

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { merge } = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const { cg_doname } = require('../config')

console.log('process.env.BS_ENV==', process.env.BS_ENV)
console.log('build OSS_ENV==', process.env.OSS_ENV)

const vendorPackage = ['vue-router', 'vuex', 'vue', 'axios', 'swiper', 'html2canvas', 'video-animation-player']
const catchPackagesGrouped = () => {
  const result = {}

  vendorPackage.map((pack, i) => {
    result[pack] = {
      test: module => module.resource && /.js$/.test(module.resource) && module.resource.includes(path.join(__dirname, `../node_modules/${pack}/`)),
      name: pack,
      chunks: 'all',
      priority: -10
    }
  })
  return result
}

const webpackConfig = merge(baseWebpackConfig, {
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]/[name].[contenthash:8].js',
    chunkFilename: (pathData) => {
      let dirName = pathData.chunk.runtime
      dirName = typeof dirName === 'string' ? dirName : 'common'
      return `${dirName}/${pathData.chunk.id}.[contenthash:8].js`
    },
    publicPath: cg_doname,
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true }},
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true }},
          'postcss-loader',
          { loader: 'sass-loader', options: { sourceMap: true }}
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true }},
          'postcss-loader',
          { loader: 'less-loader', options: { sourceMap: true }}
        ]
      }
    ]
  },
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.OSS_ENV': JSON.stringify(process.env.OSS_ENV),
      'process.env.BS_ENV': JSON.stringify(process.env.BS_ENV || 'suzhi'),
      '__VUE_PROD_DEVTOOLS__': JSON.stringify('true'),
      '__VUE_OPTIONS_API__': JSON.stringify('false')
    }),
    new MiniCssExtractPlugin(
      {
        filename: '[name]/style.[contenthash:8].css',
        chunkFilename: ({ chunk }) => {
          let dirName = chunk.runtime
          dirName = typeof dirName === 'string' ? dirName : 'common'
          return `${dirName}/[id].[contenthash:8].css`
        }
      }
    ),
    new FriendlyErrorsWebpackPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false,
            // drop_console: OSS_ENV === 'online',
            collapse_vars: true,
            reduce_vars: true
          },
          format: {
            comments: false
          },
          ecma: 5
        },
        extractComments: false
      })
    ],
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        ...catchPackagesGrouped(),
        vuemain: {
          name: 'vue',
          test: /[\\/]node_modules[\\/](vue)[\\/]/,
          chunks: 'all',
          priority: 10
        }
      }
    }
  },
  stats: 'errors-only'
})

module.exports = webpackConfig
