<template>
  <div class="news-detail-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-content">
        <svg class="loading-spinner" width="60" height="60" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#e0e0e0" stroke-width="4" fill="none"/>
          <circle cx="12" cy="12" r="10" stroke="#42b983" stroke-width="4" fill="none"
                  stroke-dasharray="62.8" stroke-dashoffset="62.8" stroke-linecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <p>加载新闻详情...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ff4757" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <h3>加载失败</h3>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchNewsDetail">
        重新加载
      </button>
    </div>

    <!-- 新闻详情内容 -->
    <div v-else-if="newsDetail" class="news-detail-content">
      <!-- 返回按钮 -->
      <div class="back-section">
        <button class="back-btn" @click="goBack">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          返回新闻列表
        </button>
      </div>

      <!-- 新闻头部 -->
      <div class="news-header">
        <h1 class="news-title">{{ newsDetail.title }}</h1>
        <div class="news-meta">
          <span class="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            {{ formatDate(newsDetail.publish_date) }}
          </span>
          <span class="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
            {{ newsDetail.click_count || 0 }} 次阅读
          </span>
        </div>
      </div>

      <!-- 新闻封面图 -->
      <div v-if="newsDetail.avatar" class="news-cover">
        <img :src="newsDetail.avatar" :alt="newsDetail.title" />
      </div>

      <!-- 新闻摘要 -->
      <div v-if="newsDetail.summary" class="news-summary">
        <div class="summary-content">
          <h3>内容摘要</h3>
          <p>{{ newsDetail.summary }}</p>
        </div>
      </div>

      <!-- 新闻正文 -->
      <div class="news-body">
        <div class="news-content" v-html="formatContent(newsDetail.content)"></div>
      </div>

      <!-- 新闻操作栏 -->
      <div class="news-actions">
        <button class="action-btn share-btn" @click="shareNews">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          分享
        </button>
        <button class="action-btn print-btn" @click="printNews">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M6 14h12v8H6z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          打印
        </button>
      </div>

      <!-- 相关新闻推荐 -->
      <div v-if="relatedNews.length > 0" class="related-news">
        <h3 class="related-title">相关新闻推荐</h3>
        <div class="related-list">
          <div
              v-for="related in relatedNews"
              :key="related.id"
              class="related-item"
              @click="goToNewsDetail(related.id)"
          >
            <h4 class="related-item-title">{{ related.title }}</h4>
            <span class="related-item-date">{{ formatDate(related.publish_date) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 无数据状态 -->
    <div v-else class="empty-state">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
        <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ccc" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <h3>新闻内容不存在</h3>
      <p>该新闻可能已被删除或不存在</p>
      <button class="back-to-list-btn" @click="goBack">
        返回新闻列表
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

// 响应式数据
const newsDetail = ref(null)
const relatedNews = ref([])
const loading = ref(true)
const error = ref(null)

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 格式化新闻内容（简单处理，可根据需要扩展）
const formatContent = (content) => {
  if (!content) return ''
  // 将换行符转换为br标签
  return content.replace(/\n/g, '<br>')
}

// 获取新闻详情
const fetchNewsDetail = async () => {
  loading.value = true
  error.value = null

  const newsId = route.query.id
  if (!newsId) {
    error.value = '新闻ID不能为空'
    loading.value = false
    return
  }
  const getNewsDetailApi='/api/getNewsDetail'
  try {
    // 获取新闻详情
    const response = await axios.get(getNewsDetailApi, {
      params: {
        id: newsId
      }
    })

    if (response.data.code === 1) {
      newsDetail.value = response.data.data
    } else {
      error.value = response.data.msg || '获取新闻详情失败'
      newsDetail.value = null
    }
  } catch (err) {
    console.error('获取新闻详情失败:', err)
    error.value = '网络错误，请稍后重试'
    newsDetail.value = null
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到新闻详情
const goToNewsDetail = (newsId) => {
  router.push({
    path: '/newsDetail',
    query: { id: newsId }
  })
}

// 分享功能
const shareNews = () => {
  if (navigator.share) {
    navigator.share({
      title: newsDetail.value.title,
      text: newsDetail.value.summary,
      url: window.location.href
    }).catch(console.error)
  } else {
    // 备用分享方案
    const shareUrl = window.location.href
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('链接已复制到剪贴板，可以分享给朋友了！')
    }).catch(() => {
      prompt('请复制以下链接分享：', shareUrl)
    })
  }
}

// 打印功能
const printNews = () => {
  window.print()
}

// 初始加载
onMounted(() => {
  fetchNewsDetail()
})
</script>

<style scoped>
.news-detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.loading-content {
  text-align: center;
  color: #666;
}

.loading-spinner {
  margin-bottom: 20px;
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.error-state h3 {
  margin: 20px 0 10px;
  color: #333;
}

.error-state p {
  margin-bottom: 20px;
}

.retry-btn {
  background: #42b983;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 24px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #3aa676;
  transform: translateY(-1px);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state h3 {
  margin: 20px 0 10px;
  color: #333;
}

.empty-state p {
  margin-bottom: 20px;
}

.back-to-list-btn {
  background: #42b983;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 24px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-to-list-btn:hover {
  background: #3aa676;
  transform: translateY(-1px);
}

/* 返回按钮 */
.back-section {
  margin: 30px 0 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #e0e0e0;
  color: #666;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  border-color: #42b983;
  color: #42b983;
  background: rgba(66, 185, 131, 0.05);
}

/* 新闻头部 */
.news-header {
  margin-bottom: 30px;
}

.news-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  line-height: 1.3;
  margin-bottom: 15px;
}

.news-meta {
  display: flex;
  gap: 25px;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

/* 新闻封面 */
.news-cover {
  width: 100%;
  max-height: 500px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.news-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 新闻摘要 */
.news-summary {
  background: #f8f9fa;
  border-left: 4px solid #42b983;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
}

.summary-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.summary-content p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* 新闻正文 */
.news-body {
  margin-bottom: 40px;
}

.news-content {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.news-content ::v-deep(p) {
  margin-bottom: 1.5em;
}

.news-content ::v-deep(h2) {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 30px 0 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.news-content ::v-deep(h3) {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 25px 0 12px;
}

.news-content ::v-deep(ul),
.news-content ::v-deep(ol) {
  margin-bottom: 1.5em;
  padding-left: 2em;
}

.news-content ::v-deep(li) {
  margin-bottom: 0.5em;
}

.news-content ::v-deep(a) {
  color: #42b983;
  text-decoration: none;
  border-bottom: 1px solid rgba(66, 185, 131, 0.3);
}

.news-content ::v-deep(a:hover) {
  border-bottom-color: #42b983;
}

.news-content ::v-deep(blockquote) {
  border-left: 4px solid #42b983;
  margin: 1.5em 0;
  padding-left: 1.5em;
  color: #666;
  font-style: italic;
}

/* 新闻操作栏 */
.news-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 40px 0;
  padding: 20px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #42b983;
  color: #42b983;
  background: rgba(66, 185, 131, 0.05);
}

/* 相关新闻推荐 */
.related-news {
  margin-top: 40px;
}

.related-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.related-item {
  padding: 15px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-item:hover {
  border-color: #42b983;
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.related-item-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.related-item-date {
  font-size: 13px;
  color: #999;
}

/* 打印样式 */
@media print {
  .back-section,
  .news-actions,
  .related-news {
    display: none;
  }

  .news-detail-container {
    padding: 0;
  }

  .news-title {
    font-size: 24px;
  }

  .news-content {
    font-size: 14px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .news-detail-container {
    padding: 0 15px 30px;
  }

  .news-title {
    font-size: 24px;
  }

  .news-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .news-cover {
    max-height: 300px;
  }

  .news-content {
    font-size: 15px;
  }

  .news-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .action-btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .news-title {
    font-size: 20px;
  }

  .news-summary {
    padding: 20px;
  }

  .summary-content h3 {
    font-size: 16px;
  }

  .summary-content p {
    font-size: 14px;
  }

  .related-title {
    font-size: 20px;
  }
}
</style>