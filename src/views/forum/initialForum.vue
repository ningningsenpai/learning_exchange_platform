<script setup>
import { reactive, onMounted, ref} from 'vue';
import { ElMessage} from 'element-plus';
import axios from 'axios';
import router from '@/router'

// 获取当前登录用户的信息(空则未登录)
const userInfo = reactive({
  id: '1',
  username: '张三哈哈哈',
  avatar: 'src/static/image.png'
})
const userInfoApi = '/api/getUserInfo'
const getUserInfo = async () => {
  const response = await axios.get(userInfoApi, { withCredentials: true });
  if (response.data.code === 1) {
    userInfo.id = response.data.data.id;
    userInfo.username = response.data.data.username;
    userInfo.avatar = response.data.data.avatar;
  } else {
    userInfo.id = '';
    userInfo.username = '未登录';
    userInfo.avatar = '';
  }
}

// 获取优秀创作者列表(对象列表)
const OutstandingCreator = reactive({
  id: '1',
  username: '张三哈哈哈',
  avatar: 'src/static/image.png'
})
const outstandingCreators = reactive({
  list: [OutstandingCreator, OutstandingCreator, OutstandingCreator, OutstandingCreator, OutstandingCreator]
})
const OutstandingCreatorApi = '/api/getOutstandingCreator'
const getOutstandingCreator = async () => {
  try {
    const response = await axios.get(OutstandingCreatorApi);
    if (response.data.code === 1) {
      outstandingCreators.list = response.data.data;
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('获取优秀创作者失败');
  }
}



// 获取热门话题列表(帖子对象，仅展示标题，跳转通过id查询内容)
const outstandingTopic = reactive({
  id: '1',
  title: '摸鱼摸鱼好好好好好好快乐'
})
const outstandingTopics = reactive({
  list: [outstandingTopic, outstandingTopic, outstandingTopic, outstandingTopic, outstandingTopic, outstandingTopic, outstandingTopic, outstandingTopic, outstandingTopic, outstandingTopic]
})
const OutstandingTopicApi = '/api/getOutstandingTopic'
const getOutstandingTopic = async () => {
  try {
    const response = await axios.get(OutstandingTopicApi);
    if (response.data.code === 1) {
      outstandingTopics.list = response.data.data;
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('获取热门话题失败');
  }
}


// 筛选按钮状态
const filterActive = ref('');
function handleFilterClick(filterType) {
  filterActive.value = filterType;
  search();
}


// 话题相关状态
const showTopicDropdown = ref(false)
const selectedTopic = ref('')
const topics = ref([
  { id: 1, name: '前端开发' },
  { id: 2, name: '后端开发' },
  { id: 3, name: '移动开发' },
  { id: 4, name: '人工智能' },
  { id: 5, name: '云计算' },
  { id: 6, name: '大数据' },
  { id: 7, name: '区块链' },
  { id: 8, name: '物联网' },
  { id: 9, name: '数据库' },
  { id: 10, name: '网络安全' }
])
// 话题下拉框显示
function toggleTopicDropdown() {
  showTopicDropdown.value = !showTopicDropdown.value
}
// 选择话题
function selectTopic(topic) {
  selectedTopic.value = topic.name
  showTopicDropdown.value = false
  search();
}
// 移除已选话题
function removeTopic() {
  selectedTopic.value = ''
}
// 点击外部关闭下拉框
function handleClickOutside(event) {
  const topicSelector = event.target.closest('.topic-selector')
  if (!topicSelector) {
    showTopicDropdown.value = false
  }
}
// 添加点击外部事件监听
window.addEventListener('click', handleClickOutside)

// 帖子数据获取(对象列表)
const forumPost = reactive({
  user_id: '1',
  title: '这是一个很有趣的帖子标题',
  publish_date: '2024-06-01',
  summary: '这是帖子内容的简要介绍',
  content: '这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的,这是帖子内容的这是帖子内容的这是帖子内容的,这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的.',
  author_name: '张三哈哈哈',
  author_avatar: 'src/static/image.png',
  page_views: 1234,
  lable: ['前端开发', 'Vue.js'],
  cover_avatar: 'src/static/1.jpg',
  type: '原创',
  visible_range: '公开',
  like_count: 456,
  collect_count: 78,
  comment_count: 2,
  subject: '计算机',
  sub_classify: '前端'
})
const forumPosts = reactive({
  list: [forumPost, forumPost, forumPost, forumPost, forumPost, forumPost, forumPost, forumPost]
})
// 获取推荐帖子对象列表
const getForumPostsApi = '/api/getRecommendedPosts'
const getForumPosts = async () => {
  try {
    const response = await axios.get(getForumPostsApi);
    if (response.data.code === 1) {
      forumPosts.list = response.data.data;
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('获取推荐帖子失败');
  }
}

// 搜索框内容
const searchText = reactive({
  text: ''
})
const searchApi = '/api/getAllPosts'
const buttonSearch = async () => {
  if (searchText.text.trim() === '') {
    ElMessage.warning('请输入搜索关键词');
    return;
  }
  const collation = filterActive.value;
  const topic = selectedTopic.value;
  try {
    console.log(searchText.text, filterActive.value, selectedTopic.value);
    const response = await axios.get(searchApi, {
      params: {
        keyword: searchText.text,
        collation: collation,
        topic: topic
      }
    });
    if (response.data.code === 1) {
      forumPosts.list = response.data.data;
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('搜索帖子失败');
  } 
} 
const search = async () => {
  const collation = filterActive.value;
  const topic = selectedTopic.value;
  try {
    console.log(searchText.text, collation, topic);
    const response = await axios.get(searchApi, {
      params: {
        keyword: searchText.text,
        collation: collation,
        topic: topic
      }
    });
    if (response.data.code === 1) {
      forumPosts.list = response.data.data;
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('搜索帖子失败');
  } 
}


// onMounted(() => {
//   getUserInfo();
//   getOutstandingCreator();
//   getOutstandingTopic();
//   getForumPosts();
// })

</script>

<template>
  
  <div class="initial-forum">
    <!-- 侧边信息栏 -->
    <div class="sider">
      <!-- 侧边用户信息 -->
      <div class="sider-userInfo">
        <img :src="userInfo.avatar" alt="" class="userInfo-avatar"/>
        <div class="userInfo-text">
          <p>{{ userInfo.username }}</p>
        </div>
        <button class="userInfo-btn" v-if="userInfo.id">创作者主页</button>
      </div>
      <!-- 侧边优秀创作者 -->
      <div class="sider-OutstandingCreator">
        <h3>优秀创作者</h3>
        <div v-for="(creator, index) in outstandingCreators.list" :key="creator.id">
          <!-- 序号 -->
          <p class="OutstandingCreator-index">{{ index + 1 }}</p>
          <img :src="creator.avatar" alt="" class="OutstandingCreator-avatar"/>
          <div class="OutstandingCreator-name">
            <p>{{ creator.username }}</p>
          </div>
        </div>
      </div>
      <!-- 侧边热门话题 -->
      <div class="sider-OutstandingTopic">
        <h3>近日热点</h3>
        <div v-for="(topic, index) in outstandingTopics.list" :key="topic.id">
          <!-- 序号 -->
          <p class="OutstandingTopic-index">{{ index + 1 }}</p>
          <p class="OutstandingTopic-title">{{ topic.title }}</p>
        </div>
      </div>
    </div>

    <!-- 内容栏 -->
    <div class="content">
      <!-- 搜索框 -->
      <div class="search">
        <div class="search-container">
              <input 
                type="text" 
                placeholder="请输入关键词搜索" 
                v-model="searchText.text"
                @keyup.enter="search"
              >
              <button class="book-search-btn" @click="buttonSearch">搜索</button>
        </div>
      </div>
      <!-- 筛选区域 -->
      <div class="filter">
        <div class="filter-left">
          <button class="filter-btn" :class="{'active': filterActive === 'all'}" @click="handleFilterClick('all')">综合</button>
          <button class="filter-btn" :class="{'active': filterActive === 'hot'}" @click="handleFilterClick('hot')">热门</button>
          <button class="filter-btn" :class="{'active': filterActive === 'new'}" @click="handleFilterClick('new')">最新</button>
        </div>
        <div class="filter-right">
          <!-- 话题选择区域 -->
          <div class="topic-selector">
            <button class="filter-btn topic-btn" @click="toggleTopicDropdown">
              {{ selectedTopic || '话题' }}
              <span v-if="selectedTopic" class="remove-topic" @click.stop="removeTopic">&times;</span>
            </button>
            <!-- 话题下拉弹窗 -->
            <div v-if="showTopicDropdown" class="topic-dropdown">
              <div v-for="topic in topics" :key="topic.id" class="topic-item" @click="selectTopic(topic)">
                {{ topic.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
       <!-- 论坛帖子展示区域 -->
      <div class="forum-posts">
        <div v-for="forum in forumPosts.list" :key="forum.id" class="forum-post">
          <div class="forum-main">
            <!-- 发帖用户信息 -->
            <div class="forum-userInfo">
              <div class="userInfo-avatar-container">
                <img :src="forum.author_avatar" alt="用户头像" class="forum-userInfo-avatar"/>
              </div>
              <div class="userInfo-details">
                <p class="userInfo-name">{{ forum.author_name }}</p>
                <p class="userInfo-stats">发帖 {{ forum.publish_count || 0 }} · 粉丝 {{ forum.follower_count || 0 }}</p>
              </div>
              <button class="userInfo-follow">
                <i class="follow-icon"></i>
                关注
              </button>
            </div>
            
            <!-- 帖子标题和简介 -->
            <div class="forum-content">
              <h2 class="forum-title">{{ forum.title }}</h2>
              <p class="forum-summary">{{ forum.summary }}</p>
            </div>
            
            <!-- 帖子数据展示 -->
            <div class="forum-data">
              <span v-for="label in forum.label" :key="label" class="forum-label">#{{ label }}</span>
              <span class="forum-viewCount">浏览量:{{ forum.page_views }}</span>
              <span class="forum-replyCount">评论量:{{ forum.comment_count }}</span>
              <span class="forum-likeCount">点赞量:{{ forum.like_count }}</span>
              <span class="forum-collectCount">收藏量:{{ forum.collect_count }}</span>
            </div>
          </div>
          
          <!-- 帖子封面图,右侧 -->
          <div class="forum-coverAvatar">
            <img :src="forum.cover_avatar" alt="帖子封面" class="cover-avatar-img"/>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>

.initial-forum {
  display: flex;
  height: 100%;
  width: 100%;
}

/* 侧边栏 */
.sider {
  width: 18%;
  height: 100%;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
}

/* 侧边用户信息 */
.sider-userInfo {
  height: 8%;
  background-color: rgb(234, 252, 245);
  display: flex;
  flex-direction: row;
  align-items: center;
}

.userInfo-avatar {
  height: 90%;
  width: auto;
  margin: 0 10px;
  border-radius: 50%;
}

.userInfo-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.userInfo-btn {
  margin-left: auto;
  padding: 5px;
  border-radius: 10px;
  margin-right: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 80px;
  text-align: center;
  line-height: 1.5;
}

/* 侧边优秀创作者 */
.sider-OutstandingCreator {
  height: 40%;
  background-color: rgb(189, 252, 231);
  margin: 10px 0;
  padding: 12px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /* 滚动条缩小 */
  scrollbar-width: thin;
  scrollbar-color: rgba(66, 185, 131, 0.3) transparent;
}

/* Webkit浏览器滚动条样式 */
.sider-OutstandingCreator::-webkit-scrollbar {
  width: 6px;
}

.sider-OutstandingCreator::-webkit-scrollbar-track {
  background: transparent;
}

.sider-OutstandingCreator::-webkit-scrollbar-thumb {
  background-color: rgba(66, 185, 131, 0.3);
  border-radius: 3px;
}

.sider-OutstandingCreator::-webkit-scrollbar-thumb:hover {
  background-color: rgba(66, 185, 131, 0.5);
}

.sider-OutstandingCreator h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.sider-OutstandingCreator > div {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 6px 8px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.sider-OutstandingCreator > div:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateX(2px);
}

/* 序号样式 */
.OutstandingCreator-index {
  width: 20px;
  height: 20px;
  background-color: #42b983;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 8px;
  font-size: 11px;
  margin: 0 8px 0 0;
  padding: 0;
  flex-shrink: 0;
}

/* 前三名特殊样式 */
.sider-OutstandingCreator > div:nth-child(2) .OutstandingCreator-index {
  background-color: #FFD700;
  color: #333;
}

.sider-OutstandingCreator > div:nth-child(3) .OutstandingCreator-index {
  background-color: #C0C0C0;
}

.sider-OutstandingCreator > div:nth-child(4) .OutstandingCreator-index {
  background-color: #CD7F32;
}

/* 头像样式 */
.OutstandingCreator-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  border: 1px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 用户名样式 */
.OutstandingCreator-name {
  flex: 1;
}

.OutstandingCreator-name p {
  margin: 0;
  font-size: 12px;
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 侧边热门话题 */
.sider-OutstandingTopic {
  height: 51%;
  background-color: rgb(181, 248, 226);
  padding: 12px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(66, 185, 131, 0.3) transparent;
}

/* Webkit浏览器滚动条样式 */
.sider-OutstandingTopic::-webkit-scrollbar {
  width: 6px;
}

.sider-OutstandingTopic::-webkit-scrollbar-track {
  background: transparent;
}

.sider-OutstandingTopic::-webkit-scrollbar-thumb {
  background-color: rgba(66, 185, 131, 0.3);
  border-radius: 3px;
}

.sider-OutstandingTopic::-webkit-scrollbar-thumb:hover {
  background-color: rgba(66, 185, 131, 0.5);
}

.sider-OutstandingTopic h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  position: relative;
  padding-bottom: 6px;
}

.sider-OutstandingTopic h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: #42b983;
  border-radius: 1px;
}

/* 热点项目 */
.sider-OutstandingTopic > div {
  margin-bottom: 10px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  border-left: 3px solid transparent;
  position: relative;
  overflow: hidden;
  min-height: 25px;
  border-bottom: 1px solid #656565;
}

.sider-OutstandingTopic > div:hover {
  background-color: rgba(255, 255, 255, 0.4);
  border-left-color: #42b983;
  transform: translateX(2px);
}

/* 序号样式 */
.OutstandingTopic-index {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #42b983;
  color: white;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: bold;
  border-radius: 0 0 0 4px;
  margin: 0;
  z-index: 1;
}

/* 前三名特殊样式 */
.sider-OutstandingTopic > div:nth-child(2) {
  border-left-color: #FFD700;
  font-weight: bold;
  color: #d4af37;
}

.sider-OutstandingTopic > div:nth-child(2) .OutstandingTopic-index {
  background-color: #FFD700;
  color: #333;
  padding: 4px 10px;
  font-size: 12px;
}

.sider-OutstandingTopic > div:nth-child(3) {
  border-left-color: #C0C0C0;
  font-weight: 600;
  color: #666;
}

.sider-OutstandingTopic > div:nth-child(3) .OutstandingTopic-index {
  background-color: #C0C0C0;
  color: #333;
  padding: 4px 10px;
  font-size: 11px;
}

.sider-OutstandingTopic > div:nth-child(4) {
  border-left-color: #CD7F32;
  font-weight: 600;
  color: #8b4513;
}

.sider-OutstandingTopic > div:nth-child(4) .OutstandingTopic-index {
  background-color: #CD7F32;
  color: white;
  padding: 4px 10px;
  font-size: 11px;
}

/* 话题标题样式 */
.OutstandingTopic-title {
  margin: 0;
  font-size: 13px;
  color: #333;
  font-weight: 500;
  padding-right: 28px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 25px;
}


/* 内容栏 */
.content {
  flex: 1;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 搜索 */
.search {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 10%;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search input {
  width: 280px; 
  height: 40px;
  padding: 0 16px;
  padding-right: 100px;
  border: 2px solid #e0e0e0; 
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  background-color: white; 
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search input:focus {
  border-color: #42b983;
  background-color: white;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
  width: 320px; 
}

.search input::placeholder {
  color: #999;
  font-size: 14px;
  transition: color 0.3s ease;
}

.search input:focus::placeholder {
  color: #ccc;
}

.book-search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  padding: 0 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(66, 185, 131, 0.3);
}

.book-search-btn:hover {
  background-color: #3aa676;
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.4);
  transform: translateY(-50%) translateY(-1px); 
}

.book-search-btn:active {
  transform: translateY(-50%) translateY(0);
  box-shadow: 0 2px 4px rgba(66, 185, 131, 0.3);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .search input {
    width: 200px;
    padding-right: 80px;
  }
  
  .search input:focus {
    width: 220px;
  }
  
  .book-search-btn {
    padding: 0 16px;
    font-size: 13px;
  }
  
  .top {
    padding: 0 10px;
  }
}

/* 筛选区域 */
.filter {
  height: 6%;
  background-color: white;
  border: 1px solid lightgray;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  position: relative;
}

.filter-left {
  display: flex;
  gap: 15px;
}

.filter-right {
  position: relative;
}

.filter-btn {
  background: none;
  border: none;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 0;
  transition: color 0.3s ease;
  position: relative;
}

.filter-btn:hover {
  color: #42b983;
}

.filter-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #42b983;
  transition: width 0.3s ease;
}

.filter-btn:hover::after {
  width: 100%;
}

.filter-btn.active {
  color: #42b983;
  font-weight: 600;
}

.filter-btn.active::after {
  width: 100%;
  height: 2px;
  background-color: #42b983;
}

/* 话题选择器样式 */
.topic-selector {
  position: relative;
}

.topic-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 60px;
}

.remove-topic {
  color: #999;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.remove-topic:hover {
  color: #ff4d4f;
}

/* 话题下拉弹窗样式 */
.topic-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background-color: white;
  border: 1px solid lightgray;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.topic-item {
  padding: 8px 12px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.topic-item:hover {
  background-color: #f5f5f5;
}

/* 自定义滚动条样式 */
.topic-dropdown::-webkit-scrollbar {
  width: 4px;
}

.topic-dropdown::-webkit-scrollbar-track {
  background: transparent;
}

.topic-dropdown::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.topic-dropdown::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

/* 论坛帖子展示区域 */
.forum-posts {
  flex: 1;
  overflow-y: auto;
  padding: 10px 20px;
}

/* 添加帖子区域自定义滚动条样式 */
.forum-posts::-webkit-scrollbar {
  width: 6px;
}

.forum-posts::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.forum-posts::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.forum-posts::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .initial-forum {
    flex-direction: column;
    height: auto;
  }
  
  .content {
    overflow: visible;
  }
  
  .forum-posts {
    overflow-y: visible;
    padding: 10px;
  }
}

.forum-post {
  background-color: white;
  margin: 10px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  transition: box-shadow 0.3s ease;
}

.forum-post:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.forum-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 用户信息区域优化 */
.forum-userInfo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.userInfo-avatar-container {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #f0f0f0;
  transition: border-color 0.3s ease;
}

.forum-userInfo-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.forum-post:hover .userInfo-avatar-container {
  border-color: #42b983;
}

.forum-userInfo-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.userInfo-details {
  flex: 1;
}

.userInfo-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.userInfo-stats {
  font-size: 12px;
  color: #999;
  margin: 0;
}

/* 关注按钮优化 */
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
}

.userInfo-follow:hover {
  background-color: #3aa676;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
}

.userInfo-follow:active {
  transform: translateY(0);
}

.follow-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23ffffff%22%3E%3Cpath d=%22M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2%22/%3E%3Ccircle cx=%229%22 cy=%227%22 r=%224%22/%3E%3Cpath d=%22M22 21v-2a4 4 0 0 0-3-3.87M22 7v2a4 4 0 0 1-3 3.87%22/%3E%3C/svg%3E');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* 帖子内容样式 */
.forum-content {
  flex: 1;
}

.forum-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  transition: color 0.3s ease;
  cursor: pointer;
}

.forum-title:hover {
  color: #42b983;
}

.forum-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 帖子数据样式 */
.forum-data {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid #f5f5f5;
}

.forum-label {
  font-size: 12px;
  color: #42b983;
  background-color: #f0f9f4;
  padding: 3px 10px;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.forum-label:hover {
  background-color: #42b983;
  color: white;
}

.forum-viewCount,
.forum-replyCount,
.forum-likeCount,
.forum-collectCount {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

.forum-viewCount::before,
.forum-replyCount::before,
.forum-likeCount::before,
.forum-collectCount::before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.forum-viewCount::before {
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23999999%22%3E%3Cpath d=%22M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z%22/%3E%3C/svg%3E');
}

.forum-replyCount::before {
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23999999%22%3E%3Cpath d=%22M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z%22/%3E%3C/svg%3E');
}

.forum-likeCount::before {
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23999999%22%3E%3Cpath d=%22M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z%22/%3E%3C/svg%3E');
}

.forum-collectCount::before {
  background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23999999%22%3E%3Cpath d=%22M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z%22/%3E%3C/svg%3E');
}

/* 封面图样式 */
.forum-coverAvatar {
  flex-shrink: 0;
  width: 160px;
  height: 160px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.forum-post:hover .forum-coverAvatar {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cover-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.forum-post:hover .cover-avatar-img {
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .forum-post {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
  
  .forum-coverAvatar {
    width: 100%;
    height: 200px;
  }
  
  .forum-data {
    justify-content: center;
  }
}
</style>
