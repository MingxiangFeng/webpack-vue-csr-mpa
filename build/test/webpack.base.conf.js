'use strict'

const webpack = require('webpack')
const glob = require('glob')
const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const XesInlineCodePlugin = require('@xes/inline-code-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const { HTML_CONFIG } = require('../config')

const IS_PRD = process.env.NODE_ENV === 'production'

const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = []
  const entryFiles = glob.sync(path.join(__dirname, '../src/*/index.js'))

  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index]
      const match = entryFile.match(/src\/(.*)\/index\.js/)

      let pageName = ''
      let entryPath = ''
      let templatePath = ''

      if (match && match[1]) {
        pageName = match && match[1]
        entryPath = entryFile

        const p = `../src/${pageName}/template.html`

        const hasTemplatePath = path.join(__dirname, p)

        if (!fs.existsSync(hasTemplatePath)) {
          const filepath = path.join(__dirname, p)
          fs.writeFileSync(filepath, `
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>学而思素养</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
`
          )
          templatePath = filepath
        } else {
          templatePath = path.join(__dirname, p)
        }
      }

      entry[pageName] = IS_PRD ? ['babel-polyfill', entryPath] : entryPath

      htmlWebpackPlugins.push(
        new XesInlineCodePlugin({
          template: templatePath,
          filename: `${pageName}/index.html`,
          chunks: [pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
          },
          ...HTML_CONFIG,
          eventid: 'xesxinxueke',
          pwa: false, // 是否使用serviceWorker
          routerMode: 'hash',
          hasLog: true, // 默认人true 含有inline 日志上报功能,false为不含有.
          domainNamePool: [
            {
              reg: /^res/,
              domains: ['res11.xesimg.com', 'res12.xesimg.com', 'res13.xesimg.com', 'res14.xesimg.com']
            },
            {
              reg: /^static/,
              domains: ['static0.xesimg.com', 'static1.xesimg.com', 'static2.xesimg.com', 'static3.xesimg.com', 'static4.xesimg.com', 'static5.xesimg.com', 'static6.xesimg.com', 'static7.xesimg.com', 'static8.xesimg.com', 'static9.xesimg.com', 'static10.xesimg.com']
            },
            {
              reg: /^scistatic/,
              domains: ['scistatic.xueersi.com']
            }
          ]
        })
      //   new HtmlWebpackPlugin({
      //     template: templatePath,
      //     filename: `${pageName}/index.html`,
      //     chunks: [pageName],
      //     inject: true,
      //     minify: {
      //       html5: true,
      //       collapseWhitespace: true,
      //       preserveLineBreaks: false,
      //       minifyCSS: true,
      //       minifyJS: true,
      //       removeComments: true
      //     },
      //     ...HTML_CONFIG
      //   })
      )
    })

  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {
  entry,
  cache: true,
  optimization: {
    emitOnErrors: true,
    moduleIds: 'named'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm-bundler.js',
      '@': path.join(__dirname, '../src'),
      '@utils': path.join(__dirname, '../utils'),
      '@static': path.join(__dirname, '../static'),
      '@config': path.join(__dirname, '../config'),
      '@components': path.join(__dirname, '../components'),
      '@style': path.join(__dirname, '../style'),
      '@network': path.join(__dirname, '../network'),
      '@pc-defines': path.join(__dirname, '../pc-defines'),
      '@pc-store': path.join(__dirname, '../pc-store'),
      '@iconfont': path.join(__dirname, '../iconfont')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        include: [path.join(__dirname, '../src'), path.join(__dirname, '../node_modules/webpack-dev-server/client')],
        use: [
          'thread-loader',
          // 耗时的 loader （例如 babel-loader）
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 15000,
          name(resourcePath, resourceQuery) {
            const matchs = resourcePath.split('/')
            let index = 0
            matchs.find((item, key) => {
              if (item === 'src') {
                index = key
              }
            })
            const rootName = matchs && matchs[index + 1]
            return `${rootName}/images/[name].[hash:7].[ext]`
          },
          esModule: false
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name(resourcePath, resourceQuery) {
            const matchs = resourcePath.split('/')
            let index = 0
            matchs.find((item, key) => {
              if (item === 'src') {
                index = key
              }
            })
            const rootName = matchs && matchs[index + 1]
            return `${rootName}/video/[name].[hash:7].[ext]`
          },
          esModule: false
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name(resourcePath, resourceQuery) {
            const matchs = resourcePath.split('/')
            let index = 0
            matchs.find((item, key) => {
              if (item === 'src') {
                index = key
              }
            })
            const rootName = matchs && matchs[index + 1]
            return `${rootName}/font/[name].[hash:7].[ext]`
          },
          esModule: false
        }
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new VueLoaderPlugin(),
    new ESLintPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: 'static'
        }
      ]
    }),
    new webpack.AutomaticPrefetchPlugin()
  ].concat(htmlWebpackPlugins)
}
