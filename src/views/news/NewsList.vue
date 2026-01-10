<template>
  <div class="news-list-container">
    <!-- 新闻列表头部 -->
    <div class="news-header">
      <div class="header-content">
        <h1 class="page-title">校园新闻</h1>
        <p class="page-subtitle">了解校园最新动态和重要通知</p>
      </div>
    </div>

    <!-- 新闻筛选区域 -->
    <div class="news-filter">
      <div class="filter-options">
        <button
            class="filter-btn"
            :class="{ 'active': activeFilter === 'all' }"
            @click="changeFilter('all')"
        >
          全部新闻
        </button>
        <button
            class="filter-btn"
            :class="{ 'active': activeFilter === 'recent' }"
            @click="changeFilter('recent')"
        >
          最近更新
        </button>
        <button
            class="filter-btn"
            :class="{ 'active': activeFilter === 'hot' }"
            @click="changeFilter('hot')"
        >
          热门新闻
        </button>
      </div>
      <div class="search-box">
        <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索新闻标题或内容..."
            class="search-input"
            @keyup.enter="searchNews"
        />
        <button class="search-btn" @click="searchNews">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 新闻列表内容 -->
    <div class="news-content">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner">
          <svg width="50" height="50" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#e0e0e0" stroke-width="4" fill="none"/>
            <circle cx="12" cy="12" r="10" stroke="#42b983" stroke-width="4" fill="none"
                    stroke-dasharray="62.8" stroke-dashoffset="62.8" stroke-linecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
            </circle>
          </svg>
          <p>加载中...</p>
        </div>
      </div>

      <div v-else-if="newsList.length === 0" class="empty-state">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#ccc" stroke-width="2" stroke-linecap="round"/>
          <path d="M10.5 10.5l-3 3m0 0l3 3m-3-3h6" stroke="#ccc" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <h3>没有找到相关新闻</h3>
        <p v-if="searchKeyword">尝试其他搜索关键词</p>
        <p v-else>暂时没有新闻内容</p>
      </div>

      <div v-else class="news-items">
        <div
            v-for="news in newsList"
            :key="news.id"
            class="news-item"
            @click="goToNewsDetail(news.id)"
        >
          <div class="news-item-content">
            <div class="news-image" v-if="news.avatar">
              <img :src="news.avatar" :alt="news.title" />
            </div>
            <div class="news-info">
              <div class="news-header">
                <h3 class="news-title">{{ news.title }}</h3>
                <span class="news-date">{{ formatDate(news.publish_date) }}</span>
              </div>
              <p class="news-summary">{{ news.summary }}</p>
              <div class="news-meta">
                <span class="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  {{ news.click_count || 0 }}次阅读
                </span>
                <span class="meta-item category-tag" v-if="news.category">
                  {{ news.category }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页控制 -->
      <div v-if="totalPages > 1" class="pagination">
        <button
            class="pagination-btn prev"
            :disabled="currentPage === 1"
            @click="prevPage"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          上一页
        </button>

        <div class="page-numbers">
          <button
              v-for="page in visiblePages"
              :key="page"
              class="page-number"
              :class="{ 'active': page === currentPage }"
              @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <span v-if="showEllipsis" class="page-ellipsis">...</span>
        </div>

        <button
            class="pagination-btn next"
            :disabled="currentPage === totalPages"
            @click="nextPage"
        >
          下一页
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {ElMessage} from "element-plus";

const router = useRouter()

// 响应式数据
const newsList = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const searchKeyword = ref('')
const activeFilter = ref('all')

// 计算属性
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  // 调整起始位置
  start = Math.max(1, end - maxVisible + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
const showEllipsis = computed(() => totalPages.value > 5 && currentPage.value < totalPages.value - 2)

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

// 获取新闻列表
const fetchNewsList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value
    }

    // 根据筛选条件添加参数
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }
    if (activeFilter.value === 'recent') {
      params.sort = 'date_desc'
    } else if (activeFilter.value === 'hot') {
      params.sort = 'click_desc'
    }

    const getNewsApi='/api/getNewsList'
    const response = await axios.get(getNewsApi, {
      params: {
        limit: 10
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if (response.data.code === 1) {
      newsList.value = response.data.data
    } else {
      console.error('获取新闻列表失败:', response.data.msg)
      newsList.value = []
      totalCount.value = 0
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    console.error('获取新闻列表失败:', error)
    newsList.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索新闻
const searchNews = () => {
  currentPage.value = 1
  fetchNewsList()
}

// 改变筛选条件
const changeFilter = (filter) => {
  activeFilter.value = filter
  currentPage.value = 1
  fetchNewsList()
}

// 分页操作
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchNewsList()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchNewsList()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPage = (page) => {
  if (page !== currentPage.value) {
    currentPage.value = page
    fetchNewsList()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 跳转到新闻详情
const goToNewsDetail = (newsId) => {
  router.push({
    path: '/newsDetail',
    query: { id: newsId }
  })
}

// 初始加载
onMounted(() => {
  fetchNewsList()
})
</script>

<style scoped>
.news-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 页面头部 */
.news-header {
  margin: 30px 0 40px;
  text-align: center;
}

.page-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 18px;
  color: #666;
}

/* 筛选区域 */
.news-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.filter-options {
  display: flex;
  gap: 15px;
}

.filter-btn {
  padding: 8px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #42b983;
  color: #42b983;
}

.filter-btn.active {
  background: #42b983;
  border-color: #42b983;
  color: white;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  width: 250px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2px solid #42b983;
  background: white;
  color: #42b983;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #42b983;
  color: white;
}

/* 新闻列表 */
.news-content {
  min-height: 500px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.loading-spinner {
  text-align: center;
  color: #666;
}

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

.news-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-item {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.news-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #42b983;
}

.news-item-content {
  display: flex;
  gap: 25px;
}

.news-image {
  flex-shrink: 0;
  width: 180px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-info {
  flex: 1;
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.news-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-date {
  font-size: 14px;
  color: #999;
  margin-left: 15px;
  white-space: nowrap;
}

.news-summary {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-meta {
  display: flex;
  gap: 20px;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #999;
}

.category-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  border: none;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 40px 0 30px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #42b983;
  color: #42b983;
  background: rgba(66, 185, 131, 0.05);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
  align-items: center;
}

.page-number {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-number:hover {
  border-color: #42b983;
  color: #42b983;
}

.page-number.active {
  background: #42b983;
  border-color: #42b983;
  color: white;
}

.page-ellipsis {
  color: #999;
  padding: 0 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .news-filter {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .filter-options {
    justify-content: center;
  }

  .search-box {
    width: 100%;
  }

  .search-input {
    flex: 1;
    width: auto;
  }

  .news-item-content {
    flex-direction: column;
  }

  .news-image {
    width: 100%;
    height: 200px;
  }

  .news-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .news-date {
    margin-left: 0;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .page-numbers {
    order: 1;
    width: 100%;
    justify-content: center;
    margin: 10px 0;
  }
}

@media (max-width: 480px) {
  .news-list-container {
    padding: 0 15px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .filter-btn {
    padding: 6px 15px;
    font-size: 13px;
  }

  .pagination-btn {
    padding: 8px 15px;
    font-size: 13px;
  }

  .page-number {
    min-width: 35px;
    height: 35px;
    font-size: 13px;
  }
}
</style>