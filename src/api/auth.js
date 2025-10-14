import apiClient from './admin'

/**
 * 管理后台 - 登录接口
 * @param {string} name
 * @param {string} password
 * @returns {Promise<object>} { token, user, ... }
 */
export const login = (name, password) =>
	apiClient.post('/auth/login', {
		name,
		password
	})

/**
 * 管理后台 - 鉴权接口
 */
export const verify = () =>
	apiClient.post('/auth/verify')

/**
 * 管理后台 - 鉴权接口
 */
export const out = () =>
	apiClient.post('/auth/out')