'use strict'

const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.conf')
const path = require('path')
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const packageConfig = require('../package.json')
const { merge } = require('webpack-merge')
const { proxy, DOMAIN } = require('../config')

console.log('process.env.BS_ENV==', process.env.BS_ENV)
const DEV_PATH_NAME = DOMAIN.replace(/^(\w+)./, 'iii.')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]/[name].bundle.js',
    pathinfo: false
  },
  optimization: {
    runtimeChunk: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', { loader: 'css-loader', options: { sourceMap: true }}, 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', { loader: 'css-loader', options: { sourceMap: true }}, 'postcss-loader', { loader: 'sass-loader', options: { sourceMap: true }}]
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', { loader: 'css-loader', options: { sourceMap: true }}, 'postcss-loader', { loader: 'less-loader', options: { sourceMap: true }}]
      },
      {
        test: /\.txt$/i,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.OSS_ENV': JSON.stringify('development'),
      'process.env.BS_ENV': JSON.stringify(process.env.BS_ENV || 'suzhi')
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    host: '0.0.0.0',
    contentBase: './dist',
    hot: true,
    stats: 'errors-only',
    open: false,
    proxy: proxy,
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
      ]
    }
  }
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
          messages: [`
服务启动: http://${DEV_PATH_NAME}:${port}。
当然, 你也需要配置host: 【127.0.0.1 ${DEV_PATH_NAME}】
${port + '' !== '8080' ? '检测到启动服务端口不是8080，请关闭占用服务的端口，再重启本服务，否则开发过程会有异常！！！' : ''}
`]
        },
        onErrors: createNotifierCallback()
      }))

      resolve(devWebpackConfig)
    }
  })
})
