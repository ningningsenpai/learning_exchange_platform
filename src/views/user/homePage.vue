<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import router from '@/router'
import { useUserStore } from '@/stores/userStore'

// 获取用户存储实例
const userStore = useUserStore()
const JWT_TOKEN = userStore.token

// 获取用户信息
const userInfoApi = '/tempApi/getUserInfo'
const userInfo = reactive({
    id: 1,
    username: '张三',
    avatar: 'src/static/image.png',
    grade: '大一',
    major: '计算机科学与技术',
    summary: '这个人很懒，什么都没有留下。',
})
const getUserInfo = async () => {
    try {
        const response = await axios.get(userInfoApi, {
            headers: {
                'Authorization': JWT_TOKEN
            }
        })
        if(response.data.code === 1) {
            Object.assign(userInfo, response.data.data)
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("获取用户信息失败，请重试")
    }
}

// 社交信息查询 
const socialInfo1 = reactive({
  id: 1,
  user_name: '张三',
  user_avatar: 'src/static/image.png',
  summary: '这个人很懒，什么都没有留下。',
  focusCount: 2,
  fansCount: 3
})
const socialInfo2 = reactive({
  id: 2,
  user_name: '张三',
  user_avatar: 'src/static/image.png',
  summary: '这个人很懒，什么都没有留下。',
  focusCount: 4,
  fansCount: 5
})
const socialInfo3 = reactive({
  id: 3,
  user_name: '张三',
  user_avatar: 'src/static/image.png',
  summary: '这个人很懒，什么都没有留下。',
  focusCount: 4,
  fansCount: 6
})
const socialInfos = reactive({
  focusList: [socialInfo1, socialInfo2],
  fansList: [socialInfo2, socialInfo3],
  friendsList: [socialInfo2]
})
const socialCount = reactive({
  focusCount: socialInfos.focusList.length,
  fansCount: socialInfos.fansList.length,
  friendsCount: socialInfos.friendsList.length,
})
const focusListApi = '/tempApi/userCenter/getFocusUser'
const fansListApi = '/tempApi/userCenter/getFansUser'
const friendsListApi = '/tempApi/userCenter/getFriendsUser'
const getSocialInfo = async () => {
  try {
      const focusResponse = await axios.get(focusListApi, {
            headers: {
                'Authorization': JWT_TOKEN
            }
        })
      const fansResponse = await axios.get(fansListApi, {
            headers: {
                'Authorization': JWT_TOKEN
            }
        })
      const friendsResponse = await axios.get(friendsListApi, {
            headers: {
                'Authorization': JWT_TOKEN
            }
        })
      if(focusResponse.data.code === 1) {
          socialInfos.focusList = focusResponse.data.data
      } else {
          ElMessage.error(focusResponse.data.msg)
      }
      if(fansResponse.data.code === 1) {
          socialInfos.fansList = fansResponse.data.data
      } else {
          ElMessage.error(fansResponse.data.msg)
      }
      if(friendsResponse.data.code === 1) {
          socialInfos.friendsList = friendsResponse.data.data
      } else {
          ElMessage.error(friendsResponse.data.msg)
      }
  } catch (error) {
      ElMessage.error("获取社交信息失败，请重试")
  }
}

// 获取创作者成就信息
const lickCounts = ref(0)
const collectCounts = ref(0)
const pageViews = ref(0)
const likeCountsApi = '/tempApi/userCenter/getLikeCounts'
const collectCountsApi = '/tempApi/userCenter/getCollectCounts'
const pageViewsApi = '/tempApi/userCenter/getPageViews'
const getForumCount = async () => {
    try {
        const likeResponse = await axios.get(likeCountsApi, {
            headers: {
                'Authorization': JWT_TOKEN
            }
        })
        const collectResponse = await axios.get(collectCountsApi, {
            headers: {
                'Authorization': JWT_TOKEN
            }
        })
        const pageViewsResponse = await axios.get(pageViewsApi, {
            headers: {
                'Authorization': JWT_TOKEN
            }
        })
        if(likeResponse.data.code === 1) {
            lickCounts.value = likeResponse.data.data
        } else {
            ElMessage.error(likeResponse.data.msg)
        }
        if(collectResponse.data.code === 1) {
            collectCounts.value = collectResponse.data.data
        } else {
            ElMessage.error(collectResponse.data.msg)
        }
        if(pageViewsResponse.data.code === 1) {
            pageViews.value = pageViewsResponse.data.data
        } else {
            ElMessage.error(pageViewsResponse.data.msg)
        }
    } catch (error) {
        ElMessage.error("获取创作者成就信息失败，请重试")
    }
}

// 交易相关按钮
const dealButtonContent = ref([
  '上架商品',
  '我的商品'
])
const dealDropDown = ref(false)
function toggleDealDropDown () {
  dealDropDown.value = !dealDropDown.value
  forumDropDown.value = false
}

// 社区相关按钮
const forumButtonContent = ref([
  '文章',
  '收藏',
  '动态'
])
const forumDropDown = ref(false)
function toggleForumDropDown () {
  forumDropDown.value = !forumDropDown.value
  dealDropDown.value = false
}

// 退出登录
function logout() {
  
}

</script>

<template>

  <div class="homePage-content">
    <!-- 侧边栏 -->
    <div class="sider">
            <!-- 用户信息 -->
      <div class="userInfo">
        <img :src="userInfo.avatar" alt="" class="userInfo-avatar">
        <span class="userName">{{ userInfo.username }}</span>
      </div>
      
      <!-- 社交信息 -->
      <div class="socialInfo">
        <span class="socialItem">关注: {{ socialCount.focusCount }}</span>
        <span class="socialItem">粉丝: {{ socialCount.fansCount }}</span>
        <span class="socialItem">好友: {{ socialCount.friendsCount }}</span>
      </div>
      
      <!-- 创作者成就信息 -->
      <div class="creatorInfo">
        <div class="creatorItem">
          <span class="icon like-icon"></span>
          <span class="count">{{ lickCounts }}</span>
        </div>
        <div class="creatorItem">
          <span class="icon star-icon"></span>
          <span class="count">{{ collectCounts }}</span>
        </div>
        <div class="creatorItem">
          <span class="icon view-icon"></span>
          <span class="count">{{ pageViews }}</span>
        </div>
      </div>
      
      <!-- 功能按钮区 -->
      <div class="function-btn">
        <!-- 交易相关 -->
        <div class="deal-btn">
          <button class="function-btn-item" @click="toggleDealDropDown">
            <span class="btn-icon">💰</span>
            <span class="btn-text">交易相关</span>
            <span class="arrow" :class="{ 'arrow-down': dealDropDown }">▼</span>
          </button>
          <div class="dropdown-content" v-show="dealDropDown">
            <button 
              v-for="(item, index) in dealButtonContent" 
              :key="index" 
              class="dropdown-item"
              @click="console.log(item)"
            >
              <span class="dropdown-icon">{{ index === 0 ? '📦' : '📋' }}</span>
              {{ item }}
            </button>
          </div>
        </div>
        
       <!-- 社区相关 -->
        <div class="forum-btn" :class="{ 'moved-down': dealDropDown }">
          <button class="function-btn-item" @click="toggleForumDropDown">
            <span class="btn-icon">👥</span>
            <span class="btn-text">社区相关</span>
            <span class="arrow" :class="{ 'arrow-down': forumDropDown }">▼</span>
          </button>
          <div class="dropdown-content" v-show="forumDropDown">
            <button 
              v-for="(item, index) in forumButtonContent" 
              :key="index" 
              class="dropdown-item"
              @click="console.log(item)"
            >
              <span class="dropdown-icon">{{ index === 0 ? '📝' : index === 1 ? '❤️' : '📱' }}</span>
              {{ item }}
            </button>
          </div>
        </div>
        
      <!-- 退出登录按钮 -->
        <div class="logout-btn" :class="{ 
          'moved-down': dealDropDown || forumDropDown,
          'deal-active': dealDropDown,
          'forum-active': forumDropDown
        }">
          <button class="function-btn-item logout" @click="logout">
            <span class="btn-icon">🚪</span>
            <span class="btn-text">退出登录</span>
          </button>
        </div>
      </div>
    </div>

    <!--  -->

  </div>
 
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.homePage-content {
  display: flex;
  height: 100%;
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
}

/* 侧边栏样式 */
.sider {
  width: 280px;
  height: 98%;
  margin: auto 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 用户信息区域 */
.userInfo {
  text-align: center;
  padding-bottom: 15px;
  border-bottom: 2px solid #e8f5e8;
}

.userInfo-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #81C784;
  margin-bottom: 10px;
}

.userName {
  color: #2e7d32;
  font-size: 1.2rem;
  font-weight: 600;
  display: block;
}

/* 社交信息区域 */
.socialInfo {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}

.socialItem {
  color: #455a64;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: default;
  transition: color 0.3s ease;
}

.socialItem:hover {
  color: #2e7d32;
}

/* 创作者成就信息区域 */
.creatorInfo {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8faf8;
  border-radius: 8px;
}

.creatorItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: default;
  transition: all 0.3s ease;
}

.creatorItem:hover {
  transform: translateY(-2px);
}

.icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.creatorItem:hover .icon {
  opacity: 1;
  transform: scale(1.1);
}

.like-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2381C784'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
}

.star-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2381C784'%3E%3Cpath d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E");
}

.view-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2381C784'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E");
}

.count {
  color: #2e7d32;
  font-size: 0.9rem;
  font-weight: 600;
}

/* 功能按钮区域 */
.function-btn {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.deal-btn, .forum-btn, .logout-btn {
  transition: all 0.1s ease;
  position: relative; 
}

.forum-btn.moved-down {
  margin-top: 76px;
}

.logout-btn.moved-down {
  margin-top: 76px; 
}

.logout-btn.moved-down.deal-active {
  margin-top: 8px; 
}

.logout-btn.moved-down.forum-active {
  margin-top: 114px; 
}

.function-btn-item {
  width: 100%;
  padding: 10px 12px;
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.function-btn-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
}

.function-btn-item.logout {
  background: linear-gradient(135deg, #e57373 0%, #ef5350 100%);
}

.function-btn-item.logout:hover {
  background: linear-gradient(135deg, #ef5350 0%, #f44336 100%);
}

.btn-icon {
  font-size: 1rem;
}

.btn-text {
  flex: 1;
  text-align: left;
}

.arrow {
  transition: transform 0.3s ease;
  font-size: 0.7rem;
}

.arrow-down {
  transform: rotate(180deg);
}

/* 下拉内容样式 */
.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 6px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  z-index: 10;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: white;
  color: #455a64;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  box-sizing: border-box;
}

.dropdown-item:hover {
  background: #f8faf8;
  color: #2e7d32;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-icon {
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .homePage-content {
    padding: 10px;
  }
  
  .sider {
    width: 100%;
  }
  
  .forum-btn.moved-down {
    transform: translateY(50px);
  }
  
  .logout-btn.moved-down {
    transform: translateY(100px);
  }
  
  .creatorInfo {
    flex-direction: column;
    gap: 8px;
  }
}
</style>