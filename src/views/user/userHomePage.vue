<script setup>
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

// 用户信息获取
const userInfoApi = '/api/getUserInfo'
const userInfoForm = reactive({
  username: 'ikun',
  avatar: 'src/static/image.png',
  grade: '大三',
  major: '计算机科学与技术',
  user_introduction: '哈哈哈哈'
})
const getUserInfo = async() => {
  const response = await axios.get(userInfoApi)
  try {
    if(response.data.code == 1) {
      const userData =response.data.data
      Object.keys(userInfoForm).forEach(key => {
      if (userData[key] !== undefined) {
        userInfoForm[key] = userData[key];
      }
    });
      ElMessage.success(response.data.msg)
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

//传输修改后的用户信息
const updateUserInfoApi = '/api/updateUserInfo'
const updateUserInfo = async(formData) => {
  const response = await axios.post(updateUserInfoApi, qs.stringify(formData),{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return response.data
}
const updateUserInfoSubmit = async() => {
  const response = await updateUserInfo(userInfoForm)
  try {
    if(response.code == 1) {
      ElMessage.success(response.data.msg)
      getUserInfo()
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('更新用户信息失败')
  }
}


// 收货信息获取
const addressApi = '/api/getShippingAddressByUserId'
const addressForm = reactive({
  addressInfo: [
    {
      shoppingAddressId: 1,
      shoppingAddress: '中国 河南省 郑州市 中原区 111111',
      priority: 0
    },
    {
      shoppingAddressId: 2,
      shoppingAddress: '中国 河南省 郑州市 中原区 222222',
      priority: 0
    },
    {
      shoppingAddressId: 4,
      shoppingAddress: '中国 河南省 郑州市 中原区 444444',
      priority: 1
    },
  ]
})
const getAddress = async() => {
  const response = await axios.get(addressApi)
  try {
    if(response.data.code == 1) {
      addressForm.addressInfo = response.data.data
      ElMessage.success(response.data.msg)
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('获取收货地址失败')
  }
}

// 默认地址判断
const getDefaultAddress = () => {
  if(addressForm.addressInfo.length == 0) {
    return null
  }
  const defaultIndex = addressForm.addressInfo.findIndex(item => item.priority == 1)
  if (defaultIndex !== -1) {
    return addressForm.addressInfo[defaultIndex].shoppingAddress
  } else {
    return addressForm.addressInfo[0].shoppingAddress
  }
}

// 获取用户默认收货时间
const timeApi = '/api/getDefaultShippingTimeByUserId'
const timeForm = reactive({
  ShippingTime: 2
})
const getTime = async() => {
  const response = await axios.get(timeApi)
  try {
    if(response.data.code == 1) {
      timeForm.ShippingTime = response.data.data
      ElMessage.success(response.data.msg)
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('获取用户默认收货时间失败')
  }
}

onMounted(() => {
  getUserInfo()
  getAddress()
  getTime()
})


// 添加收货地址
const addAddressApi = '/api/addShippingAddress'
const isCheckDefaultAddress = ref(false)
const addAddressForm = reactive({
  shoppingAddress: '',
  // 判断是否设置为默认
  priority: isCheckDefaultAddress.value ? 1 : 0
})
const addAddressSubmit = async() => {
  const response = await axios.post(addAddressApi, qs.stringify(addAddressForm),{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  if(response.data.code == 1) {
    ElMessage.success(response.data.msg)
    getAddress()
  } else {
    ElMessage.error(response.data.msg)
  }
}
// 更新收货地址


// 删除收货地址

// 更新用户默认收货时间


// 弹窗相关设置
// 编辑用户信息弹窗
const centerDialogVisible = ref(false)

</script>

<template>

  <div class="user-container">
    <!-- 侧边栏 -->
    <div class="sidebar">

      <div class="user-info">
        <img :src="userInfoForm.avatar" alt="" class="avatar">
        <br>
        <span class="nickname">{{userInfoForm.username}}</span>
        <hr class="bottom-line">
      </div>

      <!-- 功能按钮 -->
      <div class="function-buttion">
        <router-link to="/buyOrders" class="function-link" style="margin-top: 60px;">我的订单</router-link>
        <router-link to="/shoppingCar" class="function-link">购物车</router-link>
        <router-link to="/sellOrders" class="function-link">我的商品</router-link>
        <router-link to="/initialNews" class="function-link">消息</router-link>
      </div>

    </div>

    <div class="content-area">
      <!-- 顶部区域 -->
      <el-row class="top">
        <!-- 用户信息展示 -->
         <el-col :span="2" class="baseInfo">
            <span>基本信息</span>
         </el-col>
         <el-col :span="9" class="userInfo-show">
            <span>年级：{{userInfoForm.grade}}</span>
            <span>专业：{{userInfoForm.major}}</span>
            <span>个人简介：{{userInfoForm.user_introduction}}</span>
         </el-col>
         <!-- 收货信息展示 -->
         <el-col :span="2" class="goodsInfo">
            <span>收货信息</span>
         </el-col>
         <el-col :span="8" class="goodsInfo-show">
            <div v-if="!getDefaultAddress()">
              <span>收货地址：暂无收货地址</span>
            </div>
            <div v-else>
              <span>收货地址：{{getDefaultAddress()}}</span>
            </div>
            <span>收货时间：{{addressForm.shoppingTime}}</span>
         </el-col>
         <!-- 编辑用户信息 -->
         <el-col :span="3" style="display: flex; justify-content: center; align-items: center;">
            <el-button class="change-button" @click="centerDialogVisible = true">编辑信息</el-button>
            <el-dialog
              v-model="centerDialogVisible"
              title="信息修改"
              width="40%"
            >
              <div class="userInfo-change">
                <img :src="userInfoForm.avatar" alt="" class="avatar-change"></img>
                <div class="form-row">
                  <span>用户名：</span>
                  <input type="text" v-model="userInfoForm.username">
                </div>
                <div class="form-row">
                  <span>个人简介：</span>
                  <input type="text" v-model="userInfoForm.user_introduction">
                </div>
                <div class="form-row">
                  <span>年级：</span>
                    <el-select v-model="userInfoForm.grade" placeholder="userInfoForm.grade" style="width: 110px;">
                    <el-option label="大一" value="大一" />
                    <el-option label="大二" value="大二" />
                    <el-option label="大三" value="大三" />
                    <el-option label="大四" value="大四" />
                  </el-select>
                </div>
                <div class="form-row">
                  <span>专业：</span>
                  <el-select v-model="userInfoForm.major" placeholder="userInfoForm.major" style="width: 110px;">
                    <el-option label="计算机科学与技术" value="计算机科学与技术" />
                    <el-option label="信息工程" value="信息工程" />
                    <el-option label="软件学院" value="软件学院" />
                    <el-option label="电子信息工程" value="电子信息工程" />
                </el-select>
                </div>
              </div>
              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="centerDialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="centerDialogVisible = false" @submit="updateUserInfoSubmit">确认</el-button>
                </div>
              </template>
            </el-dialog>
         </el-col>
        
      </el-row>

      <!-- 信息集成窗口 -->
      <div class="content">
        
      </div>
    </div>
    
  </div>

</template>

<style scoped>

.user-container {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 14%;
  height: 100%;
  background-color: #b6b6b6;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.user-info {
  height: 25%;
  width: 100%;
  background-color: #5c947a;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin: 0 auto;
}

.nickname {
  font-size: 20px;
  font-weight: bold;
}

.bottom-line {
  border: 1px solid #fff;
  width: 94%;
  position: absolute;
  bottom: 0;
  left: 3%;
  margin: 0;
}

.function-buttion {
  flex: 1;
  width: 100%;
}

.function-link {
  display: block;
  margin: 20px 5px;
  padding: 10px 20px;
  background-color: #5c947a;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.top {
  width: 100%;
  height: 25%;
  background-color: #b6b6b6;
  margin-bottom: 10px;
}

.avatar-change {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-left: 20px;
  margin-bottom: 20px;
}

.baseInfo {
  background-color: #83ecbb;
  height: 50%;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 25px; 
  border-radius: 5px;
  font-weight: 600; 
  color: #2c3e50;
  min-height: 60px; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.1)
}


.userInfo-show {
  font-size: 16px;
  display: flex;
  flex-direction: column;
  padding: 12px 15px;
  gap: 10px;
  color: #333;
  line-height: 0.3;
}

.userInfo-show span {
  display: block;
  padding: 5px 0;
}

/* 特殊样式，防止简介文本过长 */


.goodsInfo {
  background-color: #83ecbb;
  height: 50%;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 25px; 
  border-radius: 5px;
  font-weight: 600; 
  color: #2c3e50;
  min-height: 60px; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.1)
}

.goodsInfo-show {
  font-size: 16px;
  display: flex;
  flex-direction: column;
  padding: 12px 15px;
  gap: 10px;
  color: #333;
  line-height: 0.3;
}

.goodsInfo-show span {
  display: block;
  padding: 20px 0;
}



.change-button {
  background-color: #5c947a;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.userInfo-change {
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
  margin-left: 10%;
}

.form-row {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.userInfo-change span {
  text-align: left;
  width: 80px; 
  margin-right: 10px;
}

.userInfo-change input {
  margin-top: 0; 
  height: 30px;
  width: 60%;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.content {
  flex: 1;
  background-color: #f0f0f0;
  overflow-y: auto;
}



</style>
