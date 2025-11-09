<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import router from '@/router'

// 获取用户信息
const userInfoApi = '/api/getUserInfo'
const userInfo = reactive({
    id: 1,
    username: '张三',
    avatar: 'src/static/image.png',
    grade: '大一',
    major: '计算机科学与技术',
    summary: '这个人很懒，什么都没有留下。',
})
const getUserInfo = async () => {
    try {
        const response = await axios.get(userInfoApi)
        if(response.data.code === 1) {
            Object.assign(userInfo, response.data.data)
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("获取用户信息失败，请重试")
    }
}
// 修改用户信息
const showUserInfoModal = ref(false)
const editForm = reactive({
    username: '',
    grade: '',
    major: '',
    summary: '',
    avatar: ''
})
const openUserInfoModal = () => {
    Object.assign(editForm, userInfo)
    showUserInfoModal.value = true
}
const closeUserInfoModal = () => {
    showUserInfoModal.value = false
}
// 头像上传
const handleAvatarUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        if (!file.type.startsWith('image/')) {
            ElMessage.error('请上传图片文件')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            ElMessage.error('图片大小不能超过5MB')
            return
        }
        
        // 创建文件阅读器预览图片
        const reader = new FileReader()
        reader.onload = (e) => {
            editForm.avatar = e.target.result
        }
        reader.readAsDataURL(file)
    }
}
const changeUserInfoShow = () => {
    if(editForm.avatar) {
        userInfo.avatar = editForm.avatar
    }
    userInfo.username = editForm.username
    userInfo.grade = editForm.grade
    userInfo.major = editForm.major
    userInfo.summary = editForm.summary
    closeUserInfoModal()
}
const updateUserInfoApi = '/api/updateUserInfo'
const updateUserInfo = async () => {
    if(!editForm.username || !editForm.grade || !editForm.major || !editForm.summary) {
        ElMessage.error("请填写完整用户信息")
        return
    }
    changeUserInfoShow()
    try {
        const response = await axios.put(updateUserInfoApi, {
            username: editForm.username,
            avatar: editForm.avatar,
            grade: editForm.grade,
            major: editForm.major,
            summary: editForm.summary,
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        } 
      )
        if(response.data.code === 1) {
            ElMessage.success("修改用户信息成功")
            userInfoVisible.value = false
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("修改用户信息失败，请重试")
    }
}


// 获取收货地址信息
const addressApi = '/api/getShoppingAddressByUserId'
const address = reactive({
    id: 1,
    user_id: 1,
    address_detail: '北京市海淀区中关村大街27号',
    is_default: true,
})
const address1 = reactive({
    id: 2,
    user_id: 1,
    address_detail: '北京市海淀区中关村大街28号',
    is_default: false,
})
const addressList = reactive({
    List: [address, address1]
})
const getAddressList = async () => {
    try {
        const response = await axios.get(addressApi)
        if(response.data.code === 1) {
            addressList.List = response.data.data
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("获取收货地址失败，请重试")
    }
}
// 检索默认收货地址
const defaultAddress = computed(() => {
    return addressList.List.find(item => item.is_default) || addressList.List[0]
})
// 收货地址弹窗设置
const showAddressModal = ref(false)
const openAddressModal = () => {
    showAddressModal.value = true
}
const closeAddressModal = () => {
    showAddressModal.value = false
}
const changeAddress = reactive({
    id: 0,
    user_id: userInfo.id,
    address_detail: '',
    is_default: false,
})
// 修改默认收货地址（调用修改收货地址的函数，修改两个地址的is_default为false和true）
function changeDefaultAddress(address) {
  const oldDefaultAddress = addressList.List.find(item => item.is_default)
  oldDefaultAddress.is_default = false
  address.is_default = true
  updateAddress(oldDefaultAddress.id, oldDefaultAddress.address_detail, false)
  updateAddress(address.id, address.address_detail, true)
}
function editAddress(address) {
  changeAddress.id = address.id
  changeAddress.address_detail = address.address_detail
}
function resetAddressForm() {
  changeAddress.id = 0
  changeAddress.address_detail = ''
  changeAddress.is_default = false
}
// 确认修改收货地址
function saveAddress() {
  if(changeAddress.address_detail === '') {
    ElMessage.error("请输入地址详情")
    return
  }
    if(changeAddress.id !== 0) {
      updateAddress(changeAddress.id, changeAddress.address_detail, changeAddress.is_default)
      const oldDefaultAddress = addressList.List.find(item => item.id === changeAddress.id)
      oldDefaultAddress.address_detail = changeAddress.address_detail
    } else {
      changeAddress.is_default = true
      const oldDefaultAddress = addressList.List.find(item => item.is_default)
      oldDefaultAddress.is_default = false
      updateAddress(oldDefaultAddress.id, oldDefaultAddress.address_detail, false)
      addNewAddress()
      addressList.List.push(changeAddress)
    }
    resetAddressForm()
}
// 删除收货地址
function deleteAddress(address) {
  deleteAddressFunction(address.id)
  addressList.List = addressList.List.filter(item => item.id !== address.id)
}
// 添加新地址
function addNewAddress() {
  if(changeAddress.address_detail === '') {
    ElMessage.error("请输入地址详情")
    return
  }
  addNewAddressFunction()
  const tempAddress = {...changeAddress}
  addressList.List.push(tempAddress)
  resetAddressForm()
}


// 添加新地址接口
const addAddressApi = '/api/addShoppingAddress'
const addNewAddressFunction = async () => {
    try {
        const response = await axios.post(addAddressApi, {
            address_detail: changeAddress.address_detail,
            is_default: changeAddress.is_default,
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        } 
      )
        if(response.data.code === 1) {
            ElMessage.success("添加新地址成功")
            closeAddressModal()
            getAddressList()
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("添加新地址失败，请重试")
    }
}
// 修改收货地址接口
const updateAddressApi = '/api/updateShoppingAddress'
const updateAddress = async (addressId, addressDetail, isDefault) => {
    try {
        const response = await axios.put(updateAddressApi, {
            id: addressId,
            address_detail: addressDetail,
            is_default: isDefault,
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        } 
      )
        if(response.data.code === 1) {
            ElMessage.success("修改收货地址成功")
            closeAddressModal()
            getAddressList()
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("修改收货地址失败，请重试")
    }
}
// 删除收货地址接口
const deleteAddressApi = '/api/deleteShoppingAddress'
const deleteAddressFunction = async (addressId) => {
    try {
        const response = await axios.delete(deleteAddressApi, {
            id: addressId,
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        } 
      )
        if(response.data.code === 1) {
            ElMessage.success("删除收货地址成功")
            getAddressList()
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("删除收货地址失败，请重试")
    }
}



// 获取默认收货时间
const defaultShoppingTime = ref(2)
const getDefaultShoppingTimeApi = '/api/getDefaultShoppingTime'
const getDefaultShoppingTime = async () => {
    try {
        const response = await axios.get(getDefaultShoppingTimeApi)
        if(response.data.code === 1) {
            defaultShoppingTime.value = response.data.data.time
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("获取默认收货时间失败，请重试")
    }
}
// 更新收货时间接口
const updateShoppingTimeApi = '/api/updateDefaultShoppingTime'
const updateShoppingTime = async () => {
  try {
      const response = await axios.put(updateShoppingTimeApi, {
          time: defaultShoppingTime.value,
      },
      {
          headers: {
              'Content-Type': 'application/json'
          }
      } 
    )
      if(response.data.code === 1) {
          ElMessage.success("更新收货时间成功")
      } else {
          ElMessage.error(response.data.msg)
      }
  } catch (error) {
      ElMessage.error("更新收货时间失败，请重试")
  }
}



onMounted(() => {
    getUserInfo()
    getAddressList()
    getDefaultShoppingTime()
})

</script>

<template>

  <div class="homePage-content">
    <!-- 侧边信息栏 -->
    <div class="homePage-sidebar">
      <!-- 头像和名称 -->
       <div class="user_info">
        <img :src="userInfo.avatar" alt="用户头像" class="user-avatar"/>
        <h2 class="user-name">{{ userInfo.username }}</h2>
       </div>
       <!-- 订单信息跳转按钮 -->
        <div class="function-btn">
          <button class="btn">我的订单</button>
          <button class="btn">购物车</button>
          <button class="btn">我的商品</button>
          <button class="btn">消息</button>
        </div>
    </div>
     <!-- 主内容区域 -->
    <div class="homePage-main">
      <!-- 个人信息和收货地址，时间信息展示区 -->
       <div class="userInfo-show">
          <div class="Info-show">
            <h3>个人信息 <span class="edit-hint" @click="openUserInfoModal">(点击修改)</span></h3>
            <p>年级：{{ userInfo.grade }}</p>
            <p>专业：{{ userInfo.major }}</p>
            <p>个人简介：{{ userInfo.summary }}</p>
          </div>
          <div class="address-show" @click="openAddressModal">
            <h3>收货地址 <span class="edit-hint">(点击管理)</span></h3>
            <p>{{ defaultAddress.address_detail }}</p>
            <h3>收货时间</h3>
            <p>预计 {{ defaultShoppingTime }} 天内送达</p>
          </div>
       </div>
        <!-- 功能展示区 -->
       <div class="function-show">
  
       </div>
    </div>

    <!-- 个人信息修改弹窗 -->
    <div v-if="showUserInfoModal" class="modal-overlay" @click="closeUserInfoModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>修改个人信息</h3>
          <button class="close-btn" @click="closeUserInfoModal">×</button>
        </div>
        
        <div class="modal-body">
          <!-- 头像上传区域 -->
          <div class="avatar-upload-section">
            <div class="avatar-preview">
              <img :src="editForm.avatar" alt="头像预览" class="avatar-preview-img"/>
            </div>
            <div class="upload-controls">
              <label class="upload-btn">
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="handleAvatarUpload"
                  class="file-input"
                />
                选择头像
              </label>
              <p class="upload-hint">支持 JPG、PNG 格式，大小不超过 5MB</p>
            </div>
          </div>
          
          <!-- 表单区域 -->
          <div class="form-section">
            <div class="form-group">
              <label>用户名</label>
              <input 
                type="text" 
                v-model="editForm.username" 
                class="form-input"
                placeholder="请输入用户名"
              />
            </div>
            
            <div class="form-group">
              <label>年级</label>
              <select v-model="editForm.grade" class="form-select">
                <option value="大一">大一</option>
                <option value="大二">大二</option>
                <option value="大三">大三</option>
                <option value="大四">大四</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>专业</label>
              <select v-model="editForm.major" class="form-select">
                <option value="计算机科学与技术">计算机科学与技术</option>
                <option value="信息工程">信息工程</option>
                <option value="软件学院">软件学院</option>
                <option value="电子信息工程">电子信息工程</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>个人简介</label>
              <textarea 
                v-model="editForm.summary" 
                class="form-textarea"
                placeholder="请输入个人简介"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeUserInfoModal">取消</button>
          <button class="save-btn" @click="updateUserInfo">保存</button>
        </div>
      </div>
    </div>

    

   <!-- 收货地址管理弹窗 -->
    <div v-if="showAddressModal" class="modal-overlay" @click="closeAddressModal">
      <div class="modal-content address-modal" @click.stop>
        <div class="modal-header">
          <h3>收货地址管理</h3>
          <button class="close-btn" @click="closeAddressModal">×</button>
        </div>
        
        <div class="modal-body">
          <!-- 收货时间设置 -->
          <div class="shopping-time-section">
            <h4>默认收货时间设置</h4>
            <div class="time-controls">
              <select v-model="defaultShoppingTime" class="time-select" @change="updateShoppingTime">
                <option value="1">1天</option>
                <option value="2">2天</option>
                <option value="3">3天</option>
                <option value="5">5天</option>
                <option value="7">7天</option>
              </select>
              <span class="time-hint">预计送达时间</span>
            </div>
          </div>

          <!-- 地址列表 -->
          <div class="address-list-section">
            <h4>收货地址列表</h4>
            <div class="address-list">
              <div 
                v-for="address in addressList.List" 
                :key="address.id" 
                class="address-item"
                :class="{ 'default-address': address.is_default }"
              >
                <div class="address-content">
                  <div class="address-detail">
                    <span v-if="address.is_default" class="default-badge">默认</span>
                    {{ address.address_detail }}
                  </div>
                  <div class="address-actions">
                    <button 
                      v-if="!address.is_default" 
                      class="action-btn set-default-btn"
                      @click="changeDefaultAddress(address)"
                    >
                      设为默认
                    </button>
                    <button class="action-btn edit-btn" @click="editAddress(address)">
                      编辑
                    </button>
                    <button 
                      v-if="!address.is_default" 
                      class="action-btn delete-btn"
                      @click="deleteAddress(address)"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 添加/编辑地址表单 -->
          <div class="address-form-section">
            <h4>{{ changeAddress.id ? '编辑地址' : '添加新地址' }}</h4>
            <div class="form-group">
              <textarea 
                v-model="changeAddress.address_detail" 
                class="address-textarea"
                placeholder="请输入详细的收货地址"
                rows="3"
              ></textarea>
            </div>
            <div class="form-actions">
              <button class="cancel-btn" @click="resetAddressForm" v-if="changeAddress.id !== 0">
                取消编辑
              </button>
              <button class="add-new-btn" @click="addNewAddress" v-if="changeAddress.id === 0">
                添加新地址
              </button>
              <button class="save-btn" @click="saveAddress">
                {{ changeAddress.id !== 0 ? '保存修改' : '设为默认地址' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.homePage-content {
  display: flex;
  min-height: 80vh;
  padding: 20px 20px 0 20px;
  gap: 20px;
  background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
}

/* 侧边栏样式 */
.homePage-sidebar {
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.user_info {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #e8f5e8;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #81C784;
  margin-bottom: 15px;
}

.user-name {
  color: #2e7d32;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.function-btn {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
}

/* 主内容区域样式 */
.homePage-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* 个人信息区域样式 */
.userInfo-show {
  display: flex;
  gap: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 35%;
}

.Info-show, .address-show {
  flex: 1;
  padding: 15px;
  background: #f8faf8;
  border-radius: 8px;
  border-left: 4px solid #81C784;
  cursor: pointer;
  transition: all 0.3s ease;
}

.Info-show:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.Info-show h3, .address-show h3 {
  color: #2e7d32;
  font-size: 1.2rem;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 2px solid #e8f5e8;
}

.edit-hint {
  font-size: 0.8rem;
  color: #81C784;
  font-weight: normal;
}

.Info-show p, .address-show p {
  color: #455a64;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 8px;
}

/* 功能展示区样式 */
.function-show {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 40px;
  min-height: 300px;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border: 2px dashed #81C784;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2e7d32;
  font-size: 1.2rem;
  font-weight: 500;
  height: 65%;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e8f5e8;
}

.modal-header h3 {
  color: #2e7d32;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #2e7d32;
}

.modal-body {
  padding: 20px;
}

/* 头像上传区域 */
.avatar-upload-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8faf8;
  border-radius: 8px;
}

.avatar-preview-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #81C784;
}

.upload-controls {
  flex: 1;
}

.upload-btn {
  display: inline-block;
  padding: 8px 16px;
  background: #81C784;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-bottom: 8px;
}

.upload-btn:hover {
  background: #66BB6A;
}

.file-input {
  display: none;
}

.upload-hint {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

/* 表单区域 */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #2e7d32;
  font-weight: 500;
}

.form-input, .form-select, .form-textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #81C784;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 弹窗底部按钮 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e8f5e8;
}

.cancel-btn, .save-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.save-btn {
  background: #81C784;
  color: white;
}

.save-btn:hover {
  background: #66BB6A;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .homePage-content {
    flex-direction: column;
    padding: 10px;
  }
  
  .homePage-sidebar {
    width: 100%;
  }
  
  .userInfo-show {
    flex-direction: column;
    height: auto;
  }
  
  .function-show {
    height: auto;
    min-height: 250px;
  }
  
  .avatar-upload-section {
    flex-direction: column;
    text-align: center;
  }
  
  .modal-content {
    width: 95vw;
  }
}

/* 收货地址管理弹窗样式 */
.address-modal {
  width: 600px;
  max-width: 95vw;
}

.shopping-time-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8faf8;
  border-radius: 8px;
  border-left: 4px solid #81C784;
}

.shopping-time-section h4 {
  color: #2e7d32;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.time-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.time-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #2e7d32;
  font-size: 1rem;
}

.time-hint {
  color: #666;
  font-size: 0.9rem;
}

.address-list-section {
  margin-bottom: 30px;
}

.address-list-section h4 {
  color: #2e7d32;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.address-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.address-item:hover {
  border-color: #81C784;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.address-item.default-address {
  border-color: #81C784;
  background: #f1f8e9;
}

.address-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-detail {
  flex: 1;
  color: #455a64;
  font-size: 0.95rem;
  line-height: 1.4;
}

.default-badge {
  background: #81C784;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-right: 8px;
}

.address-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.set-default-btn {
  background: #81C784;
  color: white;
}

.set-default-btn:hover {
  background: #66BB6A;
}

.edit-btn {
  background: #ffb74d;
  color: white;
}

.edit-btn:hover {
  background: #ffa726;
}

.delete-btn {
  background: #e57373;
  color: white;
}

.delete-btn:hover {
  background: #ef5350;
}

.address-form-section {
  padding: 20px;
  background: #f8faf8;
  border-radius: 8px;
  border-left: 4px solid #81C784;
}

.address-form-section h4 {
  color: #2e7d32;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.address-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s ease;
}

.address-textarea:focus {
  outline: none;
  border-color: #81C784;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: flex-end;
}

.add-new-btn {
  padding: 10px 20px;
  background: #81C784;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.add-new-btn:hover {
  background: #66BB6A;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .address-modal {
    width: 95vw;
  }
  
  .address-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .address-actions {
    align-self: flex-end;
  }
  
  .time-controls {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
