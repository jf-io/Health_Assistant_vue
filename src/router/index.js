import { createRouter, createWebHistory } from 'vue-router'

import { UserStore } from '@/stores/user.js'
import { name } from '@vue/eslint-config-prettier/skip-formatting'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/chat/chat.vue'),
    },
    {
      path: '/motion',
      name: 'motion',
      component: () => import('@/com/motion.vue'),
    },
    {
      path: '/ChangeUser',
      name: 'ChangeUser',
      component: () => import('@/com/ChangeUser.vue'),
    },
    {
      path: '/myplan',
      name: 'myplan',
      component: () => import('@/com/MyPlan.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      children: [
        {
          path: '/Recording',
          name: 'recording',
          component: () => import('@/views/Recording/Recording.vue'),
        },
        {
          path: '/square',
          name: 'square',
          component: () => import('@/views/square/square.vue'),
        },
        {
          path: '/myMsg',
          name: 'myMsg',
          component: () => import('@/views/myMsg/myMsg.vue'),
        },

        {
          path: '/healthytravel',
          name: 'healthytravel',
          component: () => import('@/views/HealthyTravel/HealthyTravel.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/views/Recording/Recording.vue'),
      //路由重定向
      redirect: '/Recording',
    },
  ],
})

router.beforeEach((to, from, next) => {
  // 判断有没有登录
  if (UserStore().token == '') {
    if (to.name == 'login') {
      next()
    } else {
      router.push('/login')
    }
  } else {
    next()
  }
})
// router.beforeEach((to) => {
//   if (!UserStore().token && to.path !== '/loing') {
//     return '/loing'
//   }
// })

export default router
