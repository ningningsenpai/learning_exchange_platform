<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import { version } from 'vite';

// 获取用户存储实例
const userStore = useUserStore()
const JWT_TOKEN = userStore.token


// *****  数据获取  *****//
// 获取用户信息
const userInfoApi = '/tempApi/getUserInfo'
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
        const response = await axios.get(userInfoApi, {
            headers: {
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        if(response.data.code === 1) {
            Object.assign(userInfo, response.data.data)
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("获取用户信息失败，请重试")
    }
}

// 获取用户收货地址和收货时间
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
        const response = await axios.get(addressApi, {
            headers: {
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
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
const defaultShoppingTime = ref(2)
const getDefaultShoppingTimeApi = '/api/getDefaultShoppingTime'
const getDefaultShoppingTime = async () => {
    try {
        const response = await axios.get(getDefaultShoppingTimeApi, {
            headers: {
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        if(response.data.code === 1) {
            defaultShoppingTime.value = response.data.data
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("获取默认收货时间失败，请重试")
    }
}

// 社交信息查询 
const socialInfo1 = reactive({
  id: 1,
  user_name: '张三',
  user_avatar: 'src/static/image.png',
  summary: '这个人很懒，什么都没有留下。',
  focusCount: 2,
  fansCount: 3
})
const socialInfo2 = reactive({
  id: 2,
  user_name: '张三',
  user_avatar: 'src/static/image.png',
  summary: '这个人很懒，什么都没有留下。',
  focusCount: 4,
  fansCount: 5
})
const socialInfo3 = reactive({
  id: 3,
  user_name: '张三',
  user_avatar: 'src/static/image.png',
  summary: '这个人很懒，什么都没有留下。',
  focusCount: 4,
  fansCount: 6
})
const socialInfos = reactive({
  focusList: [socialInfo1, socialInfo1, socialInfo1, socialInfo1, socialInfo1, socialInfo1, socialInfo1, socialInfo1, socialInfo1, socialInfo1, socialInfo1, socialInfo1],
  fansList: [socialInfo2, socialInfo2],
  friendsList: [socialInfo3]
})
const socialCount = reactive({
  focusCount: socialInfos.focusList.length + socialInfos.friendsList.length,
  fansCount: socialInfos.fansList.length + socialInfos.friendsList.length,
  friendsCount: socialInfos.friendsList.length,
})
const focusListApi = '/tempApi/userCenter/getFocusUser'
const fansListApi = '/tempApi/userCenter/getFansUser'
const friendsListApi = '/tempApi/userCenter/getFriendsUser'
const getSocialInfo = async () => {
  try {
      const focusResponse = await axios.get(focusListApi, {
            headers: {
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
      const fansResponse = await axios.get(fansListApi, {
            headers: {
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
      const friendsResponse = await axios.get(friendsListApi, {
            headers: {
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
      if(focusResponse.data.code === 1) {
          socialInfos.focusList = focusResponse.data.data
      } else {
          ElMessage.error(focusResponse.data.msg)
      }
      if(fansResponse.data.code === 1) {
          socialInfos.fansList = fansResponse.data.data
      } else {
          ElMessage.error(fansResponse.data.msg)
      }
      if(friendsResponse.data.code === 1) {
          socialInfos.friendsList = friendsResponse.data.data
      } else {
          ElMessage.error(friendsResponse.data.msg)
      }
  } catch (error) {
      ElMessage.error("获取社交信息失败，请重试")
  }
}

// 获取创作者成就信息
const lickCounts = ref(0)
const collectCounts = ref(0)
const pageViews = ref(0)
const likeCountsApi = '/tempApi/userCenter/getLikeCounts'
const collectCountsApi = '/tempApi/userCenter/getCollectCounts'
const pageViewsApi = '/tempApi/userCenter/getPageViews'
const getForumCount = async () => {
    try {
        const likeResponse = await axios.get(likeCountsApi, {
            headers: {
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        const collectResponse = await axios.get(collectCountsApi, {
            headers: {
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        const pageViewsResponse = await axios.get(pageViewsApi, {
            headers: {
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        if(likeResponse.data.code === 1) {
            lickCounts.value = likeResponse.data.data
        } else {
            ElMessage.error(likeResponse.data.msg)
        }
        if(collectResponse.data.code === 1) {
            collectCounts.value = collectResponse.data.data
        } else {
            ElMessage.error(collectResponse.data.msg)
        }
        if(pageViewsResponse.data.code === 1) {
            pageViews.value = pageViewsResponse.data.data
        } else {
            ElMessage.error(pageViewsResponse.data.msg)
        }
    } catch (error) {
        ElMessage.error("获取创作者成就信息失败，请重试")
    }
}


// 获取发布，收藏，动态的帖子
const forumPost1 = reactive({
  user_id: '1',
  forum_id: '1',
  title: '这是一个很有趣的帖子标题',
  publish_date: '2024-06-01',
  summary: '这是帖子内容的简要介绍',
  content: '这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的,这是帖子内容的这是帖子内容的这是帖子内容的,这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的.',
  author_name: '张三哈哈哈',
  author_avatar: 'src/static/image.png',
  page_views: 1234,
  label: ['前端开发', 'Vue.js'],
  cover_avatar: 'src/static/1.jpg',
  type: '原创',
  visible_range: '公开',
  like_count: 456,
  collect_count: 78,
  comment_count: 2,
  subject: '计算机',
  sub_classify: '前端',
  is_like: true,
  is_collect: true,
  is_followed: true
})
function getShowPost() {
  if(currentPage === 'postShow') {
    return userPosts.List
  } else if(currentPage === 'collectPostShow') {
    return userCollects.list
  } else if(currentPage === 'dynamicShow') {
    return userDynamics.list
  }
}
// 获取用户发布的帖子数据
const userPosts = reactive({
    List: [forumPost1, forumPost1, forumPost1, forumPost1]
})
const userPostApi = '/api/getLoginUserPosts'
const getUserPost = async () => {
  try {
      const response = await axios.get(userPostApi,{
        headers: {
          'token': JWT_TOKEN,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      if(response.data.code === 1) {
          userPosts.List = response.data.data
      } else {
          ElMessage.error(response.data.msg)
      }
  } catch (error) {
      ElMessage.error("获取个人帖子失败，请重试")
  }
}
// 获取用户收藏数据
const userCollects = reactive({
  list: [forumPost1, forumPost1, forumPost1, forumPost1]
})
const getUserCollectsApi = '/api/userCenter/getUserCollects'
const getUserCollects = async () => {
  try {
    const response = await axios.get(getUserCollectsApi,{
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if(response.data.code === 1) {
      userCollects.list = response.data.data
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error("获取用户收藏失败，请重试")
  }
}
const userDynamics = reactive({
  list: [forumPost1, forumPost1, forumPost1, forumPost1]
})
// 获取用户动态数据
const dynamicsCount = ref(50)
const getUserDynamicsApi = '/api/userCenter/getUserDynamics'
const getUserDynamics = async () => {
  try {
    const response = await axios.get(getUserDynamicsApi, {
      params: {
        count: dynamicsCount.value
      },
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if(response.data.code === 1) {
      userDynamics.list = response.data.data
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error("获取用户动态失败，请重试")
  }
}


// 交易相关按钮
const dealButtonContent = ref([
  '上架商品',
  '我的商品'
])
const dealDropDown = ref(false)
function toggleDealDropDown () {
  dealDropDown.value = !dealDropDown.value
  forumDropDown.value = false
}

// 社区相关按钮
const forumButtonContent = ref([
  '文章',
  '收藏',
  '动态'
])
const forumDropDown = ref(false)
function toggleForumDropDown () {
  forumDropDown.value = !forumDropDown.value
  dealDropDown.value = false
}

// 退出登录
function logout() {
  
}


// *****  页面动态展示  *****//
// 页面渲染数据合集
const pageDisplayBtn = reactive({
  userBaseDataShow: true,
  userInfoChangeShow: false,
  addressAndTimeChangeShow: false,
  focusShow: false,
  fansShow: false,
  friendsShow: false,
  uploadGoodsShow: false,
  goodsShow: false,
  goodsChangeShow: false,
  goodsDeleteShow: false,
  postShow: false,
  collectPostShow: false,
  dynamicShow: false,
})
const currentPage = ref('userBaseDataShow')
// 切换页面展示
function togglePageDisplay (pageName) {
  if(pageName === currentPage.value) {
    currentPage.value = 'userBaseDataShow'
  } else {
    currentPage.value = pageName
  }
}


// 用户信息修改
const openUserInfoModal = () => {
    Object.assign(editForm, userInfo)
    togglePageDisplay('userInfoChangeShow')
}
const closeUserInfoModal = () => {
    togglePageDisplay('userInfoChangeShow')
}


// 地址和时间修改
const openAddressModal = () => {
    togglePageDisplay('addressAndTimeChangeShow')
}
const closeAddressModal = () => {
    togglePageDisplay('addressAndTimeChangeShow')
}


// *****  数据修改  *****//
// 个人信息修改
const editForm = reactive({
    username: '',
    grade: '',
    major: '',
    summary: '',
    avatar: ''
})
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
const updateUserInfoApi = '/api/updateUserInfo'
const updateUserInfo = async () => {
    if(!editForm.username || !editForm.grade || !editForm.major) {
        ElMessage.error("请填写完整用户信息")
        return
    }
    closeUserInfoModal
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
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        } 
      )
        if(response.data.code === 1) {
            ElMessage.success("修改信息成功")
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("修改用户信息失败，请重试")
    }
}


// 地址和时间修改
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
// 确认修改收货地址或者设置为默认地址
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
      changeAddress.id = 100
      addNewAddress()
      addressList.List.push(changeAddress)
    }
    resetAddressForm()
}
// 删除收货地址
function deleteAddress(address) {
  deleteAddressFunction(address.id)
  const index = addressList.List.findIndex(item => item.id === address.id)
  if (index !== -1) {
    addressList.List.splice(index, 1)
  }
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
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
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
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
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
                'token': JWT_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded'
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
// 更新收货时间接口
const updateShoppingTimeApi = '/api/updateDefaultShoppingTime'
const updateShoppingTime = async () => {
  try {
      const response = await axios.put(updateShoppingTimeApi, {
          time: defaultShoppingTime.value,
      },
      {
          headers: {
              'token': JWT_TOKEN,
              'Content-Type': 'application/x-www-form-urlencoded'
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


// 关注和取消关注
const followUserApi = '/api/user/focusUser'
const followUser = async (userId) => {
  try {
    await axios.post(followUserApi, {
      focus_user_id: userId
    }, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  } catch (error) {
    ElMessage.error('关注用户失败');
  }
  getSocialInfos()
}
const unfollowUserApi = '/api/user/cancelFocusUser'
const unfollowUser = async (userId) => {
  try {
    await axios.post(unfollowUserApi, {
      focus_user_id: userId
    }, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  } catch (error) {
    ElMessage.error('取消关注用户失败');
  }
  getSocialInfos()
}

// 帖子搜索
const searchKeyword = ref('')
const searchPostApi = '/api/forum/searchPost'
const searchPost = async (currentPage) => {
  try {
    const response = await axios.post(searchPostApi, {
      type: currentPage,
      keyword: searchKeyword.value,
    }, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if(response.data.code === 1) {
      getShowPost() = response.data.data
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('搜索帖子失败');
  }
}



// 商品相关接口实现
// 上传书籍信息
const bookDataBase = reactive({
  name: '',
  author: '',
  publisher: '',
  version: '',
  price: 0,
  type: '',
  classify: '',
  subClassify: '',
  isNote: false,
  description: '',
  avatar: []
})

// 查找上传的书籍商品
const userBooks = reactive({
  list: []
})
const getUserBooksApi = '/api/books/getUserBooks'
const getUserBooks = async () => {
  try {
    const response = await axios.get(getUserBooksApi,{
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if(response.data.code === 1) {
      userBooks.list = response.data.data
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error("获取用户书籍商品失败，请重试")
  }
}

// 修改上传的书籍商品信息


// 下架书籍商品
const deleteBookApi = '/api/books/deleteBook'
const deleteBook = async (bookId) => {
  try {
    await axios.post(deleteBookApi, {
      book_id: bookId
    }, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  } catch (error) {
    ElMessage.error('下架书籍商品失败');
  }
}

</script>

<template>

  <div class="homePage-content">
    <!-- 侧边栏 -->
    <div class="sider">
      <!-- 用户信息 -->
      <div class="userInfo">
        <img :src="userInfo.avatar" alt="" class="userInfo-avatar" @click="togglePageDisplay('userBaseDataShow')">
        <span class="userName" @click="togglePageDisplay('userBaseDataShow')">{{ userInfo.username }}</span>
      </div>
      
      <!-- 社交信息 -->
      <div class="socialInfo">
        <span class="socialItem" @click="togglePageDisplay('focusShow')">关注: {{ socialCount.focusCount }}</span>
        <span class="socialItem" @click="togglePageDisplay('fansShow')">粉丝: {{ socialCount.fansCount }}</span>
        <span class="socialItem" @click="togglePageDisplay('friendsShow')">好友: {{ socialCount.friendsCount }}</span>
      </div>
      
      <!-- 创作者成就信息 -->
      <div class="creatorInfo">
        <div class="creatorItem">
          <span class="icon like-icon"></span>
          <span class="count">{{ lickCounts }}</span>
        </div>
        <div class="creatorItem">
          <span class="icon star-icon"></span>
          <span class="count">{{ collectCounts }}</span>
        </div>
        <div class="creatorItem">
          <span class="icon view-icon"></span>
          <span class="count">{{ pageViews }}</span>
        </div>
      </div>
      
      <!-- 功能按钮区 -->
      <div class="function-btn">
        <!-- 交易相关 -->
        <div class="deal-btn">
          <button class="function-btn-item" @click="toggleDealDropDown">
            <span class="btn-icon">💰</span>
            <span class="btn-text">交易相关</span>
            <span class="arrow" :class="{ 'arrow-down': dealDropDown }">▼</span>
          </button>
          <div class="dropdown-content" v-show="dealDropDown">
            <button 
              v-for="(item, index) in dealButtonContent" 
              :key="index" 
              class="dropdown-item"
              @click="togglePageDisplay(item === '上架商品' ? 'uploadGoodsShow' : 'goodsShow')"
            >
              <span class="dropdown-icon">{{ index === 0 ? '📦' : '📋' }}</span>
              {{ item }}
            </button>
          </div>
        </div>
        
       <!-- 社区相关 -->
        <div class="forum-btn" :class="{ 'moved-down': dealDropDown }">
          <button class="function-btn-item" @click="toggleForumDropDown">
            <span class="btn-icon">👥</span>
            <span class="btn-text">社区相关</span>
            <span class="arrow" :class="{ 'arrow-down': forumDropDown }">▼</span>
          </button>
          <div class="dropdown-content" v-show="forumDropDown">
            <button 
              v-for="(item, index) in forumButtonContent" 
              :key="index" 
              class="dropdown-item"
              @click="togglePageDisplay(item === '文章' ? 'postShow' : item === '收藏' ? 'collectPostShow' : 'dynamicShow')"
            >
              <span class="dropdown-icon">{{ index === 0 ? '📝' : index === 1 ? '❤️' : '📱' }}</span>
              {{ item }}
            </button>
          </div>
        </div>
        
      <!-- 退出登录按钮 -->
        <div class="logout-btn" :class="{ 
          'moved-down': dealDropDown || forumDropDown,
          'deal-active': dealDropDown,
          'forum-active': forumDropDown
        }">
          <button class="function-btn-item logout" @click="logout">
            <span class="btn-icon">🚪</span>
            <span class="btn-text">退出登录</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容显示区域 -->
    <!-----------------------  内容显示区域  ---------------------->
    <div class="main-content">
      <!-- 用户信息和收货地址以及收货时间（默认显示，点击其他按钮后消失切换为其他内容） -->
      <div class="userInfo-show"  v-show="currentPage === 'userBaseDataShow'">
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

      <!-- 仅关注，仅粉丝，好友（在仅关注和仅粉丝后追加显示互相关注）-->
      <div class="social-show" v-if="currentPage === 'focusShow' || currentPage === 'fansShow' || currentPage === 'friendsShow'"> 
        <!-- 好友列表 -->
        <div 
          v-for="(item, index) in socialInfos.friendsList" 
          :key="index" 
          class="friend-item" 
        > 
          <div class="friend-content">
            <img :src="item.avatar" alt="" class="social-avatar"/>
            <div class="friend-info">
              <p class="social-name">{{ item.user_name }}</p>
              <p class="social-intro">{{ item.summary }}</p>
            </div>
            <button class="friend-btn mutual-follow" @click="unfollowUser(item.id)">相互关注</button>
          </div>
        </div>
        
        <!-- 关注列表 -->
        <div 
          v-if="currentPage === 'focusShow'"
          v-for="(item, index) in socialInfos.focusList" 
          :key="index" 
          class="friend-item" 
        > 
          <div class="friend-content">
            <img :src="item.avatar" alt="" class="social-avatar"/>
            <div class="friend-info">
              <p class="social-name">{{ item.user_name }}</p>
              <p class="social-intro">{{ item.summary }}</p>
            </div>
            <button class="friend-btn followed" @click="unfollowUser(item.id)">已关注</button>
          </div>
        </div>
        
        <!-- 粉丝列表 -->
        <div 
          v-if="currentPage === 'fansShow'"
          v-for="(item, index) in socialInfos.fansList" 
          :key="index" 
          class="friend-item" 
        > 
          <div class="friend-content">
            <img :src="item.avatar" alt="" class="social-avatar"/>
            <div class="friend-info">
              <p class="social-name">{{ item.user_name }}</p>
              <p class="social-intro">{{ item.summary }}</p>
            </div>
            <button class="friend-btn follow-back" @click="followUser(item.id)">回关</button>
          </div>
        </div>
      </div>


      <!-- 上传书籍商品 -->

      <!-- 查看上传的书籍商品 -->
      
      <!-- 帖子展示（我的，收藏，动态） -->
      <div 
      class="forum-show"
      v-if="currentPage === 'postShow' || currentPage === 'collectPostShow' || currentPage === 'dynamicShow'"
      >
        <div class="forum-search" :v-model="searchKeyword" @click="searchPost(currentPage)">
          
        </div>
        <div class="forum-posts-container">
          <div class="forum-posts">
            <div v-for="post in getShowPost()" :key="post.forum_id" class="forum-post">
              <div class="forum-main">
                <!-- 发帖用户信息 -->
                <div class="forum-userInfo">
                  <div class="userInfo-avatar-container">
                    <img :src="post.author_avatar" alt="用户头像" class="forum-userInfo-avatar"/>
                  </div>
                  <div class="userInfo-details">
                    <p class="userInfo-name">{{ post.author_name }}</p>
                    <p class="userInfo-stats">发帖时间: {{ post.publish_date }}</p>
                  </div>
                </div>
                
                <!-- 帖子标题和简介 -->
                <div class="forum-content" @click="goToPostDetail(post.forum_id)">
                  <h2 class="forum-title">{{ post.title }}</h2>
                  <p class="forum-summary">{{ post.summary }}</p>
                </div>
                
                <!-- 帖子数据展示 -->
                <div class="forum-data">
                  <span class="forum-subClassify">#{{ post.sub_classify }}</span>
                  <span class="forum-label">#{{ post.label }}</span>
                  <span class="forum-viewCount" @click="goToPostDetail(post.forum_id)">浏览量:{{ post.page_views }}</span>
                  <span class="forum-replyCount" @click="goToPostDetail(post.forum_id)">评论量:{{ post.comment_count }}</span>
                  <span class="forum-likeCount" @click="goToPostDetail(post.forum_id)">点赞量:{{ post.like_count }}</span>
                  <span class="forum-collectCount" @click="goToPostDetail(post.forum_id)">收藏量:{{ post.collect_count }}</span>
                </div>
              </div>
              
              <!-- 帖子封面图,右侧 -->
              <div class="forum-coverAvatar" @click="goToPostDetail(post.forum_id)">
                <img :src="post.cover_avatar" alt="帖子封面" class="cover-avatar-img"/>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-----------------------  修改弹窗显示区域  ---------------------->
    <!-- 个人信息修改弹窗 -->
    <div v-if="currentPage === 'userInfoChangeShow'" class="modal-overlay" @click="closeUserInfoModal">
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
    <div v-if="currentPage === 'addressAndTimeChangeShow'" class="modal-overlay" @click="closeAddressModal">
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

    <!-- 修改上传书籍弹窗 -->

    <!-- 下架书籍商品弹窗 -->

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
  height: 100%;
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
}

/* 侧边栏样式 */
.sider {
  width: 280px;
  height: 98%;
  margin: auto 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 用户信息区域 */
.userInfo {
  text-align: center;
  padding-bottom: 15px;
  border-bottom: 2px solid #e8f5e8;
}

.userInfo-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #81C784;
  margin-bottom: 10px;
}

.userName {
  color: #2e7d32;
  font-size: 1.2rem;
  font-weight: 600;
  display: block;
}

/* 社交信息区域 */
.socialInfo {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}

.socialItem {
  color: #455a64;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: default;
  transition: color 0.3s ease;
}

.socialItem:hover {
  color: #2e7d32;
}

/* 创作者成就信息区域 */
.creatorInfo {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8faf8;
  border-radius: 8px;
}

.creatorItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: default;
  transition: all 0.3s ease;
}

.creatorItem:hover {
  transform: translateY(-2px);
}

.icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.creatorItem:hover .icon {
  opacity: 1;
  transform: scale(1.1);
}

.like-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2381C784'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
}

.star-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2381C784'%3E%3Cpath d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E");
}

.view-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2381C784'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E");
}

.count {
  color: #2e7d32;
  font-size: 0.9rem;
  font-weight: 600;
}

/* 功能按钮区域 */
.function-btn {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.deal-btn, .forum-btn, .logout-btn {
  transition: all 0.1s ease;
  position: relative; 
}

.forum-btn.moved-down {
  margin-top: 76px;
}

.logout-btn.moved-down {
  margin-top: 76px; 
}

.logout-btn.moved-down.deal-active {
  margin-top: 8px; 
}

.logout-btn.moved-down.forum-active {
  margin-top: 114px; 
}

.function-btn-item {
  width: 100%;
  padding: 10px 12px;
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.function-btn-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
}

.function-btn-item.logout {
  background: linear-gradient(135deg, #e57373 0%, #ef5350 100%);
}

.function-btn-item.logout:hover {
  background: linear-gradient(135deg, #ef5350 0%, #f44336 100%);
}

.btn-icon {
  font-size: 1rem;
}

.btn-text {
  flex: 1;
  text-align: left;
}

.arrow {
  transition: transform 0.3s ease;
  font-size: 0.7rem;
}

.arrow-down {
  transform: rotate(180deg);
}

/* 下拉内容样式 */
.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 6px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  z-index: 10;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: white;
  color: #455a64;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  box-sizing: border-box;
}

.dropdown-item:hover {
  background: #f8faf8;
  color: #2e7d32;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-icon {
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .homePage-content {
    padding: 10px;
  }
  
  .sider {
    width: 100%;
  }
  
  .forum-btn.moved-down {
    transform: translateY(50px);
  }
  
  .logout-btn.moved-down {
    transform: translateY(100px);
  }
  
  .creatorInfo {
    flex-direction: column;
    gap: 8px;
  }
}



/* 主要内容显示区域 */
.main-content {
  flex: 1;
  height: 98%; 
  border-radius: 8px;
  margin: auto 0;
  margin-left: 20px;
  overflow: auto;
}

/* 个人信息区域样式 */
.userInfo-show {
  display: flex;
  gap: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 40%;
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


/* 社交信息显示区域样式 */
.social-show {
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.friend-item {
  margin-bottom: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.friend-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.friend-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.social-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.friend-info {
  flex: 1;
}

.social-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.social-intro {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.friend-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 80px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.friend-btn.mutual-follow {
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
  color: white;
  border: 1px solid #81C784;
}

.friend-btn.mutual-follow:hover {
  background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(129, 199, 132, 0.3);
}

.friend-btn.mutual-follow:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(129, 199, 132, 0.4);
}

.friend-btn.followed {
  background: linear-gradient(135deg, #f8faf8 0%, #e8f5e8 100%);
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.friend-btn.followed:hover {
  background: linear-gradient(135deg, #e8f5e8 0%, #dcedc8 100%);
  color: #1b5e20;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.1);
}

.friend-btn.followed:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(46, 125, 50, 0.15);
}

.friend-btn.follow-back {
  background: linear-gradient(135deg, #a5d6a7 0%, #81c784 100%);
  color: white;
  border: 1px solid #a5d6a7;
}

.friend-btn.follow-back:hover {
  background: linear-gradient(135deg, #81c784 0%, #66bb6a 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(165, 214, 167, 0.3);
}

.friend-btn.follow-back:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(165, 214, 167, 0.4);
}

.friend-btn::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.friend-btn.mutual-follow::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z'/%3E%3Cpath d='M20 12l-8 8-1.41-1.41L15.17 13H4v-2h11.17l-4.58-4.59L12 4l8 8z'/%3E%3C/svg%3E");
}

.friend-btn.followed::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
}

.friend-btn.follow-back::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E");
}

.friend-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.friend-btn:active::after {
  width: 100px;
  height: 100px;
}

@media (max-width: 768px) {
  .friend-btn {
    padding: 6px 12px;
    font-size: 12px;
    min-width: 70px;
  }
  
  .friend-btn::before {
    width: 12px;
    height: 12px;
  }
  
  .friend-content {
    gap: 12px;
  }
  
  .social-avatar {
    width: 40px;
    height: 40px;
  }
}


/* 个人信息修改以及地址收货时间修改 */
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