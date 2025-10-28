<script setup>
import { reactive, onMounted } from 'vue';
import { ElMessage, ElRow, ElCol } from 'element-plus';
import axios from 'axios';
import router from '@/router'

// 订单详情数据
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
  completeTime: '2023-12-12 12:00:00',
  sellerId: 1
}
// 书籍信息
const bookInfo = reactive({
  id: 1,
  imageList: [
    'src/static/1.jpg',
    'src/static/2.jpg',
    'src/static/1.jpg',
    'src/static/2.jpg',
    'src/static/1.jpg'
  ],
  bookName: '习近平新时代中国特色社会主义思想概论',
  author: '张三',
  version: '第七版',
  publisher: '人民出版社',
  price: 91.00,
  number: 2,
  isNote: false,
  label: [
    "计算机",
    "机器学习"
  ],
  seller: '鸡哥',
  sellerImage: 'src/static/image.png'
})

// 获取跳转传输的订单ID
const orderId = router.currentRoute.value.query.orderId

// 获取订单详情
const getBuyOrderDetailApi = '/api/getBuyOrderById'
const getBuyOrderDetail = async () => {
  try {
    const response = await axios.get(getBuyOrderDetailApi, {
      params: {
        orderId: orderId
      }
    })
    if (response.data.code === 1) {
      orderDetail = response.data.data
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('获取订单详情失败')
  }
}
// 根据书籍ID获取书籍详情
const getBookInfoByIdApi = '/api/getBookInfoById'
const getBookInfoById = async () => {
  if (!bookId) 
    return
  try {
    const response = await axios.get(getBookInfoByIdApi, {
      params: {
        bookId: bookId.value
      }
    })
    if (response.data.code === 1 && response.data.data) {
      Object.assign(bookInfo, response.data.data)
    }
  } catch (error) {
    console.error('获取书籍信息失败:')
  }
}
onMounted(() => {
  getBuyOrderDetail()
  getBookInfoById()
})

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

</script>

<template>
<div class="info-container">
    <!-- 订单编号 -->
    <div class="order-id-section">
      <div class="info-label">订单编号：</div>
      <div class="info-value order-id">{{ orderDetail.orderId }}</div>
    </div>

    <div class="divider"></div>
    <!-- 订单基本信息  -->
    <div class="order-info-section">
      <div class="info-column">
        <div class="info-row">
          <div class="info-label">下单时间：</div>
          <div class="info-value">{{ orderDetail.orderTime }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">支付方式：</div>
          <div class="info-value">{{ orderDetail.paymentWay }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">订单状态：</div>
          <div class="info-value" :class="getStatusClass(orderDetail.orderStatus)">{{ orderDetail.orderStatus }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">收货时间：</div>
          <div class="info-value" v-if="orderDetail.orderStatus === '已完成'">
            {{ orderDetail.completeTime}}
          </div>
          <div class="info-value" v-else-if="orderDetail.orderStatus === '已取消'">已取消</div>
          <div class="info-value" v-else>订单未完成</div>
        </div>
      </div>
      
      <div class="info-column">
        <div class="info-row">
          <div class="info-label">收货人：</div>
          <div class="info-value">{{ orderDetail.userName }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">收货地址：</div>
          <div class="info-value address">{{ orderDetail.address }}</div>
        </div>
      </div>
    </div>
    
    <div class="divider"></div>
    <!-- 书籍详情信息 -->
    <div class="book-info-section">
      <div class="book-image">
        <img :src="bookInfo.imageList[0]" alt="{{ bookInfo.bookName }}">
      </div>
      <div class="book-details">
        <div class="info-row">
          <div class="info-label">书籍名称：</div>
          <div class="info-value book-name">{{ bookInfo.bookName }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">作者：</div>
          <div class="info-value">{{ bookInfo.author }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">出版社：</div>
          <div class="info-value">{{ bookInfo.publisher }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">价格：</div>
          <div class="info-value price">¥{{ bookInfo.price.toFixed(2) }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">购买数量：</div>
          <div class="info-value">{{ bookInfo.number || bookInfo.bookCount }}</div>
        </div>
      </div>
      
      <!-- 总价格放在最右侧 -->
      <div class="total-price-section">
        <div class="total-price-label">总价格：</div>
        <div class="total-price-value">
          ¥{{ (orderDetail.price * orderDetail.bookCount).toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- 功能按钮 -->
    <div class="function-section">
      <button class="contact-seller-btn">联系卖家</button>
      <div class="right-buttons">
        <button class="refund-btn">申请退款</button>
        <button class="confirm-receipt-btn">确认收货</button>
      </div>
    </div>
  </div>
  
</template>

<style scoped>

.info-container {
  width: 100%;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  margin-top: 40px;
  border: 1px solid #c8c8c8;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.12);
}

/* 分割线样式 */
.divider {
  height: 1px;
  background-color: #e8e8e8;
  margin: 12px 0;
  position: relative;
}

.divider::before {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 0 10px;
  color: #999;
  font-size: 14px;
}

/* 订单编号区域 */
.order-id-section {
  padding: 10px 0;
}

.order-id {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

/* 订单基本信息区域 - 两列布局 */
.order-info-section {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding: 12px 0;
}

.info-column {
  flex: 1;
  min-width: 280px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.info-label {
  font-size: 14px;
  color: #666;
  width: 100px;
  flex-shrink: 0;
}

.info-value {
  font-size: 14px;
  color: #333;
  flex: 1;
}

/* 订单状态样式 - 只修改字体颜色，不修改背景 */
.status-pending { color: #ff9800; font-weight: 500; }
.status-paid { color: #43a047; font-weight: 500; }
.status-shipped { color: #4caf50; font-weight: 500; }
.status-completed { color: #1976d2; font-weight: 500; }
.status-cancelled { color: #d32f2f; font-weight: 500; }
.status-refunding { color: #ff6b6b; font-weight: 500; }
.status-default { color: #757575; font-weight: 500; }

.address {
  word-break: break-word;
  line-height: 1.4;
}

/* 书籍信息区域 */
.book-info-section {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  gap: 24px;
}

.book-image {
  width: 100px;
  height: 136px;
  flex-shrink: 0;
}

.book-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.book-details {
  flex: 1;
  min-width: 0;
}

.book-name {
  font-weight: 500;
  font-size: 16px;
  color: #333;
}

.price {
  color: #ff6b6b;
  font-weight: 500;
}

/* 总价格区域 */
.total-price-section {
  flex-shrink: 0;
  text-align: right;
  margin-left: auto;
}

.total-price-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.total-price-value {
  font-size: 22px;
  font-weight: 600;
  color: #ff6b6b;
}

/* 功能按钮区域 - 使用统一的绿色调 */
.function-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.right-buttons {
  display: flex;
  gap: 12px;
}

button {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.contact-seller-btn {
  background-color: #e8f5e9;
  color: #43a047;
  border: 1px solid #c8e6c9;
}

.contact-seller-btn:hover {
  background-color: #c8e6c9;
  color: #2e7d32;
}

.refund-btn {
  background-color: #fff3e0;
  color: #f57c00;
  border: 1px solid #ffe0b2;
}

.refund-btn:hover {
  background-color: #ffe0b2;
  color: #ef6c00;
}

.confirm-receipt-btn {
  background-color: #42b983;
  color: #fff;
}

.confirm-receipt-btn:hover {
  background-color: #3aa676;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-info-section {
    flex-direction: column;
    gap: 16px;
  }
  
  .book-info-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .total-price-section {
    margin-left: 0;
    text-align: left;
    width: 100%;
  }
  
  .function-section {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .right-buttons {
    justify-content: space-between;
  }
  
  button {
    width: 100%;
  }
}

</style>