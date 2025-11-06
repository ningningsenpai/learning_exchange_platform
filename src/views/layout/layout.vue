<script setup>

</script>

<template>

  <el-container class="common-layout">
      <el-header class="header">
        <div class="header-decoration">

        </div>

        <div class="navigation">
          <router-link to="/navigation" class="nav-link">首页</router-link>
          <router-link to="/initialBook" class="nav-link">书库</router-link>
          <router-link to="/initialForum" class="nav-link">论坛</router-link>
          <router-link to="/initialChats" class="nav-link">消息</router-link>
          <router-link to="/shoppingCar" class="nav-link">购物车</router-link>
          <router-link to="/buyAndSoldOrders" class="nav-link">订单</router-link>
          <router-link to="/userHomePage" class="nav-link">个人中心</router-link>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>

      <el-footer class="botton">
        
      </el-footer>
    </el-container>

</template>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.common-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden; 
  position: fixed; 
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}

.header {
  height: 15%;
  position: relative;
  z-index: 10;
}

.header-decoration {
  height: 30%;
  width: 95%;
  margin: 0 auto;
  background-color: #E0F7FA;
}

.navigation {
  height: 40%;
  width: 80%;
  background-color: #BBDEFB;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  position: relative;
  z-index: 100; 
}

.main-content {
  flex: 1;
  width: 92%;
  margin: 0 auto;
}

.botton {
  height: 5%;
  background-color: #a1e6a8;
}

.nav-link {
  color: #000000; 
  text-decoration: none; 
  margin: 0 30px;
}

.nav-link:hover {
  color: #2a56c9; 
}

/* 激活状态 */
.nav-link.router-link-active {
  color: #7eaae8; 
  font-weight: bold; 
}

</style>
