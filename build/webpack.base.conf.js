'use strict'

const webpack = require('webpack');
const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, '../src/*/index.js'));

  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];
      const match = entryFile.match(/src\/(.*)\/index\.js/);
      
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
                    <title>Document</title>
                </head>
                <body>
                    <div id="app"></div>
                </body>
                </html>
            `)
          templatePath = filepath    
        } else {
          templatePath = path.join(__dirname, p)
        }
      }

      entry[pageName] = process.env.NODE_ENV === 'production'  ? ['babel-polyfill', entryPath] : entryPath;
      // entry[pageName] = entryPath

      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          title: 'Caching',
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
        })
      );
    });

  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  optimization: {
    emitOnErrors: true,
    moduleIds: 'named'
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.runtime.js',
      '@': path.join(__dirname, '../src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js(\?.*)?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime']
        },
        include: [path.join(__dirname, '../src'), path.join(__dirname, '../node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
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
            return `${rootName}/font/[name].[hash:7].[ext]`
          },
          esModule: false
        }
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: 'static',
        }
      ]
    }),
    new webpack.AutomaticPrefetchPlugin()
  ].concat(htmlWebpackPlugins)
}