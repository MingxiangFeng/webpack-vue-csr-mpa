const vueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const devWebpackConfig = merge(baseWebpackConfig, {
  plugins: [
    new vueSSRClientPlugin()
  ]
})