const express = require('express')
const vueServerRender = require('vue-server-renderer')
const path = require('path')

const app = new express()

const renderer = vueServerRender.createRenderer({
  template: require('fs').readFileSync(path.join(__dirname, './src/ssr/index.html'), 'utf-8')
})

const App = require('./src/ssr/entry-server')

app.get('*', async (req, res) => {
  res.status(200)
  res.setHeader('Content-type', 'text/html;charset-utf-8')

  let { url } = req
  let vm

  vm = await App({url})
  
  renderer.renderToString(vm).then((html) => {
    res.end(html)
  }).catch(err => console.log(err))
})

app.listen('8089', () => {
  console.log('server in port: 8089!')
})