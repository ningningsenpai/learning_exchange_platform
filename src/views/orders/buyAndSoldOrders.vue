<script setup>
import { reactive, onMounted } from 'vue';
import { ElMessage, ElRow, ElCol } from 'element-plus';
import axios from 'axios';
import router from '@/router'

// 购买订单和售出订单切换按钮
const orderInfoChangeBtn = reactive({ 
  buyOrder: true, 
  soldOrder: false 
});

// 订单列表数据
const orderList = reactive({ 
  detailList: [] 
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
        <el-col :span="8" class="table-header-col title-col">
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
  background-color: white;
}

</style>