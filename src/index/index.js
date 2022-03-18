// 开发环境，如果是ie中，需要babel-profill
import 'babel-polyfill'
import Vue from 'vue'

import '../../static/1'

import App from './App.vue'
import router from './router'

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})