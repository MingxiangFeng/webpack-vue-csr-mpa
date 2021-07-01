import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"

export default new createRouter({
  history: createWebHashHistory(),
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

