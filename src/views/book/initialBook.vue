<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import router from '@/router'

// 获取推荐的书籍
const book = {
  imageList: [],
  bookName: '',
  author: '',
  version: '',
  publisher: '',
  price: 0,
  isNote: false,
  label: [],
  seller: '',
  sellerImage: ''
}
const books = reactive({
  bookList: []
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
  right: 8px; /* 调整位置 */
  top: 50%;
  transform: translateY(-50%); /* 垂直居中 */
  height: 32px;
  padding: 0 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 16px; /* 圆角设计 */
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
}

</style>
