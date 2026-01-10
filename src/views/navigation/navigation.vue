[file name]: Home.vue
[file content begin]
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

// 平台介绍数据
const platformInfo = reactive({
  title: '知识交流平台',
  description: '汇聚校园智慧，促进学术交流',
  features: [
    '专注学术讨论，分享专业知识',
    '建立学习社群，结交同好伙伴',
    '获取最新资讯，了解校园动态',
    '参与热门话题，发表个人见解'
  ],
  stats: {
    users: '10,000+',
    posts: '50,000+',
    discussions: '200,000+'
  }
})

// 新闻数据
const newsList = ref([])
const loading = ref(false)

// 获取新闻数据
const getNewsApi = '/api/getNewsList'
const getNews = async () => {
  try {
    loading.value = true
    const response = await axios.get(getNewsApi, {
      params: {
        limit: 4 // 只获取4条新闻用于首页展示
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if (response.data.code === 1) {
      newsList.value = response.data.data
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    console.error('获取新闻失败:', error)
  } finally {
    loading.value = false
  }
}

// 进入论坛按钮点击事件
const handleEnterForum = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再进入论坛')
    router.push('/login')
  } else {
    router.push('/initialForum')
  }
}

// 查看更多新闻
const handleViewMoreNews = () => {
  router.push('/news')
}

// 点击新闻项
const handleNewsClick = (newsId) => {
  // 跳转到新闻详情页
  router.push({
    path: '/newsDetail',
    query: { newsId }
  })
}

onMounted(() => {
  getNews()
})

</script>

<template>
  <div class="home-container">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h1 class="banner-title">{{ platformInfo.title }}</h1>
        <p class="banner-subtitle">{{ platformInfo.description }}</p>
        <div class="banner-stats">
          <div class="stat-item">
            <span class="stat-number">{{ platformInfo.stats.users }}</span>
            <span class="stat-label">注册用户</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ platformInfo.stats.posts }}</span>
            <span class="stat-label">主题帖子</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ platformInfo.stats.discussions }}</span>
            <span class="stat-label">讨论互动</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧：平台介绍和功能 -->
      <div class="left-section">
        <div class="platform-intro">
          <h2 class="section-title">平台介绍</h2>
          <div class="intro-content">
            <p class="intro-text">
              欢迎来到校园知识交流平台！我们致力于为全校师生提供一个高质量的学术交流社区。
              在这里，你可以分享专业知识、讨论学术问题、获取校园资讯、交流期末周难题
            </p>
            <div class="features-list">
              <div
                  v-for="(feature, index) in platformInfo.features"
                  :key="index"
                  class="feature-item"
              >
                <svg class="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#42b983" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>{{ feature }}</span>
              </div>
            </div>
            <div class="action-section">
              <button class="enter-forum-btn" @click="handleEnterForum">
                立即进入论坛
              </button>
              <p class="login-hint">
                {{ userStore.isLoggedIn ? '欢迎回来！' : '首次使用需要登录' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：新闻动态 -->
      <div class="right-section">
        <div class="news-section">
          <div class="section-header">
            <h2 class="section-title">校园新闻动态</h2>
            <button class="view-more-btn" @click="handleViewMoreNews">
              更多
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="news-list">
            <div v-if="loading" class="loading-state">
              <svg class="loading-spinner" width="40" height="40" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#e0e0e0" stroke-width="4" fill="none"/>
                <circle cx="12" cy="12" r="10" stroke="#42b983" stroke-width="4" fill="none"
                        stroke-dasharray="62.8" stroke-dashoffset="62.8" stroke-linecap="round">
                  <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                </circle>
              </svg>
              <p>加载新闻中...</p>
            </div>
            <div v-else class="news-items">
              <div
                  v-for="news in newsList"
                  :key="news.id"
                  class="news-item"
                  @click="handleNewsClick(news.id)"
              >
                <div class="news-header">
                  <h3 class="news-title">{{ news.title }}</h3>
                  <span class="news-date">{{ news.publish_date }}</span>
                </div>
                <p class="news-abstract">{{ news.summary }}</p>
                <div class="news-footer">
                  <span class="news-views">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    {{ news.click_count }} 阅读
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部指引 -->
    <div class="bottom-guide">
      <h3 class="guide-title">如何开始？</h3>
      <div class="guide-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>注册账号</h4>
            <p>使用手机号注册，验证后即可加入社区</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>完善资料</h4>
            <p>填写专业、年级等信息，找到志同道合的伙伴</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>参与讨论</h4>
            <p>浏览热门话题，发表你的见解和问题</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h4>持续互动</h4>
            <p>关注感兴趣的用户，建立学术社交网络</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 50px 40px;
  margin: 30px 0 40px;
  color: white;
  text-align: center;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.banner-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
}

.banner-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 30px;
}

.banner-stats {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

/* 主要内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 50px;
}

.left-section,
.right-section {
  display: flex;
  flex-direction: column;
}

/* 平台介绍 */
.platform-intro {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 100%;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.intro-text {
  color: #666;
  line-height: 1.6;
  margin-bottom: 25px;
  font-size: 15px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #555;
  font-size: 14px;
}

.feature-icon {
  flex-shrink: 0;
}

.action-section {
  text-align: center;
  margin-top: 30px;
}

.enter-forum-btn {
  background: linear-gradient(135deg, #42b983 0%, #3aa676 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(66, 185, 131, 0.3);
  width: 100%;
  max-width: 300px;
}

.enter-forum-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(66, 185, 131, 0.4);
}

.enter-forum-btn:active {
  transform: translateY(0);
}

.login-hint {
  color: #999;
  font-size: 13px;
  margin-top: 10px;
}

/* 新闻区域 */
.news-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-more-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: 1px solid #e0e0e0;
  color: #666;
  border-radius: 15px;
  padding: 6px 15px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-more-btn:hover {
  border-color: #42b983;
  color: #42b983;
  background: rgba(66, 185, 131, 0.05);
}

.news-list {
  height: calc(100% - 60px);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
}

.loading-spinner {
  margin-bottom: 15px;
}

.news-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-item {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.news-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.news-item:hover {
  transform: translateX(5px);
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.news-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-date {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
  white-space: nowrap;
}

.news-abstract {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.news-views {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #999;
}

/* 底部指引 */
.bottom-guide {
  background: white;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.guide-title {
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 40px;
}

.guide-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.step {
  text-align: center;
}

.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin: 0 auto 20px;
}

.step-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.step-content p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .guide-steps {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px 20px;
  }
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .welcome-banner {
    padding: 30px 20px;
    margin: 20px 0 30px;
  }

  .banner-title {
    font-size: 28px;
  }

  .banner-stats {
    gap: 30px;
  }

  .stat-number {
    font-size: 24px;
  }

  .guide-steps {
    grid-template-columns: 1fr;
  }

  .enter-forum-btn {
    padding: 12px 30px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .home-container {
    padding: 0 15px;
  }

  .banner-stats {
    flex-direction: column;
    gap: 20px;
  }

  .section-title {
    font-size: 20px;
  }

  .platform-intro,
  .news-section,
  .bottom-guide {
    padding: 20px;
  }
}
</style>