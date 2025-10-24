<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import router from '@/router'

// 测试用例书籍选择的函数部分记得删除

const testbooks = [
  { id: 1, title: 'Vue.js 2 实战', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 99 },
  { id: 2, title: 'Vue.js 3 从入门到精通', author: '梁灏', version: '3.0', publisher: '电子工业出版社', price: 129 },
  { id: 3, title: 'Vue.js 2 企业级开发', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 109 },
  { id: 4, title: 'Vue.js 2 企业级开发', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 109 },
  { id: 5, title: 'Vue.js 2 企业级开发', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 109 },
  { id: 6, title: 'Vue.js 2 企业级开发', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 109 },
  { id: 7, title: 'Vue.js 2 企业级开发', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 109 },
  { id: 8, title: 'Vue.js 2 企业级开发', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 109 },
  { id: 9, title: 'Vue.js 2 企业级开发', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 109 },
  { id: 10, title: 'Vue.js 2 企业级开发', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 109 },
  { id: 11, title: 'Vue.js 2 企业级开发', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 109 },
  { id: 12, title: 'Vue.js 2 企业级开发', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 109 },
  { id: 13, title: 'Vue.js 2 企业级开发', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 109 },
  { id: 14, title: 'Vue.js 2 企业级开发', author: '梁灏', version: '2.0', publisher: '电子工业出版社', price: 109 }
]

// 筛选和排序按钮点击状态修改
const bookTypeBtn = ref('first-type')
const bookSortBtn = ref('first-sort')

// 信息准备
const bookSortByAllApi = '/api/getBookSortByAll'
const otherBookSortByAllApi = '/api/getOtherBookSortByAll'
const bookSortByPriceApi = '/api/getBookSortByPrice'
const otherBookSortByPriceApi = '/api/getOtherBookSortByPrice'
const getRecommendBookApi = '/api/getRecommendBook'

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

// 分页相关配置
const pagination = reactive({
  currentPage: 1,
  total: books.bookList.length > 0 ? books.bookList.length : testbooks.length
})
const pageSize = 9;
const totalPages = computed(() => {
  return Math.ceil(pagination.total / pageSize)
})
// 计算当前页显示的书籍
const currentBooks = computed(() => {
  const bookList = books.bookList.length > 0 ? books.bookList : testbooks
  const start = (pagination.currentPage - 1) * pageSize
  const end = start + pageSize
  return bookList.slice(start, end)
})
// 处理页码变化
const handleCurrentChange = (current) => {
  pagination.currentPage = current
}

// 搜索时各个按钮的状态
const btnStatus = reactive({
  first_type: true,
  second_type: false,
  first_sort: true,
  second_sort: false,
  isNote: false
})
// 按钮点击切换状态
const handleFirstTypeClick = ()=>{
  bookTypeBtn.value = 'first-type'
  btnStatus.first_type = true
  btnStatus.second_type = false
}
const handleSecondTypeClick = ()=>{
  bookTypeBtn.value = 'second-type'
  btnStatus.first_type = false
  btnStatus.second_type = true
}
const handleFirstSortClick = ()=>{
  bookSortBtn.value = 'first-sort'
  btnStatus.first_sort = true
  btnStatus.second_sort = false
}
const handleSecondSortClick = ()=>{
  bookSortBtn.value = 'second-sort'
  btnStatus.first_sort = false
  btnStatus.second_sort = true
}

// 筛选相关变量
const priceFilter = reactive({
  minPrice: '',
  maxPrice: '',
  version: 7
})
const handleNoteFilterChange = () => {
  search() 
}
const applyFilter = () => {
  if (priceFilter.minPrice > priceFilter.maxPrice) {
    ElMessage.error('最小价格不能大于最大价格')
    return
  }
  search()
}

// 搜索相关变量
const searchText = reactive({
  text: ''
})
const search = async() =>{
  const searchInfo = searchText.text
  console.log(priceFilter.version)
  try {
    if(btnStatus.first_type) {
      if(btnStatus.first_sort){
        getBookSortByAll(pageSize, searchInfo, btnStatus.isNote, priceFilter.minPrice, priceFilter.maxPrice, priceFilter.version)
      } else {
        getBookSortByPrice(pageSize, searchInfo, btnStatus.isNote, priceFilter.minPrice, priceFilter.maxPrice, priceFilter.version)
      }
    } else {
      if(btnStatus.first_sort){
        getOtherBookSortByAll(pageSize, searchInfo, btnStatus.isNote, priceFilter.minPrice, priceFilter.maxPrice, priceFilter.version)
      } else {
        getOtherBookSortByPrice(pageSize, searchInfo, btnStatus.isNote, priceFilter.minPrice, priceFilter.maxPrice, priceFilter.version)
      }
    }
  } catch(error) {
    ElMessage.error('获取信息失败，请重试')
  }
}

// 获取根据推荐算法的书籍信息
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

// 从后端获取教材综合排序信息
const getBookSortByAll = async (pageSize, searchInfo, isNote, minPrice, maxPrice, version) => {
  try {
    const response = await axios.get(bookSortByAllApi, {
      params: {
        pageSize,
        searchInfo,
        isNote,
        minPrice,
        maxPrice,
        version
      }
    })
    if (response.code == 1) {
          books.bookList = response.data
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    ElMessage.error('获取教材排序信息失败，请重试')
  }
}
// 从后端获取课外书综合排序信息
const getOtherBookSortByAll = async (pageSize, searchInfo, isNote, minPrice, maxPrice, version) => {
  try {
    const response = await axios.get(otherBookSortByAllApi, {
      params: {
        pageSize,
        searchInfo,
        isNote,
        minPrice,
        maxPrice,
        version
      }
    })
    if (response.code == 1) {
          books.bookList = response.data
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    ElMessage.error('获取课外书排序信息失败，请重试')
  }
}
// 从后端获取教材价格排序信息
const getBookSortByPrice = async (pageSize, searchInfo, isNote, minPrice, maxPrice, version) => {
  try {
    const response = await axios.get(bookSortByPriceApi, {
      params: {
        pageSize,
        searchInfo,
        isNote,
        minPrice,
        maxPrice,
        version
      }
    })
    if (response.code == 1) {
          books.bookList = response.data
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    ElMessage.error('获取教材价格排序信息失败，请重试')
  }
}
// 从后端获取课外书价格排序信息
const getOtherBookSortByPrice = async (pageSize, searchInfo, isNote, minPrice, maxPrice, version) => {
  try {
    const response = await axios.get(otherBookSortByPriceApi, {
      params: {
        pageSize,
        searchInfo,
        isNote,
        minPrice,
        maxPrice,
        version
      }
    })
    if (response.code == 1) {
          books.bookList = response.data
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    ElMessage.error('获取课外书价格排序信息失败，请重试')
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

</script>

<template>
  
  <div class="book-container">
    <!-- 顶部区域 -->
    <el-row class="top">
      <el-col :span="4" class="book-type-btn">
        <button 
          class="type-btn first-type" 
          :class="{'active': bookTypeBtn === 'first-type'}"
          @click="handleFirstTypeClick"
        >
          教材
        </button>
        <button 
          class="type-btn second-type" 
          :class="{'active': bookTypeBtn === 'second-type'}"
          @click="handleSecondTypeClick"
        >
          课外书
        </button>
      </el-col>

      <el-col :span="20" class="sort-search">
        <div class="book-sort-btn">
          <button 
            class="sort-btn first-sort" 
            :class="{'active': bookSortBtn === 'first-sort'}"
            @click="handleFirstSortClick"
          >
            综合推荐
          </button>
          <button 
            class="sort-btn second-sort" 
            :class="{'active': bookSortBtn === 'second-sort'}"
            @click="handleSecondSortClick"
          >
            价格
          </button>
        </div>
        <div class="search">
          <input 
          type="text" 
          placeholder="请输入关键词搜索" 
          v-model="searchText.text"
          @keyup.enter="search(searchText.text)"
          >
          <button class="book-search-btn" @click="search()">搜索</button>
        </div>
      </el-col>
    </el-row>

    <el-row class="content-area">
      <el-col class="sidebar" :span="4">
        <div class="filter-section">
          <h3>筛选条件</h3>
          
          <!-- 是否有笔记筛选 -->
          <div class="filter-item">
            <label class="filter-label">是否有笔记：</label>
            <el-switch 
              v-model="btnStatus.isNote" 
              active-text="是" 
              inactive-text="否"
              @change="handleNoteFilterChange"
            />
          </div>

          <label class="filter-label">版本号：</label>
            <el-input 
              v-model="priceFilter.version" 
              placeholder="请输入版本号(如：2)"
              style="margin-bottom: 10px;"
            />
          
          <!-- 价格筛选 -->
          <div class="filter-item">
            <label class="filter-label">价格范围：</label>
            <div class="price-range">
              <el-input 
                v-model.number="priceFilter.minPrice" 
                placeholder="最低价格"
                type="number"
                style="margin-bottom: 10px;"
              />
              <el-input 
                v-model.number="priceFilter.maxPrice" 
                placeholder="最高价格"
                type="number"
                style="margin-bottom: 10px;"
              />
              <el-button type="primary" @click="applyFilter" size="small">确定</el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="book-show" :span="20">
        <div class="book-item" v-for="book in currentBooks" :key="book.id" @click="gotoDetail(book.id)">
          <span>{{ book.title }}</span>
          <span>作者: {{ book.author }}</span>
          <span>版本: {{ book.version }}</span>
          <span>出版社: {{ book.publisher }}</span>
          <span>价格: ¥{{ book.price }}</span>
        </div>

        <div class="demo-pagination-block">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              layout="prev, pager, next, jumper"
              :total="pagination.total"
              :page-size="pageSize"
              @current-change="handleCurrentChange"
            />
          <div class="total-pages">总共 {{ totalPages }} 页</div>
        </div>
      </el-col>
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

.book-type-btn button {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 4px;
  outline: none;
}

.book-type-btn button:first-of-type {
  margin-left: 25%;
}

.sort-search {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.book-sort-btn button {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  margin-right: 10px;
  border-radius: 4px;
  outline: none;
}

.book-sort-btn:first-of-type {
  margin-left: 3%;
}

/* 默认按钮->教材和综合推荐 */
.type-btn, .sort-btn {
  color: #caffe7;
  opacity: 0.6; 
  cursor: pointer;
  padding: 4px 12px;
  border: none;
  background: transparent;
}

.type-btn.active, .sort-btn.active {
  opacity: 1; 
  font-weight: bold; 
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

/* 侧边栏筛选部分 */
.sidebar {
  height: 100%;
  background-color: #8db69f;
  padding: 20px;
  overflow-y: auto;
}

.filter-section {
  color: white;
}

.filter-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.filter-item {
  margin-bottom: 25px;
}

.filter-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}

.price-range {
  display: flex;
  flex-direction: column;
}

.price-range .el-input {
  margin-bottom: 10px;
}

.price-range .el-button {
  width: 100%;
  background-color: #42b983;
  border-color: #42b983;
}

.price-range .el-button:hover {
  background-color: #3aa676;
  border-color: #3aa676;
}

/* 主体内容部分 */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.sidebar {
  height: 100%;
  background-color: #8db69f;
}

.book-show {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #cfe8d9;
}

.book-item {
  height: 8%;
  width: 94%;
  margin: 6px auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
}

.book-item span {
  width: 20%;
  text-align: center;
}

/* 分页容器样式 */
.demo-pagination-block {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 总页数显示样式 */
.total-pages {
  margin-left: 15px;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

/* 适配Element Plus分页组件的样式 */
:deep(.el-pagination) {
  display: flex;
  align-items: center;
}

/* 调整分页按钮样式 */
:deep(.el-pagination .el-pager li) {
  margin: 0 5px;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
}

/* 调整分页按钮悬停效果 */
:deep(.el-pagination .el-pager li:not(.disabled):hover) {
  color: #409eff;
  border-color: #409eff;
}

/* 调整当前页码样式 */
:deep(.el-pagination .el-pager li.active) {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

/* 调整上一页/下一页按钮样式 */
:deep(.el-pagination button) {
  color: #606266;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  line-height: 30px;
  margin: 0 5px;
}

/* 调整页码输入框样式 */
:deep(.el-pagination__editor) {
  width: 50px;
  height: 32px;
  text-align: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin: 0 5px;
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .demo-pagination-block {
    flex-wrap: wrap;
    flex-direction: column;
    gap: 10px;
  }
  
  .demonstration,
  .total-pages {
    margin: 0;
  }
}

</style>
