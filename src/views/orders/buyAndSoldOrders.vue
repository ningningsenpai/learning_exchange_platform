<script setup>
import { reactive, onMounted } from 'vue';
import { ElMessage, ElRow, ElCol } from 'element-plus';
import axios from 'axios';
import router from '@/router'

// 订单信息字段
const orderDetail = {
  orderTime: '2023-12-12 12:00:00',
  orderId: '1234567890',
  paymentWay: '支付宝',
  image: 'src/static/1.jpg',
  bookId: 1,
  bookName: 'Vue 从入门到精通',
  author: '张三',
  publisher: '清华大学出版社',
  price: 99.99,
  bookCount: 2,
  userName: '李四',
  address: '北京市海淀区',
  orderStatus: '已完成',
  completeTime: '',
  sellerId: 1
}

// 购买订单和售出订单切换按钮
const orderInfoChangeBtn = reactive({ 
  buyOrder: true, 
  soldOrder: false 
});

// 订单列表数据
const orderList = reactive({ 
  detailList: [orderDetail, orderDetail, orderDetail, orderDetail] 
})
const getBuyOrdersApi = '/api/getBuyOrders'
const getSoldOrdersApi = '/api/getSoldOrders'
// 统一的订单数据获取函数
const fetchOrders = async(params = {}) => {
  const api = orderInfoChangeBtn.buyOrder ? getBuyOrdersApi : getSoldOrdersApi;
  try {
    const response = await axios.get(api, { params });
    if(response.data.code == 1) {
      orderList.detailList = response.data.data;
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('获取订单数据失败，请稍后重试');
  }
}

// 订单切换按钮点击事件
const btnClick = (type) => {
  orderInfoChangeBtn.buyOrder = (type === 'buyOrder');
  orderInfoChangeBtn.soldOrder = (type === 'soldOrder');
  fetchOrders(); 
}

onMounted(() => {
  fetchOrders(); 
})

// 搜索内容
const searchText = reactive({ text: '' });
// 筛选条件
const orderFilter = reactive({ timeFilter: '', statusFilter: '' });
const search = () => {
  console.log(searchText.text, orderFilter)
  fetchOrders({
    keyword: searchText.text,
    timeFilter: orderFilter.timeFilter,
    statusFilter: orderFilter.statusFilter
  });
}

// 订单状态类名映射（css修饰使用）
const getStatusClass = (status) => {
  switch (status) {
    case '已支付':
      return 'status-paid';
    case '已完成':
      return 'status-completed';
    case '已取消':
      return 'status-cancelled';
    default:
      return 'status-default';
  }
}
const goToPath = orderInfoChangeBtn.buyOrder ? '/buyOrderDetail' : '/soldOrderDetail'
const orderDetailClick = (choosePath, orderId) => {
  router.push({
    path: choosePath,
    query: {
      orderId: orderId
    }
  })
}

</script>

<template>
  <div class="table-container">
    <!-- 购买订单/售出订单切换以及搜索栏 -->
    <div class="top">
      <div class="orderInfo-change-btn">
        <button 
          class="tab-btn"
          :class="{'active': orderInfoChangeBtn.buyOrder}" 
          @click="btnClick('buyOrder')"
        >
          购买订单
        </button>
        <button 
          class="tab-btn"
          :class="{'active': orderInfoChangeBtn.soldOrder}" 
          @click="btnClick('soldOrder')"
        >
          售出订单
        </button>
      </div>
      <div class="search">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="请输入关键词搜索" 
            v-model="searchText.text"
            @keyup.enter="search"
          >
          <button class="book-search-btn" @click="search">搜索</button>
        </div>
      </div>
    </div>
    
    <!-- 筛选条件以及表头信息 -->
    <div class="table-head">
      <el-row type="flex" class="header-row">
        <!-- 筛选条件区域 -->
        <el-col :span="6" class="filter-col">
          <div class="order-filter-btn">
            <!-- 根据时间筛选订单 -->
            <div class="filter-wrapper">
              <el-select 
                v-model="orderFilter.timeFilter" 
                placeholder="时间"
                class="custom-select"
              >
                <el-option value="" label="时间" @click="search"></el-option>
                <el-option value="7" label="最近7天" @click="search"></el-option>
                <el-option value="30" label="最近30天" @click="search"></el-option>
                <el-option value="90" label="最近90天" @click="search"></el-option>
                <el-option value="91" label="90天以前" @click="search"></el-option>
              </el-select>
            </div>
            <!-- 根据状态筛选 -->
            <div class="filter-wrapper">
              <el-select 
                v-model="orderFilter.statusFilter" 
                placeholder="状态"
                class="custom-select"
              >
                <el-option value="" label="状态" @click="search"></el-option>
                <el-option value="1" label="已支付" @click="search"></el-option>
                <el-option value="2" label="已完成" @click="search"></el-option>
                <el-option value="3" label="已取消" @click="search"></el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        <!-- 表头列 -->
        <el-col :span="9" class="table-header-col title-col">
          订单信息
        </el-col>
        <el-col :span="3" class="table-header-col">
          收货人
        </el-col>
        <el-col :span="3" class="table-header-col">
          金额
        </el-col>
        <el-col :span="3" class="table-header-col">
          状态
        </el-col>
      </el-row>
    </div>
    
    <!-- 订单信息列表-->
    <div class="table-body">
      <div class="order-card" v-for="orderDetail in orderList.detailList" :key="orderDetail.orderId" @click="orderDetailClick(goToPath, orderDetail.orderId)">
        <!-- 订单基本信息 -->
        <div class="orderBase-info">
          <span class="obi-text">交易时间：<span class="obi-value">{{ orderDetail.orderTime }}</span></span>
          <span class="obi-text">订单编号：<span class="obi-value">{{ orderDetail.orderId }}</span></span>
          <span class="obi-text">支付方式：<span class="obi-value">{{ orderDetail.paymentWay }}</span></span>
        </div>
        
        <!-- 订单详情信息 -->
        <div class="orderDetail-info">
          <el-row class="order-row">
            <!-- 书籍信息区域 -->
            <el-col :span="10" class="book-info-section">
              <div class="book-item">
                <img :src="orderDetail.image" alt="" class="book-cover">
                <div class="book-info">
                  <h4 class="book-name">{{ orderDetail.bookName }}</h4>
                  <p class="book-author">作者：{{ orderDetail.author }}</p>
                  <p class="book-publisher">出版社：{{ orderDetail.publisher }}</p>
                </div>
              </div>
            </el-col>
            
            <!-- 价格和数量列 -->
            <el-col :span="5" class="order-col">
              <span class="price-quantity">
                <span class="highlight-price">¥{{ orderDetail.price }}</span>
                <span class="quantity-separator"> × </span>
                <span class="normal-quantity">{{ orderDetail.bookCount }}</span>
              </span>
            </el-col>
            
            <!-- 收货人信息 -->
            <el-col :span="3" class="order-col">
              <span class="odi-value">{{ orderDetail.userName }}</span>
            </el-col>
            
            <!-- 总金额 -->
            <el-col :span="3" class="order-col">
              <span class="odi-value total-amount">¥{{ orderDetail.price * orderDetail.bookCount }}</span>
            </el-col>
            
            <!-- 订单状态 -->
            <el-col :span="3" class="order-col">
              <span class="status-badge" :class="getStatusClass(orderDetail.orderStatus)">{{ orderDetail.orderStatus }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 顶部区域布局 */
.top {
  height: 10%;
  background-color: #ffffff;
  border: 2px solid #8db69f;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.orderInfo-change-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 20px;
}

.search {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 20px;
  flex: 1;
}

/* 订单切换按钮样式 */
.tab-btn {
  background: transparent;
  border: none;
  color: #666;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 20px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  outline: none;
}

.tab-btn:hover {
  color: #42b983;
  transform: translateY(-1px);
}

/* 激活状态样式 */
.tab-btn.active {
  color: #42b983;
  font-weight: 600;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background-color: #42b983;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.tab-btn:hover::after {
  width: 20px;
}

.tab-btn.active:hover::after {
  width: 40px;
}

/* 搜索样式 */
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

/* 表头部分样式 */
.table-head {
  height: 8%;
  background-color: #ffffff;
  border: 2px solid #8db69f;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.header-row {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

/* 筛选条件区域样式 */
.filter-col {
  padding-left: 20px;
  display: flex;
  align-items: center;
}

.order-filter-btn {
  display: flex;
  gap: 15px;
  align-items: center;
}

.filter-wrapper {
  position: relative;
}

/* 自定义选择框样式 - 去除element原有颜色设置，修改为主题色 */
.custom-select {
  width: 120px;
  height: 32px;
  background-color: white;
}

:deep(.custom-select .el-select__wrapper) {
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px !important;
  transition: all 0.3s ease !important;
  box-shadow: none !important;
}

:deep(.custom-select .el-select__wrapper:hover) {
  border-color: #42b983 !important;
  box-shadow: 0 0 0 1px rgba(66, 185, 131, 0.1) !important;
}

:deep(.custom-select .el-select__wrapper.is-focus) {
  border-color: #42b983 !important;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2) !important;
}

:deep(.custom-select .el-select__icon) {
  color: #999 !important;
}

:deep(.custom-select .el-select__icon:hover) {
  color: #42b983 !important;
}

.el-select-dropdown__item.selected {
  color: #42b983 !important;
  font-weight: 500 !important;
}

::v-deep(.el-select-dropdown__item.selected) {
  color: #42b983 !important;
  font-weight: 500 !important;
}

:v-deep(.el-select-dropdown__item:hover) {
  background-color: rgba(66, 185, 131, 0.08) !important;
}



/* 表头列样式 - 添加水平居中 */
.table-header-col {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  border-right: 1px solid #e8e8e8;
}

.table-header-col:last-child {
  border-right: none;
}

.title-col {
  padding-right: 60px;
}

/* 表格主体样式 */
.table-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

/* 订单卡片样式 */
.order-card {
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  overflow: hidden;
  margin-bottom: 12px;
}

.order-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
  border-color: #42b983;
}

/* 订单基本信息样式 */
.orderBase-info {
  padding: 12px 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.obi-text {
  font-size: 12px;
  color: #666;
}

.obi-value {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

/* 订单详情信息样式 */
.orderDetail-info {
  padding: 16px;
}

.order-row {
  display: flex;
  align-items: center;
  height: 100%;
}

/* 书籍信息区域 */
.book-info-section {
  display: flex;
  align-items: center;
  padding-right: 16px;
}

.book-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.book-cover {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.book-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.book-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-author {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.book-publisher {
  font-size: 12px;
  color: #666;
}

/* 价格和数量样式 */
.price-quantity {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.highlight-price {
  font-size: 16px;
  color: #ff6b6b;
  font-weight: 600;
}

.quantity-separator {
  font-size: 13px;
  color: #666;
}

.normal-quantity {
  font-size: 14px;
  color: #666;
}

.price-quantity::before {
  display: block;
  font-size: 11px;
  color: #999;
  margin-bottom: 2px;
}

/* 订单列样式 */
.order-col {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  height: 100%;
}

.odi-value {
  font-size: 13px;
  color: #333;
}

.total-amount {
  font-weight: 600;
  color: #ff6b6b;
  font-size: 14px;
}

/* 状态徽章样式 */
.status-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-paid {
  background-color: #e8f5e9;
  color: #43a047;
}

.status-completed {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-cancelled {
  background-color: #ffebee;
  color: #d32f2f;
}

.status-default {
  background-color: #f5f5f5;
  color: #757575;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .orderBase-info {
    gap: 12px;
  }
  
  .book-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .book-cover {
    width: 50px;
    height: 68px;
  }
}

@media (max-width: 768px) {
  .table-body {
    padding: 10px;
  }
  
  .orderBase-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 10px 14px;
  }
  
  .orderDetail-info {
    padding: 14px;
  }
  
  .order-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .book-info-section,
  .order-col {
    width: 100%;
    justify-content: flex-start;
  }
  
  .price-quantity::before {
    text-align: left;
  }
}

</style>