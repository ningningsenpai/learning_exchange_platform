<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

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

// 好友列表数据
const chatData = reactive({
  list: [
    {
      id: 1,
      name: '张三',
      avatar: 'src/static/image.png',
      content:'消息内容',
      sendTime:"2023-10-10 10:30",
      isRead: false
    },
    {
      id: 2,
      name: '张三',
      avatar: 'src/static/image.png',
      content:'消息内容',
      sendTime:"2023-10-10 10:30",
      isRead: true
    }
  ]
})

const chatDatas = reactive({
    List: [chatData.list[1], chatData.list[0]]
})
// 在线好友数据
const onlineFriends = reactive({
  list: []
})
// 判断是否在线
const isOnline = (friendId) => {
  const isOnline = onlineFriends.list.includes(friendId)
  return isOnline
}

// WebSocket建立连接
const ws = ref(null)
const isConnected = ref(false)
const connectionStatus = ref('disconnected')
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsConfig = reactive({
  url: protocol + '//10.244.193.207:8080/websocket/chat', // WebSocket服务器地址
  reconnectInterval: 3000, // 重连间隔(毫秒)
  maxReconnectAttempts: 5, // 最大重连次数
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
const connectWebSocket = () => {
  try {
    // 如果已有连接，先关闭
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.close()
    }  
    ws.value = new WebSocket(wsConfig.url)   
    // 连接成功
    ws.value.onopen = () => {
      console.log('WebSocket连接成功')
      isConnected.value = true
      connectionStatus.value = 'connected'
      wsConfig.reconnectAttempts = 0
    }
    
    // 接收消息
    ws.value.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data.data)
        handleWebSocketMessage(message)
      } catch (error) {
        console.error('消息解析错误:', error)
      }
    }
    // 连接关闭
    ws.value.onclose = (event) => {
      console.log('WebSocket连接关闭:', event.code, event.reason)
      isConnected.value = false
      connectionStatus.value = 'disconnected'
      // 如果不是正常关闭，尝试重连
      if (event.code !== 1000) {
        handleReconnect()
      }
    }
    // 连接错误
    ws.value.onerror = (error) => {
      console.error('WebSocket连接错误:', error)
      connectionStatus.value = 'error'
    }   
  } catch (error) {
    console.error('WebSocket连接失败:', error)
    connectionStatus.value = 'error'
  }
}

// 处理WebSocket消息
const handleWebSocketMessage = (message) => {
  switch (message.type) {
    case 'friend':
      handleFriendMessage(message)
      break
    case 'online':
      handleOnlineMessage(message)
      break
    case 'message':
      handleMessage(message)
      break
    default:
      console.log('未知消息类型:', message.type)
  }
}
const handleFriendMessage = (message) => {
    chatDatas.List.push(message.list)
}
const handleOnlineMessage = (message) => {
    onlineFriends.list = message.list
}
const handleMessage = (message) => {
    const user = friendsDatas.list.find((item) => item.id === message.sender_id)
    if (user) {
        user.messages.push(message.message)
    } else {
        chatDatas.List.push({
            id: message.sender_id,
            name: message.sender_name,
            avatar: message.sender_avatar,
            content: message.message.content,
            sendTime: message.message.time,
            isRead: false
        })
        const tempUser = friendsDatas.list.find((item) => item.id === message.sender_id)
        tempUser.messages.push(message.message)
    }
}


// 好友列表数据
const friendsData = reactive({
  list: [
    {
      id: 1,
      name: '张三',
      avatar: 'src/static/image.png',
      messages: [
        { id: 1, type: 'text', sender: 'friend', content: '你好！', time: '2023-10-10 10:30' },
        { id: 2, type: 'text', sender: 'me', content: '你好，小明！', time: '2023-10-10 10:31' },
        { id: 3, type: 'text', sender: 'friend', content: '最近怎么样？', time: '2023-10-10 10:32' },
        { id: 4, type: 'text', sender: 'me', content: '还不错，你呢？', time: '2023-10-10 10:33' },
        { id: 5, type: 'text', sender: 'friend', content: '我也挺好的，最近在学习Vue.js', time: '2023-10-10 10:35' },
        { id: 6, type: 'text', sender: 'friend', content: '我也挺好的，最近在学习Vue.js', time: '2023-10-10 10:35' },
        { id: 7, type: 'text', sender: 'friend', content: '我也挺好的，最近在学习Vue.js', time: '2023-10-10 10:35' },
        { id: 8, type: 'image', sender: 'friend', imageUrl: 'src/static/image.png', time: '2023-10-10 10:35' },
      ]
    },
    {
      id: 2,
      name: '张三',
      avatar: 'src/static/image.png',
      messages: [
        { id: 1, type: 'text', sender: 'friend', content: '在吗？', time: '2023-10-10 15:20' },
        { id: 2, type: 'text', sender: 'me', content: '在的，有什么事吗？', time: '2023-10-10 15:22' },
        { id: 3, type: 'text', sender: 'friend', content: '想问一下作业的事情', time: '2023-10-10 15:23' }
      ]
    },
  ]
})
const friendsDatas = reactive({
  list: []
})
const friendsDataApi = '/api/chat/open'
const getFriendData = async (userId) => {
  try {
    const response = await axios.get(friendsDataApi, {
      params: {
        userId: userId
      }
    })
    friendsDatas.list = response.data.data
  } catch (error) {
    console.error('获取聊天记录失败:', error)
  }
}


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
// 分组数据
const friendGroups = reactive([
  {
    id: 1,
    name: '系统消息',
    count: 0,
  },
  {
    id: 2,
    name: '默认分组',
    count: chatDatas.List.length,
  },
])

// 切换分组展开状态
const toggleGroup = (groupId) => {
  groupExpanded.value[groupId] = !groupExpanded.value[groupId]
}

// 选择好友
const selectFriend = (friend) => {
  friend.isRead = true
  activeFriend.value = friend
  scrollToBottom()
}

// 搜索好友
const searchFriends = () => {
  filteredFriends.value = friendsDatas.list.filter(friend => 
    friend.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
}

// 匹配好友消息
const checkMessages = (friendId) => {
  getFriendData(userInfo.id)
  const friend = friendsDatas.list.find((item) => item.id === friendId)
  if (friend) {
    return friend.messages
  } else {
    return []
  }
}

// 发送消息文字和图片消息（webSocket使用）
const sendMessageToWebSocket = (message) => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify(message))
  } else {
    console.error('WebSocket 连接未打开')
  }
}
// 发送文字消息
const sendTextMessage = () => {
  const message = {
    id: activeFriend.value.id,
    message: newMessage.value,
  }
  sendMessageToWebSocket(message)
  newMessage.value = ''
}
// 上传图片
const selectedFile = ref(null)
const imagePreviewUrl = ref('')
function handleImageUpload(event) {
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

// 清除已选择的图片
const clearSelectedImage = () => {
  selectedFile.value = null
  imagePreviewUrl.value = ''
  // 重置文件输入框
  const fileInput = document.querySelector('.image-upload-input')
  if (fileInput) {
    fileInput.value = ''
  }
}
// 格式化文件大小显示
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 发送图片消息
const sendImageMessage = () => {
  const message = {
    id: activeFriend.value.id,
    message: selectedFile.value,
  }
  sendMessageToWebSocket(message)
  selectedFile.value = null
  imagePreviewUrl.value = ''
}
// 发送信息(前端渲染展示使用)
const sendMessage = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  if (newMessage.value !== '' && activeFriend.value && !selectedFile.value) {
    const message = {
      id: 0,
      sender: 'me',
      type: 'text',
      content: newMessage.value,
      time: `${year}-${month}-${day} ${hours}:${minutes}`
    }
    const friend = friendsDatas.list.find((item) => item.id === activeFriend.value.id)
    friend.messages.push(message)
    scrollToBottom()
  }
  if(selectedFile.value && activeFriend.value && newMessage.value === '') {
    const message = {
      id: 0,
      sender: 'me',
      type: 'image',
      imageUrl: imagePreviewUrl,
      time: `${year}-${month}-${day} ${hours}:${minutes}`
    }
    const friend = friendsDatas.list.find((item) => item.id === activeFriend.value.id)
    friend.messages.push(message)
    scrollToBottom()
  }
}
// 判断发送消息的类型
const handleMessageType = () => {
  if (selectedFile.value) {
    sendMessage()
    sendImageMessage()
  } else {
    sendMessage()
    sendTextMessage()
  }
} 

// 图片放大功能
const enlargedImage = ref(null)
const showImageModal = ref(false)

// 打开图片放大模态框
const openImageModal = (imageUrl) => {
  enlargedImage.value = imageUrl
  showImageModal.value = true
}

// 关闭图片放大模态框
const closeImageModal = () => {
  showImageModal.value = false
  enlargedImage.value = null
}

// 监听消息变化，自动滚动到底部
watch(() => activeFriend.value?.id, () => {
  scrollToBottom()
})

// 监听当前好友的消息数组变化
watch(() => {
  if (activeFriend.value) {
    const friend = friendsDatas.list.find(item => item.id === activeFriend.value.id)
    return friend ? friend.messages.length : 0
  }
  return 0
}, () => {
  scrollToBottom()
})

onMounted(() => {
  getUserInfo()
  if (activeFriend.value) {
    scrollToBottom()
  }
  connectWebSocket()
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
          <div class="user-status">在线</div>
        </div>
      </div>
      
      <!-- 搜索框 -->
      <div class="search-box">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="搜索联系人、群聊" 
            v-model="searchText"
            @keyup.enter="searchFriends"
          >
          <button class="search-btn" @click="searchFriends">
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
                v-for="friend in chatDatas.List" 
                :key="friend.id"
                @click="selectFriend(friend)"
                :class="{ active: activeFriend && activeFriend.id === friend.id }"
              >
                <div class="friend-avatar" :class="isOnline(friend.id) ? 'online' : 'offline'">
                  <img :src="friend.avatar" alt="" class="friend-avatar-image">
                </div>
                <div class="friend-info">
                  <div class="friend-name">{{ friend.name }}</div>
                  <div class="friend-status">
                     {{ friend.content }}
                  </div>
                </div>
                <div class="friend-indicator" v-if="!friend.isRead"></div>
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
          <div class="friend-avatar" :class="isOnline(activeFriend.id) ? 'online' : 'offline'">
            <img :src="activeFriend.avatar" alt="" class="friend-avatar-image">
          </div>
          <div class="friend-details">
            <div class="friend-name">{{ activeFriend.name }}</div>
            <div class="friend-status" :class="isOnline(activeFriend.id) ? 'online' : 'offline'">
              {{ isOnline(activeFriend.id) ? '在线' : '离线' }}
            </div>
          </div>
        </div>
      </div>
      
     <!-- 消息区域 -->
      <div class="chat-messages" v-if="activeFriend" ref="messagesContainer">
        <div 
          class="message" 
          :class="message.sender === 'me' ? 'sent' : 'received'"
          v-for="message in checkMessages(activeFriend.id)" 
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
                :alt="activeFriend.name + '的头像'" 
                class="avatar-image"
              >
              <div v-else class="avatar-fallback">
                {{ activeFriend.name ? activeFriend.name.charAt(0) : '友' }}
              </div>
            </div>
          </div>
          
          <!-- 消息内容区域 -->
          <div class="message-content">
            <div class="message-text">{{ message.content }}</div>
            <div v-if="message.imageUrl" class="message-image">
              <img 
                :src="message.imageUrl" 
                alt="" 
                class="image-content"
                @click="openImageModal(message.imageUrl)"
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
          @keydown.enter.prevent="handleMessageType"
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
  padding: 10px 15px;
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
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  color: white;
  font-size: 14px;
  position: relative;
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
  width: 8px;
  height: 8px;
  background: #4CAF50;
  border-radius: 50%;
  border: 2px solid white;
}

.friend-info {
  flex: 1;
  overflow: hidden;
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

.friend-indicator {
  width: 8px;
  height: 8px;
  background: #ff6b6b;
  border-radius: 50%;
  margin-left: 8px;
}

/* 右侧聊天区域样式 */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
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
  max-width: 50px;
  max-height: 50px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.message-time {
  margin-top: 20px;
  font-size: 11px;
  color: #9e9e9e;
  text-align: right;
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

/* 消息图片样式优化 */

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
  .image-content {
    max-width: 250px;
    max-height: 250px;
  }
  
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