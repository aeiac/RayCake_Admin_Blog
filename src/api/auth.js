import apiClient from './admin'

/**
 * 管理后台 - 登录接口
 * @param {string} name
 * @param {string} password
 * @returns {Promise<object>} { token, user, ... }
 */
export const login = (name, password) => 
  apiClient.post('/auth/login', { name, password })
