import {
	createWebHistory,
	createRouter
} from 'vue-router'
import {
	verify
} from '../api/auth.js'
import {
	ElMessage
} from 'element-plus'

// 公共路由
export const constantRoutes = [{
		path: '/index',
		component: () => import('../../src/layout/Default.vue'),
		children: [{
			path: '',
			component: () => import('../../src/views/Home/Home.vue')
		}, ]
	},
	{
		path: '/',
		component: () => import('../../src/layout/Auth.vue'),
		children: [{
			path: '/login',
			component: () => import('../../src/views/Auth/Login.vue')
		}, ]
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes: constantRoutes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		}
		return {
			top: 0
		}
	},
})

/**
 * ✅ 全局路由守卫
 * 如果没有 token 且不是访问登录页，则强制跳转到 /login
 */
router.beforeEach((to, from, next) => {

	const token = localStorage.getItem('token')
	const isLoginPage = to.path === '/login'

	// 如果没有 token 且不是登录页，跳转登录
	if (!token && !isLoginPage) {
		return next('/login')
	}
	
	if (token) {
		verify().then(result => {
			if (result?.code !== 200) {
				// token 无效，清除并跳转登录
				ElMessage.error(result.msg)
				localStorage.removeItem('token')
				return next('/login')
			}
		})
	}
	next()
})

export default router