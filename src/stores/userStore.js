import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // JWT token
  const token = ref(sessionStorage.getItem('jwt_token') || '')

  // 用户信息
  const userInfo = ref(JSON.parse(sessionStorage.getItem('user_info') || '{}'))

  //检查是否已经登录
  const isLoggedIn = ref(sessionStorage.getItem('isLoggedIn') === 'true' || false)

  // 设置token
  const setToken = (newToken) => {
    token.value = newToken
    sessionStorage.setItem('jwt_token', newToken)
    console.log('Token已设置:', newToken)
  }

  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
    sessionStorage.setItem('user_info', JSON.stringify(info))
    console.log('用户信息已设置:', info)
  }

  const setIsLoggedIn = (loginStatus) => {
    // ✅ 修改响应式状态的值
    isLoggedIn.value = loginStatus
    sessionStorage.setItem('isLoggedIn', String(loginStatus))
    console.log('登录状态已设置', loginStatus)
  }

  // 清除token和用户信息
  const clearAuth = () => {
    token.value = ''
    userInfo.value = {}
    isLoggedIn.value = false
    sessionStorage.removeItem('jwt_token')
    sessionStorage.removeItem('user_info')
    sessionStorage.removeItem('isLoggedIn')
    console.log('认证信息已清除')
  }

  // 计算属性：获取用户ID
  const userId = computed(() => {
    return userInfo.value.id || null
  })

  // 计算属性：获取用户名
  const userName = computed(() => {
    return userInfo.value.username || ''
  })

  return {
    // 状态
    token,
    userInfo,

    // 计算属性
    isLoggedIn,
    userId,
    userName,

    // 方法
    setToken,
    setUserInfo,
    setIsLoggedIn,
    clearAuth
  }
})