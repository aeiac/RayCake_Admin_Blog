import axios from 'axios'

// 创建 axios 实例
const apiClient = axios.create({
	baseURL: 'http://127.0.0.1:8080/admin',
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json'
	}
})

// 请求拦截器：自动添加 token
apiClient.interceptors.request.use(config => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
}, error => {
	return Promise.reject(error)
})

/**
 * 请求拦截器
 * 在每次请求前自动携带 token
 */
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      // 一般使用 Bearer 模式
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求拦截错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器：统一处理响应或错误
apiClient.interceptors.response.use(
	response => response.data,
	error => {
		console.error('请求错误:', error)
		return Promise.reject(error.response?.data || {
			message: '请求失败'
		})
	}
)

export default apiClient