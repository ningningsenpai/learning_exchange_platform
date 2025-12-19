<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

// 获取用户存储实例
const userStore = useUserStore()
const JWT_TOKEN = userStore.token

// 获取用户信息
const userInfoApi = '/api/getUserInfo'
const userInfo = reactive({
  id: 0,
  username: '',
  avatar: '',
  grade: '',
  major: '',
  summary: '',
})
const getUserInfo = async () => {
  try {
    const response = await axios.get(userInfoApi, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/json'
      }
    })
    if(response.data.code === 1) {
      Object.assign(userInfo, response.data.data)
      // 获取用户信息后连接WebSocket
      connectWebSocket()
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error("获取用户信息失败，请重试")
  }
}

// WebSocket配置 - 修改为与后端CORS配置匹配
const isConnected = ref(false)
const connectionStatus = ref('disconnected')

// 根据当前页面协议动态构建WebSocket URL
const getWebSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = '10.244.193.207:8080' // 使用当前页面的host，确保同源
  // const host = '192.168.43.23:8080' // 使用当前页面的host，确保同源
  return `${protocol}//${host}/websocket/chat?token=${encodeURIComponent(JWT_TOKEN)}&user_id=${userInfo.id}`
}

const wsConfig = reactive({
  url: getWebSocketUrl(),
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  reconnectAttempts: 0
})

// 重连处理
const handleReconnect = () => {
  if (wsConfig.reconnectAttempts < wsConfig.maxReconnectAttempts) {
    wsConfig.reconnectAttempts++
    console.log(`尝试重连... (${wsConfig.reconnectAttempts}/${wsConfig.maxReconnectAttempts})`)
    setTimeout(() => {
      connectWebSocket()
    }, wsConfig.reconnectInterval)
  } else {
    console.error('达到最大重连次数，停止重连')
    ElMessage.error('WebSocket连接失败，请检查服务器状态')
  }
}

let ws = null;
// 连接WebSocket - 修改连接逻辑
const connectWebSocket = () => {
  try {
    // 如果已有连接，先关闭
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close()
    }

    // 更新WebSocket URL，包含最新的token
    wsConfig.url = getWebSocketUrl()
    console.log('连接WebSocket:', wsConfig.url)
    
    ws = new WebSocket(wsConfig.url)

    // 连接成功
    ws.onopen = () => {
      if(ws !== null) {
        console.log('WebSocket连接成功')
        isConnected.value = true
        connectionStatus.value = 'connected'
        wsConfig.reconnectAttempts = 0
        ElMessage.success('连接成功')
      } else {
        ElMessage.error('连接失败')
      }
    }

    // 接收消息 - 修复消息解析逻辑
    ws.onmessage = (event) => {
      
      try {
        console.log('收到原始消息:', event.data)
        const data = JSON.parse(event.data)

        if (data.code === 1 && data.data) {
          handleWebSocketMessage(data.data)
        } else {
          console.log('非标准消息格式:', data)
        }
      } catch (error) {
        console.error('消息解析错误:', error)
        console.log('原始消息:', event.data)
      }
    }

    // 连接关闭
    ws.onclose = (event) => {
      console.log('WebSocket连接关闭:', event.code, event.reason)
      isConnected.value = false
      connectionStatus.value = 'disconnected'
      
      if (event.code !== 1000) {
        ElMessage.warning('连接已断开，正在尝试重连...')
        handleReconnect()
      } else {
        ElMessage.info('连接已关闭')
      }
    }

    // 连接错误
    ws.onerror = (error) => {
      console.error('WebSocket连接错误:', error)
      connectionStatus.value = 'error'
      ElMessage.error('连接错误')
    }

  } catch (error) {
    console.error('WebSocket连接失败:', error)
    connectionStatus.value = 'error'
    ElMessage.error('连接失败')
  }
}

// 配置axios默认值以匹配后端CORS
axios.defaults.withCredentials = true

// 处理WebSocket消息
const handleWebSocketMessage = (messageData) => {
  console.log('处理消息:', messageData)

  switch (messageData.type) {
    case 'focusfriend':
      handleFocusFriendMessage(messageData)
      break
    case 'friend':
      handleFriendMessage(messageData)
      break
    case 'status_change':
      handleOnlineStatus(messageData)
      break
    case 'online':
      handleAllOnlineStatus(messageData)
      break
    case 'message':
      handleRealtimeMessage(messageData)
      break
    default:
      console.log('未知消息类型:', messageData.type)
  }
}

const chatMessage = reactive({
  recentChatsList: [
    { id: 1,
      name: '用户1',
      avatar: 'https://example.com/avatar1.jpg',
      content: '你好',
      sendTime: '2023-10-10 10:00:00',
      isRead: false,
      messages: [
        {
          id: 1,
          sender: 'friend',
          type: 'message',
          content: '你好',
          time: '2023-10-10 10:00:00'
        }
      ],
      isOnline: false
    }
  ],
  focusFriendList: []
})

// 分组数据
const friendGroups = reactive([
  {
    id: 1,
    name: '最近消息',
    count: computed(() => chatMessage.recentChatsList.length),
  },
  {
    id: 2,
    name: '好友消息',
    count: computed(() => chatMessage.focusFriendList.length),
  },
])

// 处理最近聊天消息
const handleFriendMessage = (messageData) => {
    if(messageData.list && Array.isArray(messageData.list)) {
      messageData.list.forEach(chat => {
        chatMessage.recentChatsList.push({
          avatar: chat.avatar,
          name: chat.name,
          isRead: chat.isRead,
          id: chat.id,
          isOnline: false,
          content: chat.content,
          sendTime: chat.sendTime,
          messages: []
        })
      })
    }
}


// 处理好友列表消息
const handleFocusFriendMessage = (messageData) => {
    if(messageData.list && Array.isArray(messageData.list)) {
      messageData.list.forEach(friend => {
        chatMessage.focusFriendList.push({
          avatar: friend.avatar,
          name: friend.name,
          isRead: friend.isRead,
          id: friend.id,
          isOnline: false,
          content: friend.content,
          sendTime: friend.sendTime,
          messages: []
        })
      })
    }
}

// 判断展开状态下渲染的好友列表
const selectFriendGroup = (groupId) => {
  if(groupId === 1) {
    return chatMessage.recentChatsList
  } else if(groupId === 2) {
    return chatMessage.focusFriendList
  }
}

// 改变好友状态（仅限已经存在的好友）
const handleOnlineStatus = (messageData) => {
  if(chatMessage.recentChatsList || chatMessage.focusFriendList) {
    const changeFriendInRecent = chatMessage.recentChatsList.find(friend => friend.id === messageData.id)
    if(changeFriendInRecent) {
      changeFriendInRecent.isOnline = messageData.is_online
    }
    const changeFriendInFocus = chatMessage.focusFriendList.find(friend => friend.id === messageData.id)
    if(changeFriendInFocus) {
      changeFriendInFocus.isOnline = messageData.is_online
    }
  }
}

// 处理所有好友状态
const handleAllOnlineStatus = (messageData) => {
  if(chatMessage.recentChatsList || chatMessage.focusFriendList) {
    for(const online of messageData.list) {
      const changeFriendInRecent = chatMessage.recentChatsList.find(friend => friend.id === online)
      if(changeFriendInRecent) {
        changeFriendInRecent.isOnline = true
      }
      const changeFriendInFocus = chatMessage.focusFriendList.find(friend => friend.id === online)
      if(changeFriendInFocus) {
        changeFriendInFocus.isOnline = true
      }
    }
  }
}

// 处理实时消息
const handleRealtimeMessage = (messageData) => {
  console.log('处理实时消息:', messageData)

  const fromUserId = messageData.sender_id
  const messageContent = messageData.message.content
  const senderName = messageData.sender_name || `用户${fromUserId}`

  // 查找或创建好友
  let friend = chatMessage.recentChatsList.find(item => item.id === fromUserId) || chatMessage.focusFriendList.find(item => item.id === fromUserId)
  console.log('friend:', friend)
  // if (!friend) {
  //   friend = {
  //     id: fromUserId,
  //     name: senderName,
  //     avatar: messageData.sender_avatar || '',
  //     content: messageContent,
  //     sendTime: new Date().toLocaleString(),
  //     isRead: false,
  //     messages: [],
  //     isOnline: isOnline(fromUserId)
  //   }
  //   focusFriendDatas.List.unshift(friend)
  // }

  // 添加消息
  const newMessage = {
    id: messageData.message.id,
    sender: 'friend',
    type: messageData.message.type,
    content: messageContent,
    time: messageData.message.sendTime || new Date().toLocaleString()
  }

  // 检查是否已存在相同ID的消息（避免重复添加）
  const existingMessageIndex = friend.messages.findIndex(msg => msg.id === newMessage.id)
  if (existingMessageIndex === -1) {
    // 按时间顺序插入消息
    const insertIndex = friend.messages.findIndex(msg => 
      new Date(msg.time || msg.sendTime) > new Date(newMessage.time)
    )
    
    if (insertIndex === -1) {
      friend.messages.push(newMessage)
    } else {
      friend.messages.splice(insertIndex, 0, newMessage)
    }
  }
  // 更新最后一条消息内容
  friend.content = messageContent
  friend.sendTime = new Date().toLocaleString()
  friend.isRead = activeFriend.value?.id === fromUserId

  // 如果当前正在与发送者聊天，滚动到底部
  if (activeFriend.value?.id === fromUserId) {
    scrollToBottom()
  } else {
    // 显示通知并增加未读计数
    // showNewMessageNotification(fromUserId, senderName, messageContent)
    // addUnreadMessage(fromUserId)
  }

  // console.log('消息已添加到聊天记录')
}

// 选择好友
const selectFriend = async (friend) => {
  friend.isRead = true
  activeFriend.value = friend

  // 清除该好友的未读消息
  clearUnreadMessages(friend.id)

  // 获取好友聊天记录
  getFriendData(friend.id)

  scrollToBottom()
}

// 获取好友聊天记录 - 确保使用正确的请求配置
const friendsDataApi = '/api/talk/open'
const getFriendData = async (friendId) => {
  try {
    const response = await axios.get(friendsDataApi, {
      params: { 
        friendId: friendId 
      },
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if (response.data.code === 1 && response.data.data) {
      const friend = chatMessage.focusFriendList.find(item => item.id === friendId)
      if(friend) {
        friend.messages = response.data.data.message
      } else {
        const friendInRecent = chatMessage.recentChatsList.find(item => item.id === friendId)
        if(friendInRecent) {
          friendInRecent.messages = response.data.data.message
        }
      }
      console.log('好友聊天记录:', friend.messages)
    } else {
      console.error('获取聊天记录失败:', response.data.msg)
    }
  } catch (error) {
    console.error('获取聊天记录失败:', error)
  }
}


// 处理在线状态消息
const onlineFriends = reactive({
  list: []
})

// 判断是否在线
const isOnline = (friendId) => {
  return onlineFriends.list.includes(friendId)
}

// 未读消息处理
const unreadMessages = reactive({})

// // 添加未读消息
// const addUnreadMessage = (friendId) => {
//   if (!unreadMessages[friendId]) {
//     unreadMessages[friendId] = 0
//   }
//   unreadMessages[friendId]++
//   updateUnreadBadges()
// }

// 清除未读消息
const clearUnreadMessages = (friendId) => {
  if (unreadMessages[friendId]) {
    delete unreadMessages[friendId]
    updateUnreadBadges()
  }
}

// 更新未读徽章
const updateUnreadBadges = () => {
  // 这里可以添加更新UI未读徽标的逻辑
  console.log('未读消息更新:', unreadMessages)
}



// // 显示新消息通知
// const showNewMessageNotification = (fromUserId, fromUserName, content) => {
//   ElNotification({
//     title: `新消息来自 ${fromUserName}`,
//     message: content.length > 50 ? content.substring(0, 50) + '...' : content,
//     type: 'info',
//     duration: 5000,
//     onClick: () => {
//       // 点击通知时打开与该好友的聊天
//       const friend = focusFriendDatas.List.find(item => item.id === fromUserId)
//       if (friend) {
//         selectFriend(friend)
//       }
//     }
//   })
// }



// 响应式数据
const activeFriend = ref(null)
const newMessage = ref('')
const searchText = ref('')
const messagesContainer = ref(null)

// 滚动到底部函数
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      const container = messagesContainer.value
      container.scrollTop = container.scrollHeight
    }
  })
}

// 分组展开状态
const groupExpanded = ref({
  1: false,
  2: true
})



// 切换分组展开状态
const toggleGroup = (groupId) => {
  groupExpanded.value[groupId] = !groupExpanded.value[groupId]
}



// 搜索好友
const filteredFriends = computed(() => {
  if (!searchText.value) return focusFriendDatas.List
  return focusFriendDatas.List.filter(friend =>
      friend.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// 发送消息到WebSocket
const sendMessageToWebSocket = (message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    // 修复消息格式，确保toUserId是数字
    const messageData = {
      toUserId: parseInt(activeFriend.value.id), // 确保是数字
      message: message
    }
    console.log('发送消息:', messageData)
    ws.send(JSON.stringify(messageData))
    return true
  } else {
    console.error('WebSocket 连接未打开')
    ElMessage.error('连接未就绪，请检查网络')
    return false
  }
}

// 发送文字消息
const sendTextMessage = () => {
  if (!newMessage.value.trim()) return

  const sent = sendMessageToWebSocket(newMessage.value)
  if (sent) {
    // 前端立即显示自己发送的消息
    const message = {
      id: Date.now(),
      sender: 'me',
      type: 'text',
      content: newMessage.value,
      time: new Date().toLocaleString()
    }

    if (activeFriend.value) {
      activeFriend.value.messages.push(message)
      activeFriend.value.content = newMessage.value
      activeFriend.value.sendTime = new Date().toLocaleString()
    }

    newMessage.value = ''
    scrollToBottom()
  }
}

// 图片上传相关
const selectedFile = ref(null)
const imagePreviewUrl = ref('')

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过5MB')
    return
  }

  selectedFile.value = file

  // 创建预览URL
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreviewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const clearSelectedImage = () => {
  selectedFile.value = null
  imagePreviewUrl.value = ''
  const fileInput = document.querySelector('.image-upload-input')
  if (fileInput) {
    fileInput.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 发送图片消息 - 确保使用正确的请求配置
const sendImageMessage = async () => {
  if (!selectedFile.value) return

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('toUserId', activeFriend.value.id)

    const response = await axios.post('/api/file/uploadImageMessage', formData, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.code === 1) {
      const imageUrl = response.data.data
      const sent = sendMessageToWebSocket(imageUrl)

      if (sent) {
        // 前端立即显示图片消息
        const message = {
          id: Date.now(),
          sender: 'me',
          type: 'image',
          imageUrl: imageUrl,
          time: new Date().toLocaleString()
        }

        if (activeFriend.value) {
          if (!activeFriend.value.messages) {
            activeFriend.value.messages = []
          }
          activeFriend.value.messages.push(message)
          activeFriend.value.content = '[图片]'
          activeFriend.value.sendTime = new Date().toLocaleString()
        }

        clearSelectedImage()
        scrollToBottom()
      }
    } else {
      ElMessage.error('图片上传失败: ' + response.data.msg)
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('图片上传失败')
  }
}

// 处理消息发送
const handleMessageType = () => {
  if (selectedFile.value) {
    sendImageMessage()
  } else if (newMessage.value.trim()) {
    sendTextMessage()
  }
}

// 处理回车键发送
const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleMessageType()
  }
}

// 图片放大功能
const enlargedImage = ref(null)
const showImageModal = ref(false)

const openImageModal = (imageUrl) => {
  enlargedImage.value = imageUrl
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  enlargedImage.value = null
}

// 监听消息变化，自动滚动到底部
watch(() => activeFriend.value?.id, () => {
  scrollToBottom()
})

watch(() => {
  if (activeFriend.value && activeFriend.value.messages) {
    return activeFriend.value.messages.length
  }
  return 0
}, () => {
  scrollToBottom()
})

// 监听token变化，重新连接WebSocket
watch(() => JWT_TOKEN, (newToken) => {
  if (newToken) {
    connectWebSocket()
  }
})

onMounted(() => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close(1000)
  }
  getUserInfo()
})
</script>

<template>
  <div class="chat-container">
    <!-- 左侧边栏 -->
    <div class="sidebar">
      <!-- 用户信息 -->
      <div class="user-info">
        <div class="user-avatar">
          <img :src="userInfo.avatar" alt="用户头像" class="user-avatar-image">
        </div>
        <div class="user-details">
          <div class="user-name">{{ userInfo.username }}</div>
          <div class="user-status" :class="connectionStatus">
            {{ connectionStatus === 'connected' ? '在线' : '离线' }}
          </div>
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="search-box">
        <div class="search-container">
          <input
              type="text"
              placeholder="搜索联系人、群聊"
              v-model="searchText"
          >
          <button class="search-btn">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <!-- 好友列表 -->
      <div class="friends-container">
        <!-- 分组列表 -->
        <div class="friend-group" v-for="group in friendGroups" :key="group.id">
          <div class="group-header" @click="toggleGroup(group.id)">
            <div class="group-title">
              <i class="group-icon" :class="groupExpanded[group.id] ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
              <span>{{ group.name }}</span>
            </div>
            <div class="group-count">{{ group.count }}</div>
          </div>
          <div class="group-content" v-show="groupExpanded[group.id]">
            <ul class="friend-list">
              <li
                  class="friend-item"
                  v-for="friend in selectFriendGroup(group.id)"
                  :key="friend.id"
                  @click="selectFriend(friend)"
                  :class="{ active: activeFriend && activeFriend.id === friend.id }"
              >
                <div class="friend-avatar" :class="friend.isOnline ? 'online' : 'offline'">
                  <img :src="friend.avatar" alt="" class="friend-avatar-image">
                </div>
                <div class="friend-info">
                  <div class="friend-name">{{ friend.name }}</div>
                  <div class="friend-status" :class="friend.isRead ? 'read' : 'unread'">
                    {{ friend.content }}
                  </div>
                </div>
                <div class="friend-meta">
                  <div class="friend-time">{{ friend.sendTime }}</div>
                  <div class="friend-online-status" :class="friend.isOnline ? 'online' : 'offline'">
                    {{ friend.isOnline ? '在线' : '离线' }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧聊天区域 -->
    <div class="chat-area">
      <!-- 聊天头部 -->
      <div class="chat-header" v-if="activeFriend">
        <div class="friend-info-header">
          <div class="friend-avatar" :class="activeFriend.isOnline ? 'online' : 'offline'">
            <img :src="activeFriend.avatar" alt="" class="friend-avatar-image">
          </div>
          <div class="friend-details">
            <div class="friend-name">{{ activeFriend.name }}</div>
            <div class="friend-status" :class="activeFriend.isOnline ? 'online' : 'offline'">
              {{ activeFriend.isOnline ? '在线' : '离线' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 消息区域 -->
      <div class="chat-messages" v-if="activeFriend" ref="messagesContainer">
        <div
            class="message"
            :class="message.sender === 'me' ? 'sent' : 'received'"
            v-for="message in activeFriend.messages"
            :key="message.id"
        >
          <!-- 头像区域 -->
          <div class="message-avatar">
            <!-- 自己发送的消息显示用户头像 -->
            <div v-if="message.sender === 'me'" class="avatar-content">
              <img
                  v-if="userInfo.avatar"
                  :src="userInfo.avatar"
                  alt="我的头像"
                  class="avatar-image"
              >
              <div v-else class="avatar-fallback">
                {{ userInfo.username ? userInfo.username.charAt(0) : '我' }}
              </div>
            </div>

            <!-- 好友发送的消息显示好友头像 -->
            <div v-else class="avatar-content">
              <img
                  v-if="activeFriend.avatar"
                  :src="activeFriend.avatar"
                  class="avatar-image"
              >
              <div v-else class="avatar-fallback">
                {{ activeFriend.name ? activeFriend.name.charAt(0) : '友' }}
              </div>
            </div>
          </div>

          <!-- 消息内容区域 -->
          <div class="message-content">
            <div v-if="message.type === 'text'" class="message-text">{{ message.content }}</div>
            <div v-if="message.type === 'image'" class="message-image">
              <img
                  :src="message.imageUrl || message.content"
                  alt=""
                  class="image-content"
                  @click="openImageModal(message.imageUrl || message.content)"
              >
            </div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
      </div>

      <!-- 无聊天时的提示 -->
      <div class="no-chat" v-else>
        <div class="no-chat-content">
          <div class="no-chat-icon">
            <i class="far fa-comments"></i>
          </div>
          <div class="no-chat-text">选择一个好友开始聊天</div>
          <div class="no-chat-hint">与好友分享学习心得和生活点滴</div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input-area" v-if="activeFriend">
        <!-- 图片预览区域 -->
        <div class="image-preview" v-if="imagePreviewUrl">
          <div class="preview-container">
            <img :src="imagePreviewUrl" alt="图片预览" class="preview-image">
            <div class="preview-info">
              <span class="file-name">{{ selectedFile?.name }}</span>
              <span class="file-size">{{ formatFileSize(selectedFile?.size) }}</span>
            </div>
            <button class="preview-remove" @click="clearSelectedImage">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <textarea
            class="chat-input"
            placeholder="输入消息..."
            v-model="newMessage"
            @keydown="handleKeydown"
            rows="3"
        ></textarea>
        <div class="action-buttons">
          <label class="image-upload-button">
            <input
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="image-upload-input"
                hidden
            >
            <i class="fas fa-image"></i>
            {{ imagePreviewUrl ? '更换图片' : '上传图片' }}
          </label>
          <button class="send-button" @click="handleMessageType" :disabled="!newMessage.trim() && !selectedFile">
            <i class="fas fa-paper-plane"></i>
            发送
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 图片放大模态框 -->
  <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeImageModal">
        <i class="fas fa-times"></i>
      </button>
      <img :src="enlargedImage" alt="放大图片" class="enlarged-image">
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  height: 100%;
  width: 100%;
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border: 1px solid #e8f5e8;
}

/* 左侧边栏样式 */
.sidebar {
  width: 300px;
  background: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e8f5e8;
}

.user-info {
  padding: 20px;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
  color: #2e7d32;
  border-bottom: 1px solid #e8f5e8;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #81C784;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  margin-right: 12px;
  color: white;
  border: 2px solid white;
  position: relative;
}

.user-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-status {
  font-size: 12px;
  color: #4CAF50;
}

.user-status.disconnected {
  color: #9E9E9E;
}

.search-box {
  padding: 15px;
  background: #f8faf8;
  border-bottom: 1px solid #e8f5e8;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-container input {
  width: 100%;
  padding: 10px 40px 10px 12px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #333;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.search-container input:focus {
  border-color: #81C784;
  box-shadow: 0 0 0 2px rgba(129, 199, 132, 0.1);
}

.search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #81C784;
  cursor: pointer;
  font-size: 14px;
}

.friends-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.friend-group {
  margin-bottom: 8px;
}

.group-header {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f5f5f5;
}

.group-header:hover {
  background-color: #f8faf8;
}

.group-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #2e7d32;
  font-size: 14px;
}

.group-icon {
  margin-right: 8px;
  font-size: 12px;
  color: #81C784;
  transition: transform 0.3s ease;
}

.group-count {
  font-size: 12px;
  color: #666;
  background: #f0f9f4;
  padding: 2px 8px;
  border-radius: 10px;
  color: #4CAF50;
}

.group-content {
  transition: all 0.3s ease;
}

.friend-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.friend-item {
  padding: 12px 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border-left: 3px solid transparent;
}

.friend-item:hover {
  background-color: #f8faf8;
  border-left-color: #81C784;
}

.friend-item.active {
  background-color: #f0f9f4;
  border-left-color: #81C784;
}

.friend-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  color: white;
  font-size: 14px;
  position: relative;
  flex-shrink: 0;
}

.friend-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.friend-avatar.online {
  background: #4CAF50;
}

.friend-avatar.offline {
  background: #9E9E9E;
}

.friend-avatar.online::after {
  content: '';
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #4CAF50;
  border-radius: 50%;
  border: 2px solid white;
}

.friend-avatar.offline::after {
  content: '';
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #9E9E9E;
  border-radius: 50%;
  border: 2px solid white;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid white;
}

.friend-info {
  flex: 1;
  overflow: hidden;
  min-width: 0;
}

.friend-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-status {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 未读消息样式 - 红色显示 */
.friend-status.unread {
  color: #ff4757;
  font-weight: 600;
}

/* 已读消息样式 */
.friend-status.read {
  color: #666;
  font-weight: normal;
}

.friend-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 8px;
  flex-shrink: 0;
}

.friend-time {
  font-size: 10px;
  color: #999;
  margin-bottom: 4px;
}

.friend-online-status {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
}

.friend-online-status.online {
  background: #e8f5e8;
  color: #4CAF50;
}

.friend-online-status.offline {
  background: #f5f5f5;
  color: #9E9E9E;
}

/* 右侧聊天区域样式 */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
}

.chat-header {
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #e8f5e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.friend-info-header {
  display: flex;
  align-items: center;
}

.friend-details {
  margin-left: 12px;
}

.friend-details .friend-name {
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 2px;
}

.friend-details .friend-status {
  font-size: 12px;
  color: #4CAF50;
}

.friend-details .friend-status.offline {
  color: #9E9E9E;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  align-items: flex-start;
  max-width: 80%;
}

.message.sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.received {
  align-self: flex-start;
}

/* 头像样式优化 */
.message-avatar {
  width: 40px;
  height: 40px;
  margin: 0 12px;
  flex-shrink: 0;
  border-radius: 50%;
}

.avatar-content {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  background: #81C784;
  border-radius: 50%;
}

/* 消息内容样式优化 */
.message-content {
  max-width: calc(100% - 64px);
  background: white;
  padding: 12px 16px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
}

.message.sent .message-content {
  background: linear-gradient(135deg, #e3f2fd 0%, #c8e6c9 100%);
  border-bottom-right-radius: 4px;
}

.message.received .message-content {
  background: white;
  border-bottom-left-radius: 4px;
  border: 1px solid #f0f0f0;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 6px;
  word-break: break-word;
}

/* 图片消息样式 */
.message-image {
  margin-bottom: 6px;
}

.image-content {
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.image-content:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.message-time {
  font-size: 11px;
  color: #9e9e9e;
  text-align: right;
  margin-top: 4px;
}

/* 消息气泡箭头效果 */
.message.sent .message-content::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 12px;
  width: 0;
  height: 0;
  border-left: 8px solid #c8e6c9;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.message.received .message-content::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 12px;
  width: 0;
  height: 0;
  border-right: 8px solid white;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .message {
    max-width: 90%;
  }
  
  .message-avatar {
    width: 36px;
    height: 36px;
    margin: 0 8px;
  }
  
  .message-content {
    max-width: calc(100% - 52px);
    padding: 10px 14px;
  }
  
  .message-text {
    font-size: 13px;
  }

  .image-content {
    max-width: 250px;
    max-height: 250px;
  }
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.no-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8faf8;
}

.no-chat-content {
  text-align: center;
  color: #666;
}

.no-chat-icon {
  font-size: 60px;
  margin-bottom: 15px;
  color: #c8e6c9;
}

.no-chat-text {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2e7d32;
}

.no-chat-hint {
  font-size: 14px;
  color: #81C784;
}

/* 图片预览样式 */
.image-preview {
  margin-bottom: 5px;
  padding: 12px;
  background: #f8faf8;
  border: 1px solid #e8f5e8;
  border-radius: 8px;
}

.preview-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #e0e0e0;
}

.preview-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.file-size {
  font-size: 12px;
  color: #666;
}

.preview-remove {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #ff6b6b;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.3s ease;
}

.preview-remove:hover {
  background: #ff5252;
  transform: scale(1.1);
}

/* 聊天输入区域样式优化 */
.chat-input-area {
  padding: 16px;
  background: #f8faf8;
  border-top: 1px solid #e8f5e8;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-input {
  width: 95%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  background: white;
  transition: all 0.3s ease;
  min-height: 80px;
  max-height: 120px;
}

.chat-input:focus {
  outline: none;
  border-color: #81C784;
  box-shadow: 0 0 0 2px rgba(129, 199, 132, 0.1);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.image-upload-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0f9f4;
  border: 1px solid #81C784;
  border-radius: 6px;
  padding: 8px 12px;
  color: #2e7d32;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.image-upload-button:hover {
  background: #e8f5e8;
  transform: translateY(-1px);
}

.image-upload-button i {
  font-size: 16px;
}

.send-button {
  background: #81C784;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 24px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.send-button:hover:not(:disabled) {
  background: #66BB6A;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(129, 199, 132, 0.3);
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.send-button:active:not(:disabled) {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-preview {
    padding: 8px;
    margin-bottom: 8px;
  }
  
  .preview-container {
    gap: 8px;
  }
  
  .preview-image {
    width: 50px;
    height: 50px;
  }
  
  .file-name {
    max-width: 150px;
    font-size: 13px;
  }
  
  .file-size {
    font-size: 11px;
  }
  
  .chat-input-area {
    padding: 12px;
    gap: 8px;
  }
  
  .action-buttons {
    gap: 8px;
  }
  
  .image-upload-button {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .chat-input {
    padding: 10px 12px;
    min-height: 70px;
  }
  
  .send-button {
    padding: 8px 20px;
    font-size: 13px;
  }
}

/* 滚动条样式 */
.friends-container::-webkit-scrollbar,
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.friends-container::-webkit-scrollbar-track,
.chat-messages::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.friends-container::-webkit-scrollbar-thumb,
.chat-messages::-webkit-scrollbar-thumb {
  background: #c8e6c9;
  border-radius: 3px;
}

.friends-container::-webkit-scrollbar-thumb:hover,
.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #81C784;
}

/* 固定大小，禁止整体滚动 */
.chat-container {
  overflow: hidden;
}

.sidebar, .chat-area {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-container {
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .chat-area {
    width: 100%;
  }
}

/* 图片放大模态框样式 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.enlarged-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
    max-height: 95%;
    padding: 15px;
  }
  
  .modal-close {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}
</style>