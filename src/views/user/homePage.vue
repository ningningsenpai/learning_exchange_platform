<script setup>
import { reactive, computed, onMounted, ref, nextTick, h } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import router from '@/router'
import { useUserStore } from '@/stores/userStore'

// 获取用户存储实例
const userStore = useUserStore()
const JWT_TOKEN = userStore.token


// *****  数据获取  *****//
// 获取用户信息
const userInfoApi = '/api/getUserInfo'
const userInfo = reactive({
    id: 0,
    username: '',
    avatar: '',
    grade: '',
    major: '',
    introduction: '',
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
    label: '公司',
    shopping_address: '北京市海淀区中关村大街27号',
    _default: true,
})
const address1 = reactive({
    id: 2,
    user_id: 1,
    label: '家',
    shopping_address: '北京市海淀区中关村大街28号',
    _default: false,
})
const addressList = reactive({
    List: []
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
            console.log(response.data.data)
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("获取收货地址失败，请重试")
    }
    console.log(addressList.List[0]._default)
    console.log(defaultAddress)
}
// 检索默认收货地址
const defaultAddress = computed(() => {
    if(addressList.List.length > 0) {
      const defaultAddress = addressList.List.find(item => item._default) || addressList.List[0]
      return defaultAddress.shopping_address
    } else {
      return '暂无收货地址'
    }
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
  introduction: '这个人很懒，什么都没有留下。',
  focusCount: 2,
  fansCount: 3
})
const socialInfo2 = reactive({
  id: 2,
  user_name: '张三',
  user_avatar: 'src/static/image.png',
  introduction: '这个人很懒，什么都没有留下。',
  focusCount: 4,
  fansCount: 5
})
const socialInfo3 = reactive({
  id: 3,
  user_name: '张三',
  user_avatar: 'src/static/image.png',
  introduction: '这个人很懒，什么都没有留下。',
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
  id: 1,
  user_id: 1,
  title: '这是一个很有趣的帖子标题',
  publish_date: '2024-06-01',
  summary: '这是帖子内容的简要介绍',
  content: '这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的,这是帖子内容的这是帖子内容的这是帖子内容的,这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的.',
  author_name: '张三哈哈哈',
  author_avatar: 'src/static/image.png',
  page_views: 1234,
  label: '前端开发',
  cover_avatar: 'src/static/1.jpg',
  type: '原创',
  visible_range: '公开',
  like_count: 456,
  collect_count: 78,
  comment_count: 2,
  subject: '计算机',
  sub_classify: '前端',
})
const forumPost2 = reactive({
  id: 1,
  user_id: 1,
  title: '这是一个帖子标题',
  publish_date: '2024-06-01',
  summary: '这是帖子内容的简要介绍',
  content: '这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的,这是帖子内容的这是帖子内容的这是帖子内容的,这是帖子内容的这是帖子内容的这是帖子内容的这是帖子内容的.',
  author_name: '张三哈哈哈',
  author_avatar: 'src/static/image.png',
  page_views: 1234,
  label: '前端开发',
  cover_avatar: 'src/static/1.jpg',
  type: '原创',
  visible_range: '公开',
  like_count: 456,
  collect_count: 78,
  comment_count: 2,
  subject: '计算机',
  sub_classify: '前端',
})
function getShowPost() {
  if(currentPage.value === 'postShow') {
    return userPosts.List
  } else if(currentPage.value === 'collectPostShow') {
    return userCollects.List
  } else if(currentPage.value === 'dynamicShow') {
    return userDynamics.List
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
  List: [forumPost2, forumPost2, forumPost2, forumPost2]
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
      userCollects.List = response.data.data
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error("获取用户收藏失败，请重试")
  }
}
const userDynamics = reactive({
  List: [forumPost1, forumPost1, forumPost1, forumPost1]
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
      userDynamics.List = response.data.data
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
const logoutApi = '/api/userCenter/logout'
const logout = async () => {
  try {
    const response = await axios.post(logoutApi, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if(response.data.code === 1) {
      ElMessage.success(response.data.msg)
      togglePageDisplay('userBaseDataShow')
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error("退出登录失败，请重试")
  }
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
  console.log(pageName)
  if(pageName === currentPage.value) {
    currentPage.value = 'userBaseDataShow'
  } else {
    currentPage.value = pageName
  }
  nextTick(() => {
    scrollToTop()
  })
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


// 上传确认弹窗
const openUploadBookModal = () => {
  uploadBookModal.value = true
}
const closeUploadBookModal = () => {
  uploadBookModal.value = false
  resetBookForm()
}

// 编辑弹窗
const openEditBookModal = (book) => {
  Object.assign(currentEditBook, book)
}
const closeEditBookModal = () => {
  currentEditBook.value = null
}


// 删除确认弹窗
const openDeleteConfirmModal = (bookId) => {
  currentDeleteBookId.value = bookId
  deleteConfirmModal.value = true
}
const closeDeleteConfirmModal = () => {
  deleteConfirmModal.value = false
  currentDeleteBookId.value = null
}


// 批量删除弹窗
const openBatchDeleteModal = () => {
  if (selectedBooks.value.length === 0) {
    ElMessage.warning('请选择要下架的书籍')
    return
  }
  batchDeleteModal.value = true
}
const closeBatchDeleteModal = () => {
  batchDeleteModal.value = false
}


// 重置页面滚动条
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  setTimeout(() => {
    const forumPostsContainer = document.querySelector('.forum-posts-container')
    if (forumPostsContainer) {
      forumPostsContainer.scrollTop = 0
    }
    const forumShowContainer = document.querySelector('.forum-show')
    if (forumShowContainer) {
      forumShowContainer.scrollTop = 0
    }
    const mainContent = document.querySelector('.main-content')
    if (mainContent) {
      mainContent.scrollTop = 0
    }
  }, 100)
}


// *****  数据修改  *****//
// 个人信息修改
const editForm = reactive({
    username: '',
    grade: '',
    major: '',
    introduction: '',
    avatar: '',
    avatarFile: null
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
        editForm.avatarFile = file;
    }
}
const imageUploadApi = '/api/upload'
const imageUpload = async() => {
  if(!editForm.avatarFile) {
    ElMessage.error("请上传头像")
    return
  }
  try {
    const response = await axios.post(imageUploadApi, {
        image: editForm.avatarFile
      },{
          headers: {
          'token': JWT_TOKEN,
          'Content-Type': 'multipart/form-data'
        }
      })
    if(response.data.code === 1) {
      ElMessage.success("上传头像成功")
      editForm.avatar = response.data.data
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error("上传头像失败，请重试")
  }
}
const updateUserInfoApi = '/api/updateUserInfo'
const updateUserInfo = async () => {
  console.log(editForm.avatarFile)
  if(!editForm.avatar &&!editForm.username && !editForm.grade && !editForm.major) {
      ElMessage.error("请填写完整用户信息")
      return
  }
  try {
      await imageUpload()
      const response = await axios.put(updateUserInfoApi, {
        id: userInfo.id,
        username: editForm.username,
        avatar: editForm.avatar,
        grade: editForm.grade,
        major: editForm.major,
        introduction: editForm.introduction,
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
          closeUserInfoModal()
          editForm.avatar = ''
          editForm.username = ''
          editForm.grade = ''
          editForm.major = ''
          editForm.introduction = ''
      } else {
          ElMessage.error(response.data.msg)
      }
  } catch (error) {
      ElMessage.error("修改用户信息失败，请重试")
  }
  getUserInfo()
}


// 地址和时间修改
const changeAddress = reactive({
    id: 0,
    user_id: userInfo.id,
    shopping_address: '',
    _default: false,
})
// 修改默认收货地址（调用修改收货地址的函数，修改两个地址的_default为false和true）
function changeDefaultAddress(address) {
  const oldDefaultAddress = addressList.List.find(item => item._default)
  oldDefaultAddress._default = false
  address._default = true
  updateAddress(oldDefaultAddress.id, oldDefaultAddress.shopping_address, false)
  updateAddress(address.id, address.shopping_address, true)
}
function editAddress(address) {
  changeAddress.id = address.id
  changeAddress.shopping_address = address.shopping_address
}
function resetAddressForm() {
  changeAddress.id = 0
  changeAddress.shopping_address = ''
  changeAddress._default = false
}
// 确认修改收货地址或者设置为默认地址
function saveAddress() {
  if(changeAddress.shopping_address === '') {
    ElMessage.error("请输入地址详情")
    return
  }
    if(changeAddress.id !== 0) {
      updateAddress(changeAddress.id, changeAddress.shopping_address, changeAddress._default)
      const oldDefaultAddress = addressList.List.find(item => item.id === changeAddress.id)
      oldDefaultAddress.shopping_address = changeAddress.shopping_address
    } else {
      changeAddress._default = true
      const oldDefaultAddress = addressList.List.find(item => item._default)
      if(oldDefaultAddress) {
        oldDefaultAddress._default = false
        updateAddress(oldDefaultAddress.id, oldDefaultAddress.shopping_address, false)
      }
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
  if(changeAddress.shopping_address === '') {
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
            address: changeAddress.shopping_address,
            is_default: changeAddress._default,
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
            shopping_address: addressDetail,
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
  getSocialInfo()
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
  getSocialInfo()
}

// 帖子搜索
const searchKeyword = ref('')
const searchPostApi = '/api/forum/searchPost'
const searchPost = async () => {
  // try {
  //   const response = await axios.post(searchPostApi, {
  //     type: currentPage,
  //     keyword: searchKeyword.value,
  //   }, {
  //     headers: {
  //       'token': JWT_TOKEN,
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     }
  // });
  //   if(response.data.code === 1) {
  //     if(currentPage === 'postShow') {
  //       userPosts = response.data.data
  //     } else if(currentPage === 'userPostShow') {
  //       userCollects = response.data.data
  //     } else {
  //       userDynamics = response.data.data
  //     }
  //   } else {
  //     ElMessage.error(response.data.msg)
  //   }
  // } catch (error) {
  //   ElMessage.error('搜索帖子失败');
  // }
}



// 商品相关接口实现
// 上传书籍信息
const bookDataBase = reactive({
  id: 1,
  name: 'java',
  author: '张三',
  publisher: '出版社',
  version: '1.0',
  price: 100,
  type: '教材',
  classify: '文学',
  subClassify: '小说',
  isNote: false,
  description: '这是一本关于Java的教材',
  avatar: []
})
const bookDataBase1 = reactive({
  id: 2,
  name: 'java',
  author: '张三',
  publisher: '出版社',
  version: '1.0',
  price: 100,
  type: '教材',
  classify: '文学',
  subClassify: '小说',
  isNote: false,
  description: '这是一本关于Java的教材',
  avatar: []
})

const uploadBookModal = ref(false)
const bookTypes = ['教材', '课外书']
const bookClassifies = ['文学', '科技', '历史', '艺术', '教育', '其他']
const bookSubClassifies = {
  '文学': ['小说', '散文', '诗歌', '戏剧'],
  '科技': ['计算机', '物理', '化学', '生物'],
  '历史': ['中国史', '世界史', '考古学'],
  '艺术': ['绘画', '音乐', '舞蹈', '摄影'],
  '教育': ['教材', '教辅', '考试'],
  '其他': ['其他']
}

// 处理图片上传
const handleBookImageUpload = (event) => {
  const files = event.target.files
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      if (bookDataBase.avatar.length >= 5) {
        ElMessage.warning('最多只能上传5张图片')
        break
      }
      const file = files[i]
      if (file.size > 5 * 1024 * 1024) {
        ElMessage.warning('图片大小不能超过5MB')
        continue
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        bookDataBase.avatar.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
}

// 删除图片
const removeBookImage = (index) => {
  bookDataBase.avatar.splice(index, 1)
}

// 重置表单
const resetBookForm = () => {
  bookDataBase.name = ''
  bookDataBase.author = ''
  bookDataBase.publisher = ''
  bookDataBase.version = ''
  bookDataBase.price = 0
  bookDataBase.type = ''
  bookDataBase.classify = ''
  bookDataBase.subClassify = ''
  bookDataBase.isNote = false
  bookDataBase.description = ''
  bookDataBase.avatar = []
}

// 表单验证
const validateBookForm = () => {
  if (!bookDataBase.name.trim()) {
    ElMessage.error('请输入书名')
    return false
  }
  if (!bookDataBase.author.trim()) {
    ElMessage.error('请输入作者')
    return false
  }
  if (!bookDataBase.publisher.trim()) {
    ElMessage.error('请输入出版社')
    return false
  }
  if (!bookDataBase.type) {
    ElMessage.error('请选择书籍类型')
    return false
  }
  if (!bookDataBase.classify) {
    ElMessage.error('请选择分类')
    return false
  }
  if (bookDataBase.price <= 0) {
    ElMessage.error('请输入有效的价格')
    return false
  }
  return true
}

// 上传书籍
const uploadBookApi = '/api/books/uploadBook'
const uploadBook = async () => {
  if (!validateBookForm()) return
  
  try {
    const response = await axios.post(uploadBookApi, {
      name: bookDataBase.name,
      author: bookDataBase.author,
      publisher: bookDataBase.publisher,
      version: bookDataBase.version,
      price: bookDataBase.price,
      type: bookDataBase.type,
      classify: bookDataBase.classify,
      subClassify: bookDataBase.subClassify,
      isNote: bookDataBase.isNote,
      description: bookDataBase.description,
      avatar: bookDataBase.avatar
    }, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    
    if (response.data.code === 1) {
      ElMessage.success('书籍上传成功')
      resetBookForm()
      uploadBookModal.value = false
      // 刷新书籍列表
      getUserBooks()
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('书籍上传失败，请重试')
  }
}



// 查找书籍商品
const userBooks = reactive({
  List: [bookDataBase, bookDataBase1]
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
      userBooks.List = response.data.data
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error("获取用户书籍商品失败，请重试")
  }
}

// 修改上传的书籍商品信息
const currentEditBook = reactive({
  id: '',
  name: '',
  author: '',
  publisher: '',
  version: '',
  price: 0,
  type: '',
  classify: '',
  subClassify: '',
  isNote: false,
  description: ''
}) // 当前编辑的书籍
const saveBookEdit = async () => {
  try {
    const response = await axios.post('/api/books/updateBook', {
      book_id: currentEditBook.value.id,
      name: currentEditBook.value.name,
      author: currentEditBook.value.author,
      publisher: currentEditBook.value.publisher,
      version: currentEditBook.value.version,
      price: currentEditBook.value.price,
      type: currentEditBook.value.type,
      classify: currentEditBook.value.classify,
      subClassify: currentEditBook.value.subClassify,
      isNote: currentEditBook.value.isNote,
      description: currentEditBook.value.description
    }, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    
    if (response.data.code === 1) {
      ElMessage.success('书籍修改成功')
      closeEditBookModal()
      getUserBooks() // 刷新列表
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('书籍修改失败，请重试')
  }
}

// 下架书籍商品
const selectedBooks = ref([]) // 选中的书籍ID列表
const batchDeleteModal = ref(false) // 批量删除弹窗
const deleteConfirmModal = ref(false) // 单个删除确认弹窗
const currentDeleteBookId = ref(null) // 当前要删除的书籍ID
// 全选计算属性
const selectAll = computed({
  get: () => {
    return userBooks.List.length > 0 && selectedBooks.value.length === userBooks.List.length
  },
  set: (value) => {
    if (value) {
      selectedBooks.value = userBooks.List.map(book => book.id)
    } else {
      selectedBooks.value = []
    }
  }
})

const handleSingleCheckbox = (bookId) => {
  console.log(bookId)
  if (!Array.isArray(selectedBooks.value)) {
    selectedBooks.value = []
  }
  const isSelected = selectedBooks.includes(bookId)
  if (isSelected) {
    const index = selectedBooks.value.indexOf(bookId)
    if (index > -1) {
      selectedBooks.splice(index, 1)
    }
  } else {
    selectedBooks.push(bookId)
  }
}

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
// 确认删除单个书籍
const confirmDeleteBook = async () => {
  if (currentDeleteBookId.value) {
    await deleteBook(currentDeleteBookId.value)
    ElMessage.success('书籍下架成功')
    closeDeleteConfirmModal()
    getUserBooks() // 刷新列表
  }
}
// 确认批量删除
const confirmBatchDelete = async () => {
  try {
    for (const bookId of selectedBooks.value) {
      await deleteBook(bookId)
    }
    ElMessage.success(`成功下架 ${selectedBooks.value.length} 本书籍`)
    closeBatchDeleteModal()
    selectedBooks.value = [] // 清空选择
    getUserBooks() // 刷新列表
  } catch (error) {
    ElMessage.error('批量下架失败，请重试')
  }
}

// 跳转书籍详情页
const goToBookDetail = (bookId) => {
  router.push({
    path: '/bookDetail',
    query: {
      bookId: bookId
    }
  })
}



// 跳转帖子详情页
const goToPostDetail = (postId) => {
  router.push({
    path: '/forumDetail',
    query: {
      postId: postId
    }
  })
}

onMounted(() => {
  getUserInfo()
  getAddressList()
})

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
          <p>个人简介：{{ userInfo.introduction }}</p>
        </div>
        <div class="address-show" @click="openAddressModal">
          <h3>收货地址 <span class="edit-hint">(点击管理)</span></h3>
          <p>{{ defaultAddress}}</p>
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
              <p class="social-intro">{{ item.introduction }}</p>
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
              <p class="social-intro">{{ item.introduction }}</p>
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
              <p class="social-intro">{{ item.introduction }}</p>
            </div>
            <button class="friend-btn follow-back" @click="followUser(item.id)">回关</button>
          </div>
        </div>
      </div>

       <!-- 上传书籍商品 -->
      <div class="upload-book" v-show="currentPage === 'uploadGoodsShow'">
        <div class="upload-book-header">
          <h2 class="upload-book-title">上传书籍商品</h2>
          <button class="upload-book-btn" @click="openUploadBookModal">
            <span class="btn-text">上传书籍</span>
          </button>
        </div>
        
        <div class="upload-book-content">
          <div class="upload-book-form">
            <!-- 基本信息 -->
            <div class="upload-form-section">
              <h3 class="upload-section-title">基本信息</h3>
              <div class="upload-form-row">
                <div class="upload-form-group">
                  <label class="upload-form-label">书名 *</label>
                  <input 
                    type="text" 
                    v-model="bookDataBase.name" 
                    class="upload-form-input"
                    placeholder="请输入书名"
                  />
                </div>
                <div class="upload-form-group">
                  <label class="upload-form-label">作者 *</label>
                  <input 
                    type="text" 
                    v-model="bookDataBase.author" 
                    class="upload-form-input"
                    placeholder="请输入作者"
                  />
                </div>
              </div>
              
              <div class="upload-form-row">
                <div class="upload-form-group">
                  <label class="upload-form-label">出版社 *</label>
                  <input 
                    type="text" 
                    v-model="bookDataBase.publisher" 
                    class="upload-form-input"
                    placeholder="请输入出版社"
                  />
                </div>
                <div class="upload-form-group">
                  <label class="upload-form-label">版本*</label>
                  <input 
                    type="text" 
                    v-model="bookDataBase.version" 
                    class="upload-form-input"
                    placeholder="请输入版本信息"
                  />
                </div>
              </div>
              
              <div class="upload-form-row">
                <div class="upload-form-group">
                  <label class="upload-form-label">价格 *</label>
                  <input 
                    type="number" 
                    v-model="bookDataBase.price" 
                    class="upload-form-input"
                    placeholder="请输入价格"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div class="upload-form-group">
                  <label class="upload-form-label">类型 *</label>
                  <select v-model="bookDataBase.type" class="upload-form-select">
                    <option value="">请选择类型</option>
                    <option v-for="type in bookTypes" :key="type" :value="type">{{ type }}</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- 分类信息 -->
            <div class="upload-form-section">
              <h3 class="upload-section-title">分类信息</h3>
              <div class="upload-form-row">
                <div class="upload-form-group">
                  <label class="upload-form-label">分类 *</label>
                  <select v-model="bookDataBase.classify" class="upload-form-select" @change="bookDataBase.subClassify = ''">
                    <option value="">请选择分类</option>
                    <option v-for="classify in bookClassifies" :key="classify" :value="classify">{{ classify }}</option>
                  </select>
                </div>
                <div class="upload-form-group">
                  <label class="upload-form-label">子分类</label>
                  <select v-model="bookDataBase.subClassify" class="upload-form-select" :disabled="!bookDataBase.classify">
                    <option value="">请选择子分类</option>
                    <option v-for="subClassify in (bookSubClassifies[bookDataBase.classify] || [])" 
                            :key="subClassify" :value="subClassify">{{ subClassify }}</option>
                  </select>
                </div>
              </div>
              
              <div class="upload-form-row">
                <div class="upload-form-group upload-checkbox-group">
                  <label class="upload-checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="bookDataBase.isNote" 
                      class="upload-checkbox-input"
                    />
                    <span class="upload-checkbox-text">是否有笔记</span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- 备注信息 -->
            <div class="upload-form-section">
              <h3 class="upload-section-title">备注信息</h3>
              <div class="upload-form-group">
                <label class="upload-form-label">备注</label>
                <textarea 
                  v-model="bookDataBase.description" 
                  class="upload-form-textarea"
                  placeholder="请输入书籍的备注信息（如新旧程度、使用情况等）"
                  rows="4"
                ></textarea>
              </div>
            </div>
            
            <!-- 图片上传 -->
            <div class="upload-form-section">
              <h3 class="upload-section-title">图片上传 (1-5张)</h3>
              <div class="upload-image-section">
                <div class="upload-image-preview-container">
                  <div 
                    v-for="(image, index) in bookDataBase.avatar" 
                    :key="index" 
                    class="upload-image-preview-item"
                  >
                    <img :src="image" alt="书籍图片" class="upload-preview-image"/>
                    <button class="upload-remove-image-btn" @click="removeBookImage(index)">×</button>
                  </div>
                  <label class="upload-image-upload-btn" v-if="bookDataBase.avatar.length < 5">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      @change="handleBookImageUpload"
                      class="upload-file-input"
                    />
                    <span class="upload-upload-icon">+</span>
                    <span class="upload-upload-text">添加图片</span>
                  </label>
                </div>
                <p class="upload-upload-hint">支持 JPG、PNG 格式，每张图片不超过 5MB</p>
              </div>
            </div>
          </div>
        </div>
      </div> 

      <!-- 查看上传的书籍商品 -->
      <div class="myGoods-container" v-show="currentPage === 'goodsShow'">
        <!-- 批量操作区域 -->
        <div class="myGoods-batch-actions" v-if="userBooks.List && userBooks.List.length > 0">
           <div class="myGoods-select-all">
            <label class="myGoods-checkbox-label">
              <input 
                type="checkbox" 
                v-model="selectAll" 
                class="myGoods-checkbox-input"
              />
              <span class="myGoods-checkbox-text">全选</span>
            </label>
          </div>
          <div class="myGoods-batch-buttons">
            <button 
              class="myGoods-batch-delete-btn" 
              @click="confirmBatchDelete(); openBatchDeleteModal()"
              :disabled="selectedBooks.length <= 1"
            >
              批量下架 ({{ selectedBooks.length }})
            </button>
          </div>
        </div>

        <!-- 商品列表 -->
        <div class="myGoods-list">
          <div 
            v-for="(item, index) in userBooks.List" 
            :key="index"
            class="myGoods-item"
          >
            <!-- 勾选框和序号 -->
            <div class="myGoods-select">
              <label class="myGoods-checkbox-label">
                <input 
                  type="checkbox" 
                  :value="item.id" 
                  v-model="selectedBooks"
                  class="myGoods-checkbox-input"
                  @change="handleSingleCheckbox(item.id)"
                />
                <span class="myGoods-checkbox-custom"></span>
                <span class="myGoods-index">{{ index + 1 }}</span>
              </label>
            </div>

            <!-- 书籍信息 -->
            <div class="myGoods-info" @click="goToBookDetail(item.id)">
              <div class="myGoods-name">{{ item.name }}</div>
              <div class="myGoods-author">作者：{{ item.author }}</div>
              <div class="myGoods-publisher">出版社：{{ item.publisher }}</div>
            </div>

            <!-- 操作按钮 -->
            <div class="myGoods-actions">
              <button 
                class="myGoods-edit-btn" 
                @click="togglePageDisplay('goodsChangeShow'); openEditBookModal(item)"
              >
                修改
              </button>
              <button 
                class="myGoods-delete-btn" 
                @click="confirmDeleteBook(item.id, index); openDeleteConfirmModal(item.id)"
              >
                下架
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态提示 -->
        <div v-if="!userBooks.List || userBooks.List.length === 0" class="myGoods-empty-state">
          <div class="myGoods-empty-icon">📚</div>
          <div class="myGoods-empty-text">暂无上传的书籍商品</div>
        </div>
      </div>

      <!-- 修改书籍信息 -->
      <div class="upload-book" v-show="currentPage === 'goodsChangeShow'">
        <div class="upload-book-header">
          <h2 class="upload-book-title">上传书籍商品</h2>
          <button class="cancel-upload-book-btn" @click="togglePageDisplay('goodsShow');">
            <span class="btn-text">取消修改</span>
          </button>
          <button class="upload-book-btn" @click="saveBookEdit">
            <span class="btn-text">确认修改</span>
          </button>
        </div>
        
        <div class="upload-book-content">
          <div class="upload-book-form">
            <!-- 基本信息 -->
            <div class="upload-form-section">
              <h3 class="upload-section-title">基本信息</h3>
              <div class="upload-form-row">
                <div class="upload-form-group">
                  <label class="upload-form-label">书名 *</label>
                  <input 
                    type="text" 
                    v-model="currentEditBook.name" 
                    class="upload-form-input"
                    placeholder="请输入书名"
                  />
                </div>
                <div class="upload-form-group">
                  <label class="upload-form-label">作者 *</label>
                  <input 
                    type="text" 
                    v-model="currentEditBook.author" 
                    class="upload-form-input"
                    placeholder="请输入作者"
                  />
                </div>
              </div>
              
              <div class="upload-form-row">
                <div class="upload-form-group">
                  <label class="upload-form-label">出版社 *</label>
                  <input 
                    type="text" 
                    v-model="currentEditBook.publisher" 
                    class="upload-form-input"
                    placeholder="请输入出版社"
                  />
                </div>
                <div class="upload-form-group">
                  <label class="upload-form-label">版本*</label>
                  <input 
                    type="text" 
                    v-model="currentEditBook.version" 
                    class="upload-form-input"
                    placeholder="请输入版本信息"
                  />
                </div>
              </div>
              
              <div class="upload-form-row">
                <div class="upload-form-group">
                  <label class="upload-form-label">价格 *</label>
                  <input 
                    type="number" 
                    v-model="currentEditBook.price" 
                    class="upload-form-input"
                    placeholder="请输入价格"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div class="upload-form-group">
                  <label class="upload-form-label">类型 *</label>
                  <select v-model="currentEditBook.type" class="upload-form-select">
                    <option value="">请选择类型</option>
                    <option v-for="type in bookTypes" :key="type" :value="type">{{ type }}</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- 分类信息 -->
            <div class="upload-form-section">
              <h3 class="upload-section-title">分类信息</h3>
              <div class="upload-form-row">
                <div class="upload-form-group">
                  <label class="upload-form-label">分类 *</label>
                  <select v-model="currentEditBook.classify" class="upload-form-select" @change="currentEditBook.subClassify = ''">
                    <option value="">请选择分类</option>
                    <option v-for="classify in bookClassifies" :key="classify" :value="classify">{{ classify }}</option>
                  </select>
                </div>
                <div class="upload-form-group">
                  <label class="upload-form-label">子分类</label>
                  <select v-model="currentEditBook.subClassify" class="upload-form-select" :disabled="!currentEditBook.classify">
                    <option value="">请选择子分类</option>
                    <option v-for="subClassify in (bookSubClassifies[currentEditBook.classify] || [])" 
                            :key="subClassify" :value="subClassify">{{ subClassify }}</option>
                  </select>
                </div>
              </div>
              
              <div class="upload-form-row">
                <div class="upload-form-group upload-checkbox-group">
                  <label class="upload-checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="currentEditBook.isNote" 
                      class="upload-checkbox-input"
                    />
                    <span class="upload-checkbox-text">是否有笔记</span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- 备注信息 -->
            <div class="upload-form-section">
              <h3 class="upload-section-title">备注信息</h3>
              <div class="upload-form-group">
                <label class="upload-form-label">备注</label>
                <textarea 
                  v-model="currentEditBook.description" 
                  class="upload-form-textarea"
                  placeholder="请输入书籍的备注信息（如新旧程度、使用情况等）"
                  rows="4"
                ></textarea>
              </div>
            </div>
            
            <!-- 图片上传 -->
            <div class="upload-form-section">
              <h3 class="upload-section-title">图片上传 (1-5张)</h3>
              <div class="upload-image-section">
                <div class="upload-image-preview-container">
                  <div 
                    v-for="(image, index) in currentEditBook.avatar" 
                    :key="index" 
                    class="upload-image-preview-item"
                  >
                    <img :src="image" alt="书籍图片" class="upload-preview-image"/>
                    <button class="upload-remove-image-btn" @click="removeBookImage(index)">×</button>
                  </div>
                  <label class="upload-image-upload-btn" v-if="currentEditBook.length < 5">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      @change="handleBookImageUpload"
                      class="upload-file-input"
                    />
                    <span class="upload-upload-icon">+</span>
                    <span class="upload-upload-text">添加图片</span>
                  </label>
                </div>
                <p class="upload-upload-hint">支持 JPG、PNG 格式，每张图片不超过 5MB</p>
              </div>
            </div>
          </div>
        </div>
      </div> 
      
      <!-- 帖子展示（我的，收藏，动态） -->
      <div class="forum-show"
        v-if="currentPage === 'postShow' || currentPage === 'collectPostShow' || currentPage === 'dynamicShow'"
      >
        <div class="forum-search-header">
          <div class="forum-search-title-container">
            <h2 class="forum-search-title">
              {{ currentPage === 'postShow' ? '我的帖子' : currentPage === 'collectPostShow' ? '收藏' : '动态' }}
            </h2>
            <span class="forum-search-count" v-if="getShowPost()">
              ({{ getShowPost().length }} 条内容)
            </span>
          </div>
          <div class="forum-search-container">
            <div class="search-input-wrapper">
              <input 
                type="text" 
                placeholder="搜索帖子标题、内容..." 
                v-model="searchKeyword"
                @keyup.enter="searchPost"
                class="forum-search-input"
              >
            </div>
            <button class="forum-search-btn" @click="searchPost">
              <span class="btn-icon">→</span>
              <span class="btn-text">搜索</span>
            </button>
          </div>
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
                <div class="forum-content" @click="goToPostDetail(post.id)">
                  <h2 class="forum-title">{{ post.title }}</h2>
                  <p class="forum-summary">{{ post.summary }}</p>
                </div>
                
                <!-- 帖子数据展示 -->
                <div class="forum-data">
                  <span class="forum-subClassify">#{{ post.sub_classify }}</span>
                  <span class="forum-label">#{{ post.label }}</span>
                  <span class="forum-viewCount" @click="goToPostDetail(post.id)">浏览量:{{ post.page_views }}</span>
                  <span class="forum-replyCount" @click="goToPostDetail(post.id)">评论量:{{ post.comment_count }}</span>
                  <span class="forum-likeCount" @click="goToPostDetail(post.id)">点赞量:{{ post.like_count }}</span>
                  <span class="forum-collectCount" @click="goToPostDetail(post.id)">收藏量:{{ post.collect_count }}</span>
                </div>
              </div>
              
              <!-- 帖子封面图,右侧 -->
              <div class="forum-coverAvatar" @click="goToPostDetail(post.id)">
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
                v-model="editForm.introduction" 
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
                :class="{ 'default-address': address._default }"
              >
                <div class="address-content">
                  <div class="address-detail">
                    <span v-if="address._default" class="default-badge">默认</span>
                    {{ address.shopping_address }}
                  </div>
                  <div class="address-actions">
                    <button 
                      v-if="!address._default" 
                      class="action-btn set-default-btn"
                      @click="changeDefaultAddress(address)"
                    >
                      设为默认
                    </button>
                    <button class="action-btn edit-btn" @click="editAddress(address)">
                      编辑
                    </button>
                    <button 
                      v-if="!address._default" 
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
                v-model="changeAddress.shopping_address" 
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


    <!-- 上传确认弹窗 -->
    <div v-if="uploadBookModal" class="modal-overlay" @click="closeUploadBookModal">
      <div class="modal-content upload-book-modal" @click.stop>
        <div class="modal-header">
          <h3>确认上传书籍</h3>
          <button class="close-btn" @click="closeUploadBookModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="upload-confirm-info">
            <h4>请确认以下信息是否正确：</h4>
            <div class="upload-info-list">
              <p><strong>书名：</strong>{{ bookDataBase.name }}</p>
              <p><strong>作者：</strong>{{ bookDataBase.author }}</p>
              <p><strong>出版社：</strong>{{ bookDataBase.publisher }}</p>
              <p><strong>价格：</strong>¥{{ bookDataBase.price }}</p>
              <p><strong>类型：</strong>{{ bookDataBase.type }}</p>
              <p><strong>分类：</strong>{{ bookDataBase.classify }} {{ bookDataBase.subClassify ? `- ${bookDataBase.subClassify}` : '' }}</p>
              <p><strong>是否有笔记：</strong>{{ bookDataBase.isNote ? '是' : '否' }}</p>
              <p><strong>图片数量：</strong>{{ bookDataBase.avatar.length }} 张</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeUploadBookModal">取消</button>
          <button class="confirm-btn" @click="uploadBook">确认上传</button>
        </div>
      </div>
    </div>

      <!-- 删除确认弹窗 -->
      <div v-if="deleteConfirmModal" class="upload-delete-modal">
        <div class="upload-modal-overlay" @click="closeDeleteConfirmModal"></div>
        <div class="upload-modal-content">
          <div class="upload-modal-header">
            <h3>确认下架</h3>
            <button class="upload-close-btn" @click="closeDeleteConfirmModal">×</button>
          </div>
          <div class="upload-modal-body">
            <p>确定要下架这本书籍吗？此操作不可撤销。</p>
          </div>
          <div class="upload-modal-footer">
            <button class="upload-cancel-btn" @click="closeDeleteConfirmModal">取消</button>
            <button class="upload-confirm-btn" @click="executeDeleteBook">确认下架</button>
          </div>
        </div>
      </div>

      <!-- 批量删除确认弹窗 -->
      <div v-if="batchDeleteModal" class="upload-batch-delete-modal">
        <div class="upload-modal-overlay" @click="closeBatchDeleteModal"></div>
        <div class="upload-modal-content">
          <div class="upload-modal-header">
            <h3>批量下架确认</h3>
            <button class="upload-close-btn" @click="closeBatchDeleteModal">×</button>
          </div>
          <div class="upload-modal-body">
            <p>确定要下架选中的 {{ selectedBooks.length }} 本书籍吗？此操作不可撤销。</p>
          </div>
          <div class="upload-modal-footer">
            <button class="upload-cancel-btn" @click="closeBatchDeleteModal">取消</button>
            <button class="upload-confirm-btn" @click="executeBatchDelete">确认下架</button>
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


/* 上传书籍样式 */
.upload-book {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.upload-book-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 15px;
}

.upload-book-title {
  color: #2e7d32;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.cancel-upload-book-btn {
  margin-left: auto;
  margin-right: 20px;
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background-color 0.3s;
}

.cancel-upload-book-btn:hover {
  background: #e53935;
}



.upload-book-btn {
  background: #81C784;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background-color 0.3s;
}

.upload-book-btn:hover {
  background: #66BB6A;
}

.upload-book-content {
  margin-top: 20px;
}

.upload-book-form {
  width: 100%;
}

.upload-form-section {
  margin-bottom: 25px;
  padding: 15px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

.upload-section-title {
  color: #2e7d32;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.upload-form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.upload-form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.upload-form-label {
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
}

.upload-form-input, .upload-form-select, .upload-form-textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.upload-form-input:focus, .upload-form-select:focus, .upload-form-textarea:focus {
  outline: none;
  border-color: #81C784;
}

.upload-form-textarea {
  resize: vertical;
  min-height: 80px;
}

.upload-checkbox-group {
  flex-direction: row;
  align-items: center;
}

.upload-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.upload-checkbox-input {
  width: 16px;
  height: 16px;
}

.upload-checkbox-text {
  font-weight: normal;
}

/* 图片上传样式 */
.upload-image-section {
  margin-top: 10px;
}

.upload-image-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.upload-image-preview-item {
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.upload-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-remove-image-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-image-upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.3s;
  color: #666;
}

.upload-image-upload-btn:hover {
  border-color: #81C784;
  color: #81C784;
}

.upload-upload-icon {
  font-size: 24px;
  font-weight: bold;
}

.upload-upload-text {
  font-size: 12px;
  margin-top: 5px;
}

.upload-file-input {
  display: none;
}

.upload-upload-hint {
  font-size: 12px;
  color: #666;
  margin: 0;
}

/* 上传确认弹窗样式 */
.upload-book-modal {
  max-width: 500px;
}

.upload-confirm-info h4 {
  color: #2e7d32;
  margin-bottom: 15px;
}

.upload-info-list p {
  margin: 8px 0;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}

.upload-info-list strong {
  color: #333;
  min-width: 80px;
  display: inline-block;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn {
  background: #81C784;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #e8e8e8;
}

.confirm-btn:hover {
  background: #66BB6A;
}


/* 商品显示区域样式 - myGoods前缀 */
.myGoods-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

/* 批量操作区域 */
.myGoods-batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8faf8;
  border-radius: 6px;
  border-left: 4px solid #81C784;
}

.myGoods-select-all {
  display: flex;
  align-items: center;
}

.myGoods-batch-buttons {
  display: flex;
  gap: 10px;
}

.myGoods-batch-delete-btn {
  background: #e57373;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.myGoods-batch-delete-btn:hover:not(:disabled) {
  background: #ef5350;
}

.myGoods-batch-delete-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 商品列表 */
.myGoods-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.myGoods-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8faf8;
  border-radius: 6px;
  border-left: 3px solid #81C784;
  transition: all 0.3s ease;
}

.myGoods-item:hover {
  background: #e8f5e8;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 勾选框和序号 */
.myGoods-select {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.myGoods-checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.myGoods-checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
}

.myGoods-checkbox-custom {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #dcdfe6;
  border-radius: 3px;
  background-color: #fff;
  margin-right: 8px;
  transition: all 0.2s ease;
}

.myGoods-checkbox-input:checked + .myGoods-checkbox-custom {
  background-color: #409eff;
  border-color: #409eff;
}

.myGoods-checkbox-input:checked + .myGoods-checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.myGoods-checkbox-input:focus + .myGoods-checkbox-custom {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.myGoods-checkbox-label:hover .myGoods-checkbox-custom {
  border-color: #409eff;
}

.myGoods-index {
  margin-left: 8px;
  font-weight: 600;
  color: #2e7d32;
  min-width: 20px;
}

/* 书籍信息 */
.myGoods-info {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 40px;
}

.myGoods-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.myGoods-author, .myGoods-publisher {
  font-size: 14px;
  color: #666;
}

/* 操作按钮 */
.myGoods-actions {
  display: flex;
  gap: 8px;
}

.myGoods-edit-btn, .myGoods-delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
}

.myGoods-edit-btn {
  background: #81C784;
  color: white;
}

.myGoods-edit-btn:hover {
  background: #66BB6A;
}

.myGoods-delete-btn {
  background: #e57373;
  color: white;
}

.myGoods-delete-btn:hover {
  background: #ef5350;
}

/* 空状态 */
.myGoods-empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.myGoods-empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.myGoods-empty-text {
  font-size: 16px;
}

/* 弹窗样式 - upload前缀 */
.upload-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.upload-modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
  z-index: 1001;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.upload-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
}

.upload-modal-header h3 {
  color: #2e7d32;
  margin: 0;
}

.upload-close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.upload-close-btn:hover {
  color: #2e7d32;
}

.upload-modal-body {
  padding: 20px;
}

.upload-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e8e8e8;
}

.upload-cancel-btn, .upload-confirm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.upload-cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.upload-cancel-btn:hover {
  background: #e8e8e8;
}

.upload-confirm-btn {
  background: #81C784;
  color: white;
}

.upload-confirm-btn:hover {
  background: #66BB6A;
}

/* 编辑表单 */
.upload-edit-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.upload-form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.upload-form-label {
  font-weight: 500;
  color: #333;
}

.upload-form-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.upload-form-input:focus {
  outline: none;
  border-color: #81C784;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .myGoods-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .myGoods-select {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .myGoods-actions {
    align-self: flex-end;
  }
  
  .myGoods-batch-actions {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .myGoods-batch-buttons {
    justify-content: flex-end;
  }
}


/* 论坛帖子展示区域样式 */
.forum-show {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  height: 100%;
  scroll-behavior: smooth;
}

/* 搜索栏样式 */
.forum-search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.forum-search-title-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.forum-search-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2e7d32;
  margin: 0;
}

.forum-search-count {
  font-size: 0.9rem;
  color: #666;
  background: #f8faf8;
  padding: 4px 8px;
  border-radius: 4px;
}

.forum-search-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.forum-search-input {
  width: 280px;
  padding: 10px 40px 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  font-size: 0.95rem;
  background: #f8faf8;
  transition: all 0.3s ease;
}

.forum-search-input:focus {
  outline: none;
  border-color: #81C784;
  background: white;
  box-shadow: 0 0 0 3px rgba(129, 199, 132, 0.1);
}

.forum-search-input::placeholder {
  color: #999;
}

.search-icon {
  position: absolute;
  right: 12px;
  color: #666;
  font-size: 1rem;
}

.forum-search-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #81C784, #66BB6A);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(129, 199, 132, 0.3);
}

.forum-search-btn:hover {
  background: linear-gradient(135deg, #66BB6A, #4CAF50);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(129, 199, 132, 0.4);
}

.forum-search-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(129, 199, 132, 0.3);
}

.btn-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.forum-search-btn:hover .btn-icon {
  transform: translateX(2px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .forum-search-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .forum-search-title-container {
    justify-content: center;
  }
  
  .forum-search-container {
    justify-content: center;
  }
  
  .forum-search-input {
    width: 100%;
    max-width: 300px;
  }
}

/* 帖子容器样式 */
.forum-posts-container {
  flex: 1;
  overflow-y: auto;
}

.forum-posts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 单个帖子样式 */
.forum-post {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  background: #f8faf8;
  border-radius: 12px;
  border-left: 4px solid #81C784;
  transition: all 0.3s ease;
  cursor: pointer;
}

.forum-post:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  background: white;
}

/* 帖子主要内容区域 */
.forum-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 0;
}

/* 用户信息区域 - 头像和名称在一行 */
.forum-userInfo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.userInfo-avatar-container {
  width: 40px;
  height: 40px;
}

.forum-userInfo-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #81C784;
}

.userInfo-details {
  flex: 1;
}

.userInfo-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2e7d32;
  margin: 0 0 4px 0;
}

.userInfo-stats {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

/* 帖子内容区域 - 标题一行，简介一行 */
.forum-content {
  flex: 1;
  cursor: pointer;
}

.forum-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.forum-title:hover {
  color: #2e7d32;
}

.forum-summary {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

/* 帖子数据区域 - 一行显示 */
.forum-data {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.forum-subClassify, .forum-label {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.forum-subClassify:hover, .forum-label:hover {
  background: #81C784;
  color: white;
}

.forum-viewCount, .forum-replyCount, .forum-likeCount, .forum-collectCount {
  font-size: 0.85rem;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.forum-viewCount:hover, .forum-replyCount:hover, .forum-likeCount:hover, .forum-collectCount:hover {
  color: #2e7d32;
}

/* 帖子封面图 - 在右侧 */
.forum-coverAvatar {
  width: 120px;
  height: 90%;
  margin-left: 20px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.cover-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cover-avatar-img:hover {
  transform: scale(1.05);
}

/* 滚动条样式 */
.forum-posts-container::-webkit-scrollbar {
  width: 6px;
}

.forum-posts-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.forum-posts-container::-webkit-scrollbar-thumb {
  background: #81C784;
  border-radius: 4px;
}

.forum-posts-container::-webkit-scrollbar-thumb:hover {
  background: #66BB6A;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .forum-post {
    flex-direction: column;
    gap: 15px;
  }
  
  .forum-coverAvatar {
    width: 100%;
    height: 150px;
    margin-left: 0;
    order: -1;
  }
  
  .forum-data {
    gap: 8px;
  }
  
  .forum-subClassify, .forum-label,
  .forum-viewCount, .forum-replyCount,
  .forum-likeCount, .forum-collectCount {
    font-size: 0.75rem;
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