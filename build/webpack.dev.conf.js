'use strict';

const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.conf')
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const packageConfig = require('../package.json')
const { merge } = require('webpack-merge')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]/[name].[chunkhash].js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', { loader: 'css-loader', options: { sourceMap: true } }, 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', { loader: 'css-loader', options: { sourceMap: true } }, 'postcss-loader', { loader: 'sass-loader', options: { sourceMap: true } },]
      },
      {
        test: /\.html$/i,
        loader: 'raw-loader'
      },
    ],  
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin({
      activeModules: false,
      entries: true,
      handler(percentage, message, ...args) {
        // e.g. Output each progress message directly to the console:
        // console.info('percentage==', percentage, 'message==', message, 'args===', ...args);
      },
      modules: true,
      modulesCount: 5000,
      profile: false,
      dependencies: true,
      dependenciesCount: 10000,
      percentBy: null,
    })      
  ],
  devServer: {
    host: 'localhost',
    contentBase: './dist',
    hot: true,
    stats: 'errors-only',
    open: false,
    proxy: {},
    disableHostCheck: true,
    compress: true,
    historyApiFallback: {
      rewrites: [
        { 
          from: /^\/\w+\/.*/, 
          to: function(context) {
            const path = require('path')
            const pathname = context.parsedUrl.pathname
            const match = pathname.split('/')
            const assetsPublicPath = '/' + (match && match[1]) + '/'
            return path.posix.join(assetsPublicPath, 'index.html')
          }
        },
        {
          from: /^(\/)?$/,
          to: '/index/index.html'
        }
      ],
    },
  },
  devtool: 'cheap-source-map'
})

// 开发构建通知
// 失败通知，成功不通知
function createNotifierCallback() {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || ''
    })
  }
}

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = 8080
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: createNotifierCallback()
      }))

      resolve(devWebpackConfig)
    }
  })
})
