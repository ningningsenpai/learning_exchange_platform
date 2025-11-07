<script setup>
import { reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import router from '@/router'

// 获取购物车中的商品
const shoppingCarList = reactive({
  bookList: [
    {
      id: 1,
      imageList: ['src/static/1.jpg'],
      bookName: 'Vue.js 3 从入门到精通',
      author: '张三',
      version: '第2版',
      publisher: '清华大学出版社',
      price: 99.00,
      isNote: false,
      number: 1,
      label: ['Vue.js', '前端开发'],
      sellerId: 1,
      seller: '张三',
      sellerImage: 'src/static/image.png'
    },
    {
      id: 2,
      imageList: ['src/static/2.jpg'],
      bookName: 'Vue.js 3 从入门到精通',
      author: '张三',
      version: '第2版',
      publisher: '清华大学出版社',
      price: 99.00,
      isNote: false,
      number: 2,
      label: ['Vue.js', '前端开发'],
      sellerId: 1,
      seller: '张三',
      sellerImage: 'src/static/image.png'
    },
    {
      id: 2,
      imageList: ['src/static/2.jpg'],
      bookName: 'Vue.js 3 从入门到精通',
      author: '张三',
      version: '第2版',
      publisher: '清华大学出版社',
      price: 99.00,
      isNote: false,
      number: 2,
      label: ['Vue.js', '前端开发'],
      sellerId: 1,
      seller: '张三',
      sellerImage: 'src/static/image.png'
    }
  ]
}) 
const getShoppingCarApi = '/api/getShoppingCar'
const getShoppingCar = async () => {
  try {
    const response = await axios.get(getShoppingCarApi);
    if (response.data.code === 1) {
      // 为每个商品添加checked属性用于勾选功能
      shoppingCarList.bookList = response.data.data.map(book => ({
        ...book,
        checked: false
      }));
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('获取购物车失败');
  }
}
onMounted(() => {
  getShoppingCar();
})

// 计算购物车中商品的总数量
const totalNumber = computed(() => {
  return shoppingCarList.bookList.length
});

// 计算购物车中商品的总金额
const totalPrice = computed(() => {
  return shoppingCarList.bookList.reduce((total, book) => total + book.price * book.number, 0);
});

// 搜索商品
const searchApi = '/api/searchShoppingCar'
const searchText = reactive({
  text: ''
})
const search = async() => {
  const searchInfo = searchText.text
  try {
    const response = await axios.post(searchApi, {
      keyword: searchInfo
    });
    if (response.data.code === 1) {
      shoppingCarList.bookList = response.data.data.map(book => ({
        ...book,
        checked: false
      }));
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('搜索商品失败');
  }
}

// 更新购物车商品数量
const updateQuantity = async (book, newNumber) => {
  const bookId = book.id
  const currentNumber = book.number
  if (newNumber + currentNumber <= 0) {
    ElMessage.error('商品数量不能小于1');
    return;
  } else {
    book.number += newNumber
    try {
        const response = await axios.post('/api/updateShoppingCar', {
          bookId,
          number: newNumber
        });
        if (response.data.code === 1) {
          ElMessage.success('更新成功');
        } else {
          ElMessage.error(response.data.msg);
        }
    } catch (error) {
      ElMessage.error('更新失败');
    }
  }
}

// 全选/取消全选
const pickAll = () => {
  const isAllChecked = shoppingCarList.bookList.every(book => book.checked);
  shoppingCarList.bookList.forEach(book => book.checked = !isAllChecked);
}

// 删除选中商品
const deleteSelectedItems = async () => {
  shoppingCarList.bookList = shoppingCarList.bookList.filter(book => !book.checked);
  try {
    const response = await axios.post('/api/deleteShoppingCarBatch', {
      bookIds: shoppingCarList.bookList.filter(book => book.checked).map(book => book.id)
    });
    if (response.data.code === 1) {
      ElMessage.success('删除成功');
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('删除失败');
  }
}

// 删除指定商品
const deleteItem = async (bookId) => {
  // 从购物车列表中删除指定商品
  shoppingCarList.bookList = shoppingCarList.bookList.filter(book => book.id !== bookId);
  try {
    const response = await axios.post('/api/deleteShoppingCarById', {
      bookIds: [bookId]
    });
    if (response.data.code === 1) {
      ElMessage.success('删除成功');
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('删除失败');
  }
}

// 跳转到商品详情页
const goToDetail = (bookId) => {
  router.push({
    path: '/bookDetail',
    query: {
      bookId: bookId
    }
  });
}
</script>

<template>
  <div class="shopping-car-container">
    <div class="top">
      <el-row class="top-row">
        <!-- 左侧区域 -->
        <el-col :span="6" class="function-btn">
          <span class="goods-count">共 {{ totalNumber }} 件商品</span>
          <div class="btn-group">
            <button class="pickAll-btn" @click="pickAll">全选</button>
            <button class="delete-btn" @click="deleteSelectedItems">删除</button>
          </div>
        </el-col>
        
        <!-- 中间搜索区域 -->
        <el-col :span="12" class="search">
          <div class="search-container">
              <input 
                type="text" 
                placeholder="请输入关键词搜索" 
                v-model="searchText.text"
                @keyup.enter="search"
              >
              <button class="book-search-btn" @click="search">搜索</button>
          </div>
        </el-col>
        
        <!-- 右侧结算区域 -->
        <el-col :span="6" class="goods-payment">
          <span class="total-price">共 <span class="price-value">{{ totalPrice.toFixed(2) }}</span> 元</span>
          <button class="payment-btn">结算</button>
        </el-col>
      </el-row>
    </div>
    <div class="goods-show">
      <!-- 购物车为空时显示 -->
      <div v-if="shoppingCarList.bookList.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <div class="empty-text">购物车空空如也</div>
        <button class="go-shopping-btn" @click="router.push('/book')">去逛逛</button>
      </div>
      
      <!-- 购物车有商品时显示 -->
      <div v-else class="cart-items">
        <!-- 商品列表 -->
        <div class="cart-item" v-for="book in shoppingCarList.bookList" :key="book.id" @click="goToDetail(book.id)">
          <div class="col checkbox-col">
            <input type="checkbox" class="item-checkbox" v-model="book.checked">
          </div>
          <div class="col image-col">
            <img :src="book.imageList[0]" alt="书籍封面" class="book-image">
          </div>
          <div class="col info-col">
            <div class="book-title">{{ book.bookName }}</div>
            <div class="book-author">作者: {{ book.author }}</div>
            <div class="book-publisher">出版社: {{ book.publisher }}</div>
          </div>
          <div class="col price-col">¥{{ book.price.toFixed(2) }}</div>
          <div class="col quantity-col">
            <div class="quantity-control">
              <button class="quantity-btn minus" @click="updateQuantity(book, -1)">-</button>
              <span class="quantity-value">{{ book.number }}</span>
              <button class="quantity-btn plus" @click="updateQuantity(book, 1)">+</button>
            </div>
          </div>
          <div class="col total-col">¥{{ (book.price * book.number).toFixed(2) }}</div>
          <div class="col action-col">
            <button class="delete-item-btn" @click="deleteItem(book.id)">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shopping-car-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.top {
  height: 12%;
  background-color: #ffffff;
  border: 2px solid #8db69f;
}

.top-row {
  align-items: center;
  height: 100%;
}

.goods-count {
  font-size: 16px;
  color: #606266;
  line-height: 1.5;
  margin-left: 40px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.function-btn {
  display: flex;
  flex-direction: column; 
  height: 100%; 
}

.btn-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  margin-top: auto;
  margin-left: 20px;
  margin-bottom: 10px;
}

.pickAll-btn, .delete-btn {
  font-size: 12px;
  color: white;
  padding: 6px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #8db69f;
  transition: all 0.3s ease;
}

.pickAll-btn:hover {
  background-color: #5c947a;
  transform: translateY(-2px);
}

.delete-btn {
  background-color: #f44d4d;
}

.delete-btn:hover {
  background-color: #4a7d65;
  transform: translateY(-2px);
}

/* 搜索 */
.search {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
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

/* 结算区域 */
.goods-payment {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 40px;
  height: 100%;
}

.total-price {
  font-size: 16px;
  color: black;
  line-height: 1.5;
  margin-right: 20px;
}

.price-value {
  font-size: 18px;
  color: #f44d4d;
  line-height: 1.5;
}

.payment-btn {
  font-size: 14px;
  color: white;
  padding: 10px 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #8db69f;
  transition: all 0.3s ease;
}

.payment-btn:hover {
  background-color: #5c947a;
  transform: translateY(-2px);
}

/* 商品展示区域样式 */
.goods-show {
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  overflow-y: auto;
}

/* 空购物车样式 */
.empty-cart {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 18px;
  margin-bottom: 20px;
}

.go-shopping-btn {
  padding: 10px 20px;
  background-color: #8db69f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 购物车商品列表样式 */
.cart-items {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.cart-item {
  display: flex;
  padding: 12px 15px; 
  border-bottom: 1px solid #f5f5f5; 
  align-items: center;
  transition: background-color 0.2s; 
}

.cart-item:hover {
  background-color: #fafafa;
}

.col {
  flex: 1; 
  min-width: 0; 
}


.checkbox-col {
  flex: 0 0 50px; 
  text-align: center;
}

.image-col {
  flex: 0 0 70px; 
}

.info-col {
  flex: 0 0 200px; 
  padding: 0 15px; 
  min-width: 180px; 
}


.quantity-col {
  flex: 0 0 100px; 
  text-align: center;
}

.price-col {
  flex: 3; 
  text-align: center;
  font-weight: 500; 
}


.total-col {
  flex: 0 0 90px; 
  text-align: center;
  color: #f44d4d;
  font-weight: 500;
}


.action-col {
  flex: 0 0 70px; 
  text-align: center;
}


.book-image {
  width: 50px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
}


.book-title {
  font-weight: 500;
  margin-bottom: 3px; 
  font-size: 14px; 
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis; 
}

.book-author, .book-publisher {
  color: #666;
  font-size: 12px;
  margin-bottom: 2px;
  line-height: 1.3; 
}

.quantity-control {
  display: inline-flex;
  align-items: center;
}

.quantity-btn {
  width: 24px; 
  height: 24px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-value {
  width: 36px;
  text-align: center;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding: 3px 0; 
  font-size: 13px;
}

.delete-item-btn {
  color: #000000;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  padding: 4px 8px;
}
</style>