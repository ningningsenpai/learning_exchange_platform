<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import router from '@/router'

// 获取用户信息
const userInfoApi = '/api/getUserInfo'
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
        const response = await axios.get(userInfoApi)
        if(response.data.code === 1) {
            Object.assign(userInfo, response.data.data)
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("获取用户信息失败，请重试")
    }
}
// 修改用户信息
const showUserInfoModal = ref(false)
const editForm = reactive({
    username: '',
    grade: '',
    major: '',
    summary: '',
    avatar: ''
})
const openUserInfoModal = () => {
    Object.assign(editForm, userInfo)
    showUserInfoModal.value = true
}
const closeUserInfoModal = () => {
    showUserInfoModal.value = false
}
// 头像上传
const handleAvatarUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        if (!file.type.startsWith('image/')) {
            ElMessage.error('请上传图片文件')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            ElMessage.error('图片大小不能超过5MB')
            return
        }
        
        // 创建文件阅读器预览图片
        const reader = new FileReader()
        reader.onload = (e) => {
            editForm.avatar = e.target.result
        }
        reader.readAsDataURL(file)
    }
}
const changeUserInfoShow = () => {
    if(editForm.avatar) {
        userInfo.avatar = editForm.avatar
    }
    userInfo.username = editForm.username
    userInfo.grade = editForm.grade
    userInfo.major = editForm.major
    userInfo.summary = editForm.summary
    closeUserInfoModal()
}
const updateUserInfoApi = '/api/updateUserInfo'
const updateUserInfo = async () => {
    if(!editForm.username || !editForm.grade || !editForm.major || !editForm.summary) {
        ElMessage.error("请填写完整用户信息")
        return
    }
    changeUserInfoShow()
    try {
        const response = await axios.post(updateUserInfoApi, {
            username: editForm.username,
            avatar: editForm.avatar,
            grade: editForm.grade,
            major: editForm.major,
            summary: editForm.summary,
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        } 
      )
        if(response.data.code === 1) {
            ElMessage.success("修改用户信息成功")
            userInfoVisible.value = false
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("修改用户信息失败，请重试")
    }
}

// 获取创作者成就信息
const lickCounts = ref(0)
const collectCounts = ref(0)
const pageViews = ref(0)
const likeCountsApi = '/api/userCenter/getLikeCounts'
const collectCountsApi = '/api/userCenter/getCollectCounts'
const pageViewsApi = '/api/userCenter/getPageViews'
// 获取点赞数
const getForumCount = async () => {
    try {
        const likeResponse = await axios.get(likeCountsApi)
        const collectResponse = await axios.get(collectCountsApi)
        const pageViewsResponse = await axios.get(pageViewsApi)
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

// 社交信息查询 
const socialInfo1 = reactive({
  id: 1,
  user_name: '张三',
  user_avatar: 'src/static/image.png',
  summary: '这个人很懒，什么都没有留下。',
  focusCount: 0,
  fansCount: 0
})
const socialInfo2 = reactive({
  id: 2,
  user_name: '张三',
  user_avatar: 'src/static/image.png',
  summary: '这个人很懒，什么都没有留下。',
  focusCount: 0,
  fansCount: 0
})
const socialInfo3 = reactive({
  id: 3,
  user_name: '张三',
  user_avatar: 'src/static/image.png',
  summary: '这个人很懒，什么都没有留下。',
  focusCount: 0,
  fansCount: 0
})
const socialInfos = reactive({
  focusList: [socialInfo1, socialInfo2],
  fansList: [socialInfo2, socialInfo3],
  friendsList: [socialInfo2]
})
const socialCount = reactive({
  focusCount: 0,
  fansCount: 0,
  friendsCount: 0,
})
const focusListApi = '/api/userCenter/getFocusUser'
const fansListApi = '/api/userCenter/getFansUser'
const friendsListApi = '/api/userCenter/getFriendsUser'
const getSocialInfo = async () => {
  try {
      const focusResponse = await axios.get(focusListApi)
      const fansResponse = await axios.get(fansListApi)
      const friendsResponse = await axios.get(friendsListApi)
      if(focusResponse.data.code === 1) {
          socialInfos.focusList = focusResponse.data.data
          socialCount.focusCount = focusResponse.data.data.length
      } else {
          ElMessage.error(focusResponse.data.msg)
      }
      if(fansResponse.data.code === 1) {
          socialInfos.fansList = fansResponse.data.data
          socialCount.fansCount = fansResponse.data.data.length
      } else {
          ElMessage.error(fansResponse.data.msg)
      }
      if(friendsResponse.data.code === 1) {
          socialInfos.friendsList = friendsResponse.data.data
          socialCount.friendsCount = friendsResponse.data.data.length
      } else {
          ElMessage.error(friendsResponse.data.msg)
      }
  } catch (error) {
      ElMessage.error("获取社交信息失败，请重试")
  }
}

// 信息展示区域显示内容控制
const showUserPosts = ref(true)
const showUserCollects = ref(false)
const showUserDynamics = ref(false)
function changeShow(type) {
  if(type === 'posts') {
    showUserPosts.value = true
    showUserCollects.value = false
    showUserDynamics.value = false
    getUserPost()
  } else if(type === 'collects') {
    showUserPosts.value = false
    showUserCollects.value = true
    showUserDynamics.value = false
    getUserCollects()
  } else if(type === 'dynamics') {
    showUserPosts.value = false
    showUserCollects.value = false
    showUserDynamics.value = true
    getUserDynamics()
  }
}

// 获取个人帖子
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
  is_like: true,
  is_collect: true,
  is_followed: true
})
// 获取用户个人帖子
const userPosts = reactive({
    List: [forumPost, forumPost, forumPost, forumPost]
})
const userPostApi = '/api/getLoginUserPosts'
const getUserPost = async () => {
  try {
      const response = await axios.get(userPostApi)
      if(response.data.code === 1) {
          userPosts.List = response.data.data
      } else {
          ElMessage.error(response.data.msg)
      }
  } catch (error) {
      ElMessage.error("获取个人帖子失败，请重试")
  }
}

// 获取用户收藏数据
const userCollects = reactive({
  list: [forumPost, forumPost1, forumPost, forumPost1]
})

const getUserCollectsApi = '/api/userCenter/getUserCollects'
const getUserCollects = async () => {
  try {
    const response = await axios.get(getUserCollectsApi)
    if(response.data.code === 1) {
      userCollects.list = response.data.data
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error("获取用户收藏失败，请重试")
  }
}

// 获取用户动态数据
const userDynamics = reactive({
  list: [forumPost1, forumPost1, forumPost1, forumPost1]
})

const getUserDynamicsApi = '/api/userCenter/getUserDynamics'
const getUserDynamics = async () => {
  try {
    const response = await axios.get(getUserDynamicsApi)
    if(response.data.code === 1) {
      userDynamics.list = response.data.data
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error("获取用户动态失败，请重试")
  }
}

// 关注状态切换
const toggleFollow = (forum) => {
  forum.is_followed = !forum.is_followed;
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

// onMounted(() => {
//     getUserInfo();
//     getForumCount();
//     getSocialInfo();
//     getUserPost();
// })



</script>

<template>

  <div class="forumHomePage-content">
    <!-- 侧边栏 -->
     <div class="sider">
      <!-- 用户信息和社交信息 -->
      <div class="sider-userInfo">
        <img :src="userInfo.avatar" alt="" class="userInfo-avatar"/>
        <div class="userInfo-text">
          <p>{{ userInfo.username }}</p>
        </div>
        <div class="sider-social-info">
          <span class="social-item">关注:{{ socialCount.focusCount }}</span>
          <span class="social-item">粉丝:{{ socialCount.fansCount }}</span>
          <span class="social-item">好友:{{ socialCount.friendsCount }}</span>  
        </div>
      </div>
      <!-- 功能按钮 -->
      <div class="sider-function-btn">
        <button class="sider-function-btn-item" :class="{'sider-function-btn-item-checked': showUserPosts}" @click="changeShow('posts')">文章</button>
        <button class="sider-function-btn-item" :class="{'sider-function-btn-item-checked': showUserCollects}" @click="changeShow('collects')">收藏</button>
        <button class="sider-function-btn-item" :class="{'sider-function-btn-item-checked': showUserDynamics}" @click="changeShow('dynamics')">动态</button>
      </div>
     </div>
     <!-- 主内容区域 -->
     <div class="main-content">
        <!-- 顶部信息区 - 个人信息和成就信息集合在一个区域 -->
        <div class="top-info-section">
          <!-- 个人信息 -->
          <div class="top-UserInfo">
            <h3>个人信息 <span class="top-edit" @click="openUserInfoModal">(点击修改)</span></h3>
            <p>年级：{{ userInfo.grade }}</p>
            <p>专业：{{ userInfo.major }}</p>
            <p>个人简介：{{ userInfo.summary }}</p>
          </div>
          <!-- 成就信息 -->
          <div class="top-AchievementInfo">
            <h3>成就信息</h3>
            <p>点赞数：{{ lickCounts }}</p>
            <p>收藏数：{{ collectCounts }}</p>
            <p>访问数：{{ pageViews }}</p>
          </div>
        </div>
        
        <!-- 信息展示区域 -->
        <div class="content-area">
          <div v-if="showUserPosts" class="userPost">
            <!-- 用户文章展示区域 -->
            <div class="forum-posts-container">
              <div class="forum-posts">
                <div v-for="post in userPosts.List" :key="post.forum_id" class="forum-post">
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
          <div v-if="showUserCollects" class="userCollect">
            <!-- 用户收藏展示区域 -->
            <div class="forum-posts-container">
              <div class="forum-posts">
                <div v-for="post in userCollects.list" :key="post.forum_id" class="forum-post">
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
                      <button 
                      class="userInfo-follow" 
                      :class="{'followed': post.is_followed}"
                      @click="toggleFollow(post)"
                      >
                        <i class="follow-icon" :class="{'followed': post.is_followed}"></i>
                        {{ post.is_followed ? '已关注' : '关注' }}
                      </button>
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
          <div v-if="showUserDynamics" class="userDynamic">
            <!-- 用户动态展示区域 -->
            <div class="forum-posts-container">
              <div class="forum-posts">
                <div v-for="post in userDynamics.list" :key="post.forum_id" class="forum-post">
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
                      <button 
                      class="userInfo-follow" 
                      :class="{'followed': post.is_followed}"
                      @click="toggleFollow(post)"
                      >
                        <i class="follow-icon" :class="{'followed': post.is_followed}"></i>
                        {{ post.is_followed ? '已关注' : '关注' }}
                      </button>
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


      <!-- 个人信息修改弹窗 -->
    <div v-if="showUserInfoModal" class="modal-overlay" @click="closeUserInfoModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>修改个人信息</h3>
          <button class="close-btn" @click="closeUserInfoModal">×</button>
        </div>
        
        <div class="modal-body">
          <!-- 头像上传区域 -->
          <div class="avatar-upload-section">
            <div class="avatar-preview">
              <img :src="editForm.avatar" alt="头像预览" class="avatar-preview-img"/>
            </div>
            <div class="upload-controls">
              <label class="upload-btn">
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="handleAvatarUpload"
                  class="file-input"
                />
                选择头像
              </label>
              <p class="upload-hint">支持 JPG、PNG 格式，大小不超过 5MB</p>
            </div>
          </div>
          
          <!-- 表单区域 -->
          <div class="form-section">
            <div class="form-group">
              <label>用户名</label>
              <input 
                type="text" 
                v-model="editForm.username" 
                class="form-input"
                placeholder="请输入用户名"
              />
            </div>
            
            <div class="form-group">
              <label>年级</label>
              <select v-model="editForm.grade" class="form-select">
                <option value="大一">大一</option>
                <option value="大二">大二</option>
                <option value="大三">大三</option>
                <option value="大四">大四</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>专业</label>
              <select v-model="editForm.major" class="form-select">
                <option value="计算机科学与技术">计算机科学与技术</option>
                <option value="信息工程">信息工程</option>
                <option value="软件学院">软件学院</option>
                <option value="电子信息工程">电子信息工程</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>个人简介</label>
              <textarea 
                v-model="editForm.summary" 
                class="form-textarea"
                placeholder="请输入个人简介"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeUserInfoModal">取消</button>
          <button class="save-btn" @click="updateUserInfo">保存</button>
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

.forumHomePage-content {
  display: flex;
  height: 100%;
  padding: 20px 20px 0 20px;
  gap: 20px;
  background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
}

/* 侧边栏样式 */
.sider {
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 用户信息区域 */
.sider-userInfo {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #e8f5e8;
}

.userInfo-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #81C784;
  margin-bottom: 15px;
}

.userInfo-text p {
  color: #2e7d32;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 15px 0;
}

/* 社交信息区域 - 去除按钮样式，只保留文字效果 */
.sider-social-info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
}

.social-item {
  color: #455a64;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: default;
  transition: color 0.3s ease;
}

.social-item:hover {
  color: #2e7d32;
}

/* 功能按钮区域 */
.sider-function-btn {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sider-function-btn-item {
  padding: 12px 20px;
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sider-function-btn-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
}

.sider-function-btn-item-checked {
  background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* 顶部信息区 */
.top-info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: 200px; 
}

/* 个人信息和成就信息展示区 */
.top-UserInfo, .top-AchievementInfo {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 15px; 
  display: flex;
  flex-direction: column;
  gap: 10px; 
  height: 100%;
}

.top-UserInfo {
  background: #f8faf8;
  border-radius: 8px;
  border-left: 4px solid #81C784;
  cursor: pointer;
  transition: all 0.3s ease;
}

.top-UserInfo:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.top-AchievementInfo {
  background: #f8faf8;
  border-radius: 8px;
  border-left: 4px solid #81C784;
  transition: all 0.3s ease;
}

.top-UserInfo h3, .top-AchievementInfo h3 {
  color: #2e7d32;
  font-size: 1.1rem;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 2px solid #e8f5e8;
}

.top-edit {
  font-size: 0.7rem; 
  color: #81C784;
  font-weight: normal;
  cursor: pointer;
}

.top-edit:hover {
  color: #4CAF50;
  text-decoration: underline;
}

.top-UserInfo p, .top-AchievementInfo p {
  color: #455a64;
  font-size: 0.85rem; 
  line-height: 1.4;
  margin-bottom: 6px;
}

/* 下方内容区域 */
.content-area {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  min-height: 300px;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border: 2px dashed #81C784;
  color: #2e7d32;
  font-size: 1.2rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* 用户文章展示区域 */
.forum-posts-container {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.forum-posts {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.forum-post {
  display: flex;
  background: #f8faf8;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #81C784;
  width: 100%;
  max-width: 100%;
  margin-bottom: 15px;
}

.forum-post:hover {
  transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.forum-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 0;
}

.content-area::-webkit-scrollbar {
  width: 5px;
}

.content-area::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.content-area::-webkit-scrollbar-thumb {
  background: #81C784;
  border-radius: 4px;
}

.content-area::-webkit-scrollbar-thumb:hover {
  background: #66BB6A;
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

/* 关注按钮 */
.userInfo-follow {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  min-width: 70px;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.userInfo-follow:hover {
  background-color: #3aa676;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
}

.userInfo-follow:active {
  transform: translateY(0);
}

/* 关注图标 */
.follow-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23ffffff%22%3E%3Cpath d=%22M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2%22/%3E%3Ccircle cx=%229%22 cy=%227%22 r=%224%22/%3E%3Cpath d=%22M22 21v-2a4 4 0 0 0-3-3.87M22 7v2a4 4 0 0 1-3 3.87%22/%3E%3C/svg%3E');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: all 0.3s ease;
}

/* 已关注状态 */
.userInfo-follow.followed {
  background-color: #f5f5f5;
  color: #999;
  border: 1px solid #e0e0e0;
}

.userInfo-follow.followed:hover {
  background-color: #ff4d4f;
  color: white;
  border-color: #ff4d4f;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
}

/* 已关注状态的图标 */
.userInfo-follow.followed .follow-icon {
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23999999%22%3E%3Cpath d=%22M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z%22/%3E%3C/svg%3E');
}

.userInfo-follow.followed:hover .follow-icon {
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23ffffff%22%3E%3Cpath d=%22M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2%22 stroke=%22currentColor%22 stroke-width=%222%22/%3E%3C/svg%3E');
}

/* 按钮点击效果 */
.userInfo-follow::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.userInfo-follow:active::before {
  width: 100%;
  height: 100%;
}

/* 按钮文字动画 */
.userInfo-follow span {
  display: inline-block;
  transition: transform 0.3s ease;
}

.userInfo-follow:active span {
  transform: scale(0.95);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .userInfo-follow {
    padding: 6px 12px;
    font-size: 12px;
    min-width: 60px;
  }
  
  .follow-icon {
    width: 12px;
    height: 12px;
  }
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
  font-size: 1.2rem;
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

/* 个人信息修改弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e8f5e8;
}

.modal-header h3 {
  color: #2e7d32;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #2e7d32;
}

.modal-body {
  padding: 20px;
}

/* 头像上传区域 */
.avatar-upload-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8faf8;
  border-radius: 8px;
}

.avatar-preview-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #81C784;
}

.upload-controls {
  flex: 1;
}

.upload-btn {
  display: inline-block;
  padding: 8px 16px;
  background: #81C784;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-bottom: 8px;
}

.upload-btn:hover {
  background: #66BB6A;
}

.file-input {
  display: none;
}

.upload-hint {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

/* 表单区域 */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #2e7d32;
  font-weight: 500;
}

.form-input, .form-select, .form-textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #81C784;
  box-shadow: 0 0 0 2px rgba(129, 199, 132, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e8f5e8;
}

.cancel-btn, .save-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.save-btn {
  background: #81C784;
  color: white;
}

.save-btn:hover {
  background: #66BB6A;
}
</style>
