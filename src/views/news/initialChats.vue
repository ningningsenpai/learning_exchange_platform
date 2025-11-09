<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

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
      name: '李四',
      avatar: 'src/static/image.png',
      content:'消息内容',
      sendTime:"2023-10-10 10:30",
      isRead: true
    }
  ]
})

const chatDatas = reactive({
    List: [chatData.list[0], chatData.list[1]]
})
// 在线好友数据
const onlineFriends = reactive({
  list: [1]
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
const wsConfig = reactive({
  url: 'ws://localhost:8080/ws/chat', // WebSocket服务器地址
  reconnectInterval: 3000, // 重连间隔(毫秒)
  maxReconnectAttempts: 5, // 最大重连次数
  reconnectAttempts: 0
})
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
        const message = JSON.parse(event.data)
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
        { id: 1, sender: 'friend', content: '你好！', time: '2023-10-10 10:30' },
        { id: 2, sender: 'me', content: '你好，小明！', time: '2023-10-10 10:31' },
        { id: 3, sender: 'friend', content: '最近怎么样？', time: '2023-10-10 10:32' },
        { id: 4, sender: 'me', content: '还不错，你呢？', time: '2023-10-10 10:33' },
        { id: 5, sender: 'friend', content: '我也挺好的，最近在学习Vue.js', time: '2023-10-10 10:35' },
        { id: 6, sender: 'friend', content: '我也挺好的，最近在学习Vue.js', time: '2023-10-10 10:35' },
        { id: 7, sender: 'friend', content: '我也挺好的，最近在学习Vue.js', time: '2023-10-10 10:35' },
      ]
    },
    {
      id: 2,
      name: '张三',
      avatar: 'src/static/image.png',
      messages: [
        { id: 1, sender: 'friend', content: '在吗？', time: '2023-10-10 15:20' },
        { id: 2, sender: 'me', content: '在的，有什么事吗？', time: '2023-10-10 15:22' },
        { id: 3, sender: 'friend', content: '想问一下作业的事情', time: '2023-10-10 15:23' }
      ]
    },
  ]
})
const friendsDatas = reactive({
  list: [friendsData.list[0], friendsData.list[1]]
})
const friendsDataApi = '/api/chat/open'
const getFriendData = async (userId) => {
  try {
    const response = await axios.get(friendsDataApi, {
      params: {
        userId: userId
      }
    })
    friendsDatas.list = response.data
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

// 发送信息
const sendMessage = () => {
  if (newMessage.value.trim() !== '' && activeFriend.value) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const message = {
      id: 0,
      sender: 'me',
      content: newMessage.value,
      time: `${year}-${month}-${day} ${hours}:${minutes}`
    }
    const friend = friendsDatas.list.find((item) => item.id === activeFriend.value.id)
    friend.messages.push(message)
    newMessage.value = ''
    scrollToBottom()
  }
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
        <textarea 
          class="chat-input" 
          placeholder="输入消息..." 
          v-model="newMessage"
          @keydown.enter.prevent="sendMessage"
          rows="3"
        ></textarea>
        <button class="send-button" @click="sendMessage">
          <i class="fas fa-paper-plane"></i>
          发送
        </button>
      </div>
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

.message-time {
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

.message-text {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 4px;
  color: #333;
}

.message-time {
  font-size: 11px;
  color: #9E9E9E;
  text-align: right;
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

.chat-input-area {
  padding: 15px;
  background: white;
  border-top: 1px solid #e8f5e8;
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.input-tools {
  display: flex;
  gap: 6px;
}

.tool-button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #f8faf8;
  border: 1px solid #e8f5e8;
  color: #81C784;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.tool-button:hover {
  background: #81C784;
  color: white;
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e8f5e8;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  background: white;
  line-height: 1.5;
  min-height: 60px;
  max-height: 120px;
}

.chat-input:focus {
  border-color: #81C784;
  box-shadow: 0 0 0 2px rgba(129, 199, 132, 0.1);
}

.send-button {
  padding: 10px 20px;
  background: #81C784;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.send-button:hover {
  background: #66BB6A;
  transform: translateY(-1px);
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
</style>