import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'hash',
  base: '/index/',
  routes: [
    {
      name: 'home',
      component: () => import('./home.vue'),
      path: '/'
    },
    {
      name: 'search',
      component: () => import('./search.vue'),
      path: '/search'
    }
  ]
})

