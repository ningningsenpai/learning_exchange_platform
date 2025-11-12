import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // JWT token
  const token = ref(localStorage.getItem('jwt_token') || '')
  
  // 用户信息
  // const userInfo = ref(JSON.parse(localStorage.getItem('user_info') || '{}'))
  
  // 设置token
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('jwt_token', newToken)
    console.log('Token已设置:', newToken)
  }
  
  // 设置用户信息
  // const setUserInfo = (info) => {
  //   userInfo.value = info
  //   localStorage.setItem('user_info', JSON.stringify(info))
  //   console.log('用户信息已设置:', info)
  // }
  
  // 清除token和用户信息
  const clearAuth = () => {
    token.value = ''
    // userInfo.value = {}
    localStorage.removeItem('jwt_token')
    // localStorage.removeItem('user_info')
    console.log('认证信息已清除')
  }
  
  // 计算属性：检查是否已登录
  const isLoggedIn = computed(() => {
    return !!token.value
  })
  
  // 计算属性：获取用户ID
  // const userId = computed(() => {
  //   return userInfo.value.id || null
  // })
  
  // 计算属性：获取用户名
  // const userName = computed(() => {
  //   return userInfo.value.name || ''
  // })
  
  return {
    // 状态
    token,
    // userInfo,
    
    // 计算属性
    isLoggedIn,
    // userId,
    // userName,
    
    // 方法
    setToken,
    // setUserInfo,
    clearAuth
  }
})