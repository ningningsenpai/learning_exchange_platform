<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const goToHomePage = () => {
  if (!userStore.isLoggedIn) {
    alert('请先登录后再访问个人中心')
    router.push('/login')
    return
  }
  router.push('/homePage')
}

const logout = () => {
  userStore.clearAuth()
  router.push('/login')
}

// 返回首页
const goToHome = () => {
  router.push('/navigation')
}

// 进入论坛（带登录检查）
const goToForum = () => {
  if (!userStore.isLoggedIn) {
    alert('请先登录后再进入论坛')
    router.push('/login')
  } else {
    router.push('/initialForum')
  }
}

const goToShoppingCar = () => {
  if (!userStore.isLoggedIn) {
    alert('请先登录后再访问购物车')
    router.push('/login')
    return
  }
  router.push('/shoppingCar')
}

const goToOrders = () => {
  if (!userStore.isLoggedIn) {
    alert('请先登录后再访问订单')
    router.push('/login')
    return
  }
  router.push('/buyAndSoldOrders')
}

const goToInitialChats = () => {
  if (!userStore.isLoggedIn) {
    alert('请先登录后再访问消息')
    router.push('/login')
    return
  }
  router.push('/initialChats')
}
</script>

<template>
  <div class="common-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <img src="/src/static/logo.png" alt="学校logo" class="logo-image">
          <h1>知识交流平台</h1>
        </div>
        <div class="nav-links">
          <router-link to="/navigation" class="nav-link">首页</router-link>
          <router-link to="/initialBook" class="nav-link">书库</router-link>
          <a href="javascript:void(0)" @click="goToShoppingCar" class="nav-link">购物车</a>
          <a href="javascript:void(0)" @click="goToOrders" class="nav-link">订单</a>
          <a href="javascript:void(0)" @click="goToForum" class="nav-link">论坛</a>
          <a href="javascript:void(0)" @click="goToInitialChats" class="nav-link">消息</a>
          <a href="javascript:void(0)" @click="goToHomePage" class="nav-link">个人中心</a>
        </div>
        <div class="user-actions">
          <template v-if="userStore.isLoggedIn">
            <span class="welcome-text">欢迎，{{ userStore.userName }}</span>
            <button class="logout-btn" @click="logout">退出</button>
          </template>
          <template v-else>
            <router-link to="/login" class="auth-link">登录</router-link>
            <router-link to="/register" class="auth-link register">注册</router-link>
          </template>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 底部区域 -->
    <footer class="footer">
      <div class="footer-content">
        <p><span>河南工业大学 知识交流平台 | 专注学术交流与知识分享</span></p>
        <p><span style="line-height: 8px">Copyright©2025 河南工业大学信息科学与工程学院</span></p>
        <p><span style="line-height: 30px">业务咨询：18623715620&nbsp; &nbsp; &nbsp; 技术支持：18623712530</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.common-layout {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.logo:hover {
  transform: translateY(-2px);
}

.logo-image {
  width: 250px;
  height: auto;
  border-radius: 10px;
  object-fit: contain;
  padding: 6px;
}

.logo h1 {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-links {
  display: flex;
  gap: 8px;
  flex-grow: 1;
  justify-content: center;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 18px;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: width 0.3s ease;
  z-index: -1;
}

.nav-link:hover::before {
  width: 100%;
}

.nav-link:hover {
  color: white;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.welcome-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  white-space: nowrap;
}

.auth-link {
  color: white;
  text-decoration: none;
  padding: 10px 22px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.auth-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: width 0.3s ease;
  z-index: -1;
}

.auth-link:hover::before {
  width: 100%;
}

.auth-link:hover {
  transform: translateY(-2px);
}

.auth-link.register {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.auth-link.register:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.logout-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 22px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.logout-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: width 0.3s ease;
  z-index: -1;
}

.logout-btn:hover::before {
  width: 100%;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.main-content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
}

.footer {
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  padding: 20px 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.footer-info {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-content {
    max-width: 100%;
    padding: 0 20px;
  }
  
  .nav-links {
    gap: 6px;
  }
  
  .nav-link {
    font-size: 15px;
    padding: 8px 14px;
  }
}

@media (max-width: 768px) {
  .header {
    position: relative;
  }
  
  .header-content {
    flex-wrap: wrap;
    height: auto;
    padding: 16px 20px;
    gap: 16px;
  }

  .logo {
    order: 1;
    width: 100%;
    justify-content: center;
  }

  .logo h1 {
    font-size: 20px;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .user-actions {
    order: 2;
    width: 100%;
    justify-content: center;
    gap: 12px;
  }

  .nav-link {
    font-size: 14px;
    padding: 8px 12px;
  }

  .welcome-text {
    font-size: 14px;
    padding: 6px 12px;
  }

  .auth-link {
    font-size: 14px;
    padding: 8px 16px;
  }

  .logout-btn {
    font-size: 14px;
    padding: 8px 16px;
  }

  .main-content {
    padding: 16px;
  }
}

/* 小屏幕优化 */
@media (max-width: 480px) {
  .header-content {
    padding: 12px 15px;
  }
  
  .logo {
    gap: 10px;
  }

  .logo-image {
    width: 40px;
    height: 40px;
  }

  .logo h1 {
    font-size: 18px;
  }

  .nav-links {
    gap: 6px;
  }

  .nav-link {
    font-size: 13px;
    padding: 6px 10px;
  }

  .welcome-text {
    font-size: 13px;
    padding: 5px 10px;
  }

  .auth-link {
    font-size: 13px;
    padding: 6px 12px;
  }

  .logout-btn {
    font-size: 13px;
    padding: 6px 12px;
  }
}
</style>