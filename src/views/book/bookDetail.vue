<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const bookId = ref(route.query.bookId)

// 根据id获取书籍详情

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
  author: '未知',
  version: '第七版',
  publisher: '人民出版社',
  price: 91.00,
  number: 2,
  isNote: false,
  label: [
    "计算机",
    "机器学习"
  ],
  sellerId: 1,
  seller: '鸡哥',
  sellerImage: 'src/static/image.png'
})
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
  getBookInfoById()
})

// 详情图片动态绑定
const detailImage = ref(bookInfo.imageList[0])

// 联系卖家事件绑定
const contactSeller = () => {
  push({
    path: 'src/views/news/initialNews.vue',
    query: {
      
    }
  })
}

// 加入购物车跳转确认界面事件绑定
// 添加数量控制变量
const quantity = ref(1)
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  } else {
    ElMessage.error('最少添加数量为1')
  }
}
const increaseQuantity = () => {
  if (quantity.value < bookInfo.number) {
    quantity.value++
  } else {
    ElMessage.error('最多添加数量为' + bookInfo.number)
  }
}
const centerDialogVisible = ref(false)
// 添加购物车
const addToCart = async() => {
  // 重置弹窗显示和初始显示数量
  centerDialogVisible.value = false
  quantity.value = 1
  // 将书籍id和数量添加到购物车
  const addToCartApi = '/api/addToShoppingCarById'
  const response = await axios.post(addToCartApi, {
    bookId: bookInfo.id,
    number: quantity.value
  })
  if (response.data.code === 1) {
    ElMessage.success('加入购物车成功')
  } else {
    ElMessage.error('加入购物车失败')
  }
}

</script>

<template>
  
  <el-row class="book-detail">
    <el-col :span="3" class="small-book-image">
      <el-image
        v-for="(image, index) in bookInfo.imageList"
        :key="index"
        :src="image"
        fit="contain"
        class="small-image"
        @click="detailImage = image"
      />  
    </el-col>
    <el-col :span="8" class="detail-book-image">
      <el-image
        :src="detailImage"
        fit="contain"
        class="detail-image"
      />
    </el-col>

    <el-col :span="13" class="book-info">
      <div class="book-name">{{ bookInfo.bookName }}</div>
      <div class="book-base-info">
        <span>作者：{{ bookInfo.author }}</span>
        <span>版本：{{ bookInfo.version }}</span>
        <span>出版社：{{ bookInfo.publisher }}</span>
        <span>相关标签：</span>
        <span class="label-tag">{{ bookInfo.label.join('、') }}</span>
      </div>
      <div class="book-price">价格: ¥{{ bookInfo.price.toFixed(2) }}</div>
      <span class="book-remark">备注信息：</span>
      <div class="book-other-info">
        <span>库存数量：{{ bookInfo.number }}</span>
        <span>是否有注释：{{ bookInfo.isNote ? '是' : '否' }}</span>
      </div>
      <div class="seller-info">
        <span>卖家：</span>
        <img :src="bookInfo.sellerImage" alt="" class="seller-image" />
        <span>{{ bookInfo.seller }}</span>
        <button class="contact-seller" @click="contactSeller">联系卖家</button>
      </div>

      <div class="function-btn">
        <button @click="centerDialogVisible = true">加入购物车</button>
        <button>购买</button>
      </div>

      <!-- 加入购物车确认弹窗 -->
      <el-dialog
        v-model="centerDialogVisible"
        title="加入购物车"
        width="500px"
        class="shoppingCar-center-dialog"
      >
        <div class="cart-dialog-content">
          <!-- 图片 -->
          <div class="cart-dialog-image">
            <el-image
              :src="bookInfo.imageList[0]"
              fit="contain"
              class="dialog-product-image"
            />
          </div>
      
          <!-- 商品信息区域 -->
          <div class="cart-dialog-info">
            <div class="dialog-price">价格: ¥{{ bookInfo.price.toFixed(2) }}</div>

            <div class="dialog-book-name">{{ bookInfo.bookName }}</div>
            <div class="dialog-book-details">
              <span>作者：{{ bookInfo.author }}</span>
              <span>版本：{{ bookInfo.version }}</span>
              <span>出版社：{{ bookInfo.publisher }}</span>
            </div>
            
            <!-- 数量控制 -->
            <div class="quantity-control">
              <button class="quantity-btn" @click="decreaseQuantity">-</button>
              <span class="quantity-number">{{ quantity }}</span>
              <button class="quantity-btn" @click="increaseQuantity">+</button>
            </div>
          </div>
        </div>
        
        <div class="dialog-footer">
          <button class="cancel-btn" @click="centerDialogVisible = false">取消</button>
          <button class="confirm-btn" @click="addToCart">确认加入购物车</button>
        </div>
      </el-dialog>
    </el-col>

  </el-row>
  
</template>

<style scoped>
/* 图片展示区域 */
.book-detail {
  height: 100%;
  background-color: #dcdcdc;
}

.small-book-image {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.small-image {
  height: 18%;
  width: 100%;
  margin-bottom: 10px;
  object-fit: contain;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-book-image {
  height: 100%;
  padding: 5px;
  display: flex;
  align-items: center;
}

.detail-image {
  height: 80%;
  width: 100%;
  object-fit: contain;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 书籍信息区域 */
.book-info {
  height: 100%;
  background-color: aquamarine;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.book-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.book-base-info {
  font-size: 16px;
  margin-bottom: 20px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
}

.book-price {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-left: 20px;
}

.book-remark {
  font-size: 18px;
  opacity: 0.7;
}

.book-other-info {
  font-size: 16px;
  margin-bottom: 20px;
  margin-left: 20px;
}

.seller-info {
  font-size: 18px;
  margin-top: 20px;
  margin-left: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.seller-image {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-left: 10px;
  margin-right: 10px;
}

.contact-seller {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #8af49d;
  color: #000000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.function-btn {
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.function-btn button {
  height: 40px;
  width: 120px;
  padding: 5px 10px;
  background-color: #8af49d;
  color: #000000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.function-btn button:nth-child(2) {
  margin-left: 10px;
}

/* 加入购物车确认弹窗样式 */
.shoppingCar-center-dialog {
  display: flex;
  flex-direction: column;
}

.cart-dialog-content {
  display: flex;
  flex-direction: row;
  padding: 20px 0;
  align-items: flex-start;
}

.cart-dialog-image {
  flex: 0 0 150px;
  margin-right: 20px;
}

.dialog-product-image {
  width: 150px;
  height: 200px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.cart-dialog-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dialog-price {
  font-size: 24px;
  font-weight: bold;
  color: #e60012;
  margin-bottom: 10px;
}

.dialog-book-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.dialog-book-details {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  line-height: 1.8;
}

.label-tag {
  margin-left: 8px;
  font-size: 14px;
  opacity: 0.5;
}



.quantity-control {
  display: flex;
  align-items: center;
  margin-top: auto;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.quantity-btn:hover {
  background-color: #e6e6e6;
}

.quantity-number {
  width: 60px;
  height: 30px;
  border: 1px solid #ddd;
  border-left: none;
  border-right: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
  border-top: 1px solid #eee;
}

.cancel-btn {
  padding: 8px 20px;
  margin-right: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn {
  padding: 8px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-btn:hover {
  background-color: #66b1ff;
}
</style>
