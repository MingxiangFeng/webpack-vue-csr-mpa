import Vue from 'vue'
import vueRouter from 'vue-router'

Vue.use(vueRouter)

export default () => {
  return new vueRouter({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: () => import('./../page/home'),
        name: 'hmoe'
      },
      {
        path: '/about',
        component: () => import('./../page/about'),
        name: 'about'
      }
    ]
  })
}