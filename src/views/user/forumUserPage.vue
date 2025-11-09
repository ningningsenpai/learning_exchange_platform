<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import router from '@/router'

const userId = ref();
// 获取用户当前用户
const currentUserInfoApi = '/api/getUserInfo'
const currentUserInfo = reactive({
  id: 1,
  username: '张三',
  avatar: 'src/static/image.png',
  grade: '大一',
  major: '计算机科学与技术',
  summary: '这个人很懒，什么都没有留下。',
})
const getCurrentUserInfo = async () => {
  try {
      const response = await axios.get(currentUserInfoApi)
      if(response.data.code === 1) {
          Object.assign(currentUserInfo, response.data.data)
      } else {
          ElMessage.error(response.data.msg)
      }
  } catch (error) {
      ElMessage.error("获取用户信息失败，请重试")
  }
}

// 根据id获取用户信息
const checkUserInfo = reactive({
  id: 1,
  username: '张三',
  avatar: 'src/static/image.png',
  summary: '这是一个用户',
  focusStatus: 0, // 关注状态 0：相互未关注 1：当前用户单向关注 2：对方单向关注 3：互相关注
  focusCount: 10,
  fansCount: 15,
  postCount: 6,
  likeCount: 45,
  collectCount: 8,
  viewCount: 120,
})
const checkUserInfoApi = '/api/getUserInfoById'
const checkUserInfoById = async () => {
  try {
      const response = await axios.get(checkUserInfoApi, {
          params: {
              userId: userId.value
          }
      })
      if(response.data.code === 1) {
          Object.assign(checkUserInfo, response.data.data)
      } else {
          ElMessage.error(response.data.msg)
      }
  } catch (error) {
      ElMessage.error("获取用户信息失败，请重试")
  }
}
// 关注用户
const followUserApi = '/api/focusUser'
const followUser = async (userId) => {
  try {
    await axios.post(followUserApi, {
      focus_user_id: userId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    ElMessage.error('关注用户失败');
  }
}
// 取消关注用户
const unfollowUserApi = '/api/cancelFocusUser'
const unfollowUser = async (userId) => {
  try {
    await axios.delete(unfollowUserApi, {
      focus_user_id: userId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    ElMessage.error('取消关注用户失败');
  }
}
// 切换关注状态
const changeFollowStatus = () => {
  if (checkUserInfo.focusStatus === 0) {
    checkUserInfo.focusStatus = 1
    checkUserInfo.fansCount++
    followUser(userId.value)
  } else if (checkUserInfo.focusStatus === 1) {
    checkUserInfo.focusStatus = 0
    checkUserInfo.fansCount--
    unfollowUser(userId.value)
  } else if (checkUserInfo.focusStatus === 2) {
    checkUserInfo.focusStatus = 3
    checkUserInfo.fansCount++
    followUser(userId.value)
  } else if (checkUserInfo.focusStatus === 3) {
    checkUserInfo.focusStatus = 2
    checkUserInfo.fansCount--
    unfollowUser(userId.value)
  }
}


// 获取用户发布的帖子
const forumPost = reactive({
  user_id: '1',
  forum_id: '1',
  title: '这是一个很有趣的帖子标题',
  publish_date: '2024-06-01',
  summary: '这是帖子内容的简要介绍',
  content: '这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的,这是帖子内容的这是帖子内容的这是帖子内容的,这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的.',
  author_name: '张三哈哈哈',
  author_avatar: 'src/static/image.png',
  page_views: 1234,
  label: ['前端开发', 'Vue.js'],
  cover_avatar: 'src/static/1.jpg',
  type: '原创',
  visible_range: '公开',
  like_count: 456,
  collect_count: 78,
  comment_count: 2,
  subject: '计算机',
  sub_classify: '前端',
  is_followed: false
})
const forumPost1 = reactive({
  user_id: '1',
  forum_id: '2',
  title: '这是一个很有趣的帖子标题',
  publish_date: '2024-06-01',
  summary: '这是帖子内容的简要介绍',
  content: '这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的,这是帖子内容的这是帖子内容的这是帖子内容的,这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的.',
  author_name: '张三哈哈哈',
  author_avatar: 'src/static/image.png',
  page_views: 1234,
  label: ['前端开发', 'Vue.js'],
  cover_avatar: 'src/static/1.jpg',
  type: '原创',
  visible_range: '公开',
  like_count: 456,
  collect_count: 78,
  comment_count: 2,
  subject: '计算机',
  sub_classify: '前端',
  is_followed: true
})
const forumPosts = reactive({
  list: [forumPost, forumPost1, forumPost, forumPost1, forumPost, forumPost1, forumPost, forumPost1]
})
const collationWay = ref('time')
// 切换排序方式
const switchCollationWay = (way) => {
  collationWay.value = way
}
const getUserPostsByTimeApi = '/api/getUserPostsByTime'
const searchKey = ref('')
const getUserPostsByTime = async () => {
  try {
      const response = await axios.get(getUserPostsByTimeApi, {
          params: {
              userId: userId.value,
              collation: collationWay.value,
              searchKey: searchKey.value
          }
      })
      if(response.data.code === 1) {
          forumPosts.list = response.data.data
      } else {
          ElMessage.error(response.data.msg)
      }
  } catch (error) {
      ElMessage.error("获取用户发布的帖子失败，请重试")
  }
}

// 跳转帖子详情
const goToPostDetail = (forumId) => {
  router.push({
    path: '/forumDetail',
    query: {
      forumId: forumId
    }
  })
}

// 标签搜索
const forumLabelSearch = (label) => {
  router.push({
    path: '/forumHomePage',
    query: {
      label: label
    }
  })
}

onMounted(() => {
  userId.value = router.currentRoute.value.query.userId
  getCurrentUserInfo()
  checkUserInfoById()
})

</script>

<template>

  <div class="userPage-content">
    <!-- 侧边栏，包含查看用户头像，名称，简介，关注状态，关注数，粉丝数，发布帖子数，点赞数，收藏数，查看数 -->
    <div class="sider">
      <div class="sider-userInfo">
        <img :src="checkUserInfo.avatar" alt="用户头像" class="userInfo-avatar">
        <div class="userInfo-text">
          <p class="userInfo-name">{{ checkUserInfo.username }}</p>
          <p class="userInfo-intro">{{ checkUserInfo.summary }}</p>
        </div>
      </div>
      
      <div class="follow-info">
        <button 
          class="follow-btn" 
          :class="{ 'followed': checkUserInfo.focusStatus === 1 || checkUserInfo.focusStatus === 3 }"
          @click="changeFollowStatus">
          <span v-if="checkUserInfo.focusStatus == 0">关注</span>
          <span v-else-if="checkUserInfo.focusStatus == 1">已关注</span>
          <span v-else-if="checkUserInfo.focusStatus == 2">关注</span>
          <span v-else-if="checkUserInfo.focusStatus == 3">相互关注</span>
        </button>
        
        <div class="follow-stats">
          <div class="stat-item">
            <span class="stat-number">{{ checkUserInfo.focusCount }}</span>
            <span class="stat-label">关注</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ checkUserInfo.fansCount }}</span>
            <span class="stat-label">粉丝</span>
          </div>
        </div>
      </div>
      
      <div class="post-stats">
        <div class="post-count">
          <span class="count-number">{{ checkUserInfo.postCount }}</span>
          <span class="count-label">发帖数</span>
        </div>
        
        <div class="interaction-stats">
          <div class="stat-item">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="stat-number">{{ checkUserInfo.likeCount }}</span>
          </div>
          
          <div class="stat-item">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
            <span class="stat-number">{{ checkUserInfo.collectCount }}</span>
          </div>
          
          <div class="stat-item">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <span class="stat-number">{{ checkUserInfo.viewCount }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主内容区域，包含用户发布的帖子列表排序方式以及搜索框 -->
    <div class="main-content">
      <!-- 排序方式和搜索区域 -->
      <div class="sort-search-section">
        <div class="sort-options">
          <button 
            class="sort-btn" 
            :class="{ active: collationWay === 'time' }"
            @click="switchCollationWay('time')">
            最新发布
          </button>
          <button 
            class="sort-btn" 
            :class="{ active: collationWay === 'view' }"
            @click="switchCollationWay('view')">
            最多浏览
          </button>
        </div>
        
        <div class="search-container">
          <input 
            type="text" 
            class="search-input" 
            placeholder="搜索帖子..." 
            v-model="searchKey"
            @keyup.enter="getUserPostsByTime">
          <button class="search-btn" @click="getUserPostsByTime">
            <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 帖子列表区域 -->
      <div class="posts-container">
        <div class="forum-posts-container">
          <div class="forum-posts">
            <div v-for="post in forumPosts.list" :key="post.forum_id" class="forum-post">
              <div class="forum-main">
                <!-- 发帖用户信息 -->
                <div class="forum-userInfo">
                  <div class="userInfo-avatar-container">
                    <img :src="post.author_avatar" alt="用户头像" class="forum-userInfo-avatar"/>
                  </div>
                  <div class="userInfo-details">
                    <p class="userInfo-name">{{ post.author_name }}</p>
                    <p class="userInfo-stats">发帖时间: {{ post.publish_date }}</p>
                  </div>
                </div>
                
                <!-- 帖子标题和简介 -->
                <div class="forum-content" @click="goToPostDetail(post.forum_id)">
                  <h2 class="forum-title">{{ post.title }}</h2>
                  <p class="forum-summary">{{ post.summary }}</p>
                </div>
                
                <!-- 帖子数据展示 -->
                <div class="forum-data">
                  <span v-for="label in post.label" :key="label" class="forum-label" @click="forumLabelSearch(label)">#{{ label }}</span>
                  <span class="forum-viewCount" @click="goToPostDetail(post.forum_id)">浏览量:{{ post.page_views }}</span>
                  <span class="forum-replyCount" @click="goToPostDetail(post.forum_id)">评论量:{{ post.comment_count }}</span>
                  <span class="forum-likeCount" @click="goToPostDetail(post.forum_id)">点赞量:{{ post.like_count }}</span>
                  <span class="forum-collectCount" @click="goToPostDetail(post.forum_id)">收藏量:{{ post.collect_count }}</span>
                </div>
              </div>
              
              <!-- 帖子封面图,右侧 -->
              <div class="forum-coverAvatar" @click="goToPostDetail(post.forum_id)">
                <img :src="post.cover_avatar" alt="帖子封面" class="cover-avatar-img"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.userPage-content {
  display: flex;
  height: 100%;
  padding: 20px;
  gap: 20px;
  background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
  overflow: hidden;
}

/* 侧边栏样式 */
.sider {
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  flex-shrink: 0;
}

/* 用户信息区域 */
.sider-userInfo {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #e8f5e8;
}

.userInfo-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #81C784;
  margin-bottom: 15px;
}

.userInfo-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.userInfo-name {
  color: #2e7d32;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.userInfo-intro {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

/* 关注区域 */
.follow-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.follow-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.follow-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
}

.follow-btn.followed {
  background: linear-gradient(135deg, #a5d6a7 0%, #81C784 100%);
}

.follow-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #f8faf8;
  border-radius: 8px;
  padding: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-number {
  color: #2e7d32;
  font-size: 1.1rem;
  font-weight: 600;
}

.stat-label {
  color: #666;
  font-size: 0.8rem;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: #e0e0e0;
}

/* 帖子统计区域 */
.post-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.post-count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8faf8;
  border-radius: 8px;
}

.count-number {
  color: #2e7d32;
  font-size: 1.2rem;
  font-weight: 600;
}

.count-label {
  color: #666;
  font-size: 0.9rem;
}

.interaction-stats {
  display: flex;
  justify-content: space-around;
  background: #f8faf8;
  border-radius: 8px;
  padding: 12px;
}

.interaction-stats .stat-item {
  flex-direction: row;
  gap: 6px;
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: #81C784;
}

.interaction-stats .stat-number {
  font-size: 0.9rem;
  color: #666;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

/* 排序和搜索区域 */
.sort-search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  flex-shrink: 0;
}

.sort-options {
  display: flex;
  gap: 10px;
}

.sort-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 20px;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-btn:hover {
  border-color: #81C784;
  color: #81C784;
}

.sort-btn.active {
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
  color: white;
  border-color: #81C784;
}

/* 搜索区域 */
.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.9rem;
  width: 200px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #81C784;
  box-shadow: 0 0 0 2px rgba(129, 199, 132, 0.2);
}

.search-btn {
  padding: 8px;
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-icon {
  width: 16px;
  height: 16px;
}

/* 帖子列表区域 */
.posts-container {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.forum-posts-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.forum-posts {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.forum-post {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;
  border-left: 4px solid #81C784;
  justify-content: space-between;
  align-items: flex-start;
}

.forum-post:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.forum-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

/* 用户信息区域 */
.forum-userInfo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.userInfo-avatar-container {
  width: 40px;
  height: 40px;
}

.forum-userInfo-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #81C784;
}

.userInfo-details {
  flex: 1;
}

.userInfo-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2e7d32;
  margin: 0 0 4px 0;
}

.userInfo-stats {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

/* 帖子内容区域 */
.forum-content {
  cursor: pointer;
  transition: color 0.3s ease;
}

.forum-content:hover {
  color: #2e7d32;
}

.forum-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.forum-summary {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 帖子数据区域 */
.forum-data {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.forum-label {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.forum-label:hover {
  background: #81C784;
  color: white;
}

.forum-viewCount, .forum-replyCount, .forum-likeCount, .forum-collectCount {
  font-size: 0.85rem;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.forum-viewCount:hover, .forum-replyCount:hover, .forum-likeCount:hover, .forum-collectCount:hover {
  color: #2e7d32;
}

/* 帖子封面图 */
.forum-coverAvatar {
  width: 120px;
  height: 60%;
  margin-left: 20px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.cover-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cover-avatar-img:hover {
  transform: scale(1.05);
}

/* 自定义滚动条 */
.posts-container::-webkit-scrollbar {
  width: 6px;
}

.posts-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.posts-container::-webkit-scrollbar-thumb {
  background: #81C784;
  border-radius: 3px;
}

.posts-container::-webkit-scrollbar-thumb:hover {
  background: #66BB6A;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .userPage-content {
    flex-direction: column;
    padding: 10px;
  }
  
  .sider {
    width: 100%;
  }
  
  .sort-search-section {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-input {
    width: 150px;
  }
  
  .post-card {
    flex-direction: column;
  }
  
  .post-cover {
    width: 100%;
    height: 200px;
    margin-left: 0;
    margin-top: 15px;
  }
}
</style>