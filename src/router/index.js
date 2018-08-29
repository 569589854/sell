import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import goods from '@/components/goods/goods'
import ratings from '@/components/ratings/ratings'
import seller from '@/components/seller/seller'
import test from '@/components/header/test'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'goods',
      component: goods
    },
    // {
    //     path: '/test',
    //     name: 'test',
    //     component: test
    // },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    },
  ],
  linkActiveClass: 'active'
})

// const app = new Vue({
//   Router
// }).$mount('#app')


