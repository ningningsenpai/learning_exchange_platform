<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import router from '@/router'

// 获取推荐的书籍
const book = {
  imageList: ['src/static/1.jpg'],
  bookName: 'Vue.js 3 从入门到精通',
  author: '张三',
  version: '第2版',
  publisher: '清华大学出版社',
  price: 99.00,
  isNote: false,
  label: ['Vue.js', '前端开发'],
  seller: '张三',
  sellerImage: 'src/static/image.png'
}
const books = reactive({
  bookList: [book, book, book, book, book, book, book, book, book, book, book, book, book, book, book, book, book, book, book, book, book, book, book, book]
})
const getRecommendBookApi = '/api/getRecommendBook'
const getRecommendBook = async () => {
  try {
    const response = await axios.get(getRecommendBookApi)
    if (response.code == 1) {
          books.bookList = response.data
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    ElMessage.error('获取推荐书籍信息失败，请重试')
  }
}

const gotoDetail = (bookId) => {
  router.push({
    path: '/bookDetail',
    query: {
      bookId: bookId
    }
  })
}

onMounted(() => {
  getRecommendBook()
})

// 搜索部分设置
const searchText = reactive({
  text: ''
})
const search = async () => {
  const searchInfo = searchText.text
  try {
    if(searchInfo == '') {
      ElMessage.error('请输入关键词搜索')
      return
    } else {
      router.push({
        path: '/searchBook',
        query: {
          searchText: searchInfo
        }
      })
    }
  } catch (error) {
    ElMessage.error('搜索书籍信息失败，请重试')
  }
}

</script>

<template>

  <div class="book-container">
    <!-- 顶部区域 -->
    <el-row class="top">
        <div class="search">
          <input 
          type="text" 
          placeholder="请输入关键词搜索" 
          v-model="searchText.text"
          @keyup.enter="search(searchText.text)"
          >
          <button class="book-search-btn" @click="search()">搜索</button>
        </div>
    </el-row>

    <!-- 书籍列表区域 - 卡片式展示 -->
    <div class="book-list-area">
      <div class="book-card" v-for="book in books.bookList" :key="book.id" @click="gotoDetail(book.id)">
        <!-- 书籍图片 -->
        <div class="book-image">
          <el-image
            :src="book.imageList && book.imageList.length > 0 ? book.imageList[0] : 'src/static/1.jpg'"
            fit="contain"
            class="card-image"
          />
        </div>
        <!-- 书籍信息 -->
        <div class="book-info">
          <div class="book-title">{{ book.bookName }}</div>
          <div class="book-author">作者: {{ book.author }}</div>
          <div class="book-version">版本: {{ book.version }}</div>
          <div class="book-publisher">出版社: {{ book.publisher }}</div>
          <div class="book-price">价格: ¥{{ book.price }}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

.book-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.top {
  height: 10%;
  margin-bottom: 10px;
  background-color: #5c947a;
  display: flex;
  flex-direction: row;
  align-items: center;
}

/* 搜索 */
.search {
  position: relative;
  margin-left: auto;
  margin-right: 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.search input {
  width: 280px; 
  height: 40px;
  padding: 0 16px;
  padding-right: 100px;
  border: 2px solid transparent;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.9);
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
  font-weight: 500;
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

/* 书籍列表区域 - 卡片式 */
.book-list-area {
  flex: 1;
  padding: 20px;
  background-color: #cfe8d9;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  /* 确保滚动条样式统一 */
  scrollbar-width: thin;
  scrollbar-color: #8db69f #cfe8d9;
}

/* Webkit浏览器滚动条样式 */
.book-list-area::-webkit-scrollbar {
  width: 8px;
}

.book-list-area::-webkit-scrollbar-track {
  background: #cfe8d9;
  border-radius: 4px;
}

.book-list-area::-webkit-scrollbar-thumb {
  background-color: #8db69f;
  border-radius: 4px;
}

.book-list-area::-webkit-scrollbar-thumb:hover {
  background-color: #5c947a;
}

/* 统一大小的卡片 */
.book-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  /* 缩小卡片高度 */
  height: 280px;
  /* 调整卡片宽度 */
  width: 100%;
  min-width: 180px;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

/* 书籍图片 */
.book-image {
  /* 缩小图片高度 */
  height: 120px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  /* 确保图片区域固定高度 */
  flex-shrink: 0;
}

.card-image {
  max-height: 100%;
  max-width: 100%;
}

/* 书籍信息 */
.book-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
  /* 允许信息区域在固定空间内布局 */
  min-height: 0;
}

.book-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author,
.book-version,
.book-publisher {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-price {
  font-size: 16px;
  font-weight: bold;
  color: #e60012;
  margin-top: auto;
  padding-top: 8px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .search {
    margin-right: 10px;
  }
  
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
  
  .book-list-area {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    padding: 10px;
  }
  
  .book-card {
    height: 250px;
    min-width: 150px;
  }
  
  .book-image {
    height: 100px;
  }
  
  .book-title {
    font-size: 13px;
  }
  
  .book-price {
    font-size: 15px;
  }
}
</style>
