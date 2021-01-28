const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WebpackNotifier = require('webpack-notifier')
const { join } = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'web',
  entry: {
    main: join(__dirname, '..', 'src', 'index.js')
  },
  output: {
    path: join(__dirname, '../dist'),
  },
  performance: {
    hints: false,
  },
  resolve: {
    alias: {
      'vue': join(__dirname, '..', 'node_modules', 'vue', 'dist', 'vue.runtime.js'),
      '@': join(__dirname, '..', 'src')
    },
  },
  module: {
    rules: [
      {
        test: /\.js(\?.*)?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        // 对图片文件进行打包编译
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/[name].[hash:7].[ext]'
        }
      },
      {
        // 对视频文件进行打包编译
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/[name].[hash:7].[ext]'
        }
      },
      {
        // 对字体文件进行打包编译
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new WebpackNotifier({
      title: 'build completed...',
      alwaysNotify: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new CopyWebpackPlugin([{
      ignore: ['.*', 'index.html'],
      from: join(__dirname, '..', 'public'),
      to: 'public',
    }]),
    // new HtmlWebpackPlugin({
    //   template: join(__dirname, '..', 'public', 'index.html'),
    //   filename: 'index.html',
    //   // UnhandledPromiseRejectionWarning: Error: Cyclic dependency
    //   chunksSortMode: 'none',
    // }),
    new VueLoaderPlugin(),
  ],
}
