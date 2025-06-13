import { createWebHistory, createRouter } from 'vue-router'

// 公共路由
export const constantRoutes = [
  {
    path: '/',
    component: () => import('../../src/layout/Default.vue'),
   children: [
	  { path: '', component: () => import('../../src/views/Home/Home.vue') },
	  { path: '/article', component: () => import('../../src/views/Article/Index.vue') },
	]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

export default router