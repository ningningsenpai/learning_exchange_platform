<script setup>
import { reactive, onMounted, ref} from 'vue';
import { ElMessage, ElMessageBox} from 'element-plus';
import axios from 'axios';
import router from '@/router'

// 获取帖子详情
const forumId = ref('')
const forumPost = reactive({
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
  is_followed: false
})

// 评论数据结构
const comments = reactive({
  List: [
    {
      id: '1',
      content: '这个帖子写得真好，学到了很多！',
      user_avatar: 'src/static/image.png',
      user_name: '学习爱好者',
      create_time: '2024-06-01 10:30:00',
      reply_count: 2,
      replies: [
        {
          id: '1-1',
          parent_id: '1',
          content: '我也觉得写得不错，特别是关于Vue的部分',
          user_avatar: 'src/static/image.png',
          user_name: '前端开发者',
          create_time: '2024-06-01 11:00:00'
        },
        {
          id: '1-2',
          parent_id: '1',
          content: '感谢分享，很有帮助！',
          user_avatar: 'src/static/image.png',
          user_name: '新手程序员',
          create_time: '2024-06-01 11:30:00'
        }
      ]
    },
    {
      id: '2',
      content: '有没有更详细的代码示例？',
      user_avatar: 'src/static/image.png',
      user_name: '代码探索者',
      create_time: '2024-06-01 12:00:00',
      reply_count: 1,
      replies: [
        {
          id: '2-1',
          parent_id: '2',
          content: '作者可以补充一些实际项目的代码',
          user_avatar: 'src/static/image.png',
          user_name: '项目实践者',
          create_time: '2024-06-01 12:30:00'
        }
      ]
    }
  ]
})

// 评论弹窗控制
const commentDialogVisible = ref(false)
const replyToUser = ref('') // 当前回复的用户名
const replyToCommentId = ref('') // 当前回复的评论ID
const commentContent = ref('') // 评论内容

// 展开/收起回复的状态
const expandedReplies = ref({})

// 打开评论弹窗
const openCommentDialog = () => {
  commentDialogVisible.value = true
  replyToUser.value = ''
  replyToCommentId.value = ''
  commentContent.value = ''
}

// 关闭评论弹窗
const closeCommentDialog = () => {
  commentDialogVisible.value = false
}

// 发送评论 API
const insertCommentApi = '/api/insertComment'
const sendComment = async () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  
  try {
    const response = await axios.post(insertCommentApi, {
      post_id: forumId.value,
      content: commentContent.value,
      parent_id: replyToCommentId.value || null
    })
    
    if (response.data.code === 1) {
      ElMessage.success(replyToCommentId.value ? '回复成功' : '评论成功')
      
      // 刷新评论列表
      await getForumComments()
      forumPost.comment_count++
      
      closeCommentDialog()
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('发送评论失败')
  }
}

// 获取帖子评论
const getForumCommentsApi = '/api/getCommentsByPostId'
const getForumComments = async () => {
  try {
    const response = await axios.get(getForumCommentsApi, {
      params: {
        post_id: forumId.value
      }
    })
    if(response.data.code == 1) {
      comments.List = response.data.data
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('获取帖子评论失败')
  }
}

// 回复评论
const replyToComment = (commentId, userName) => {
  replyToCommentId.value = commentId
  replyToUser.value = userName
  commentContent.value = `回复${userName}：`
  // 自动聚焦到输入框
  setTimeout(() => {
    const textarea = document.querySelector('.comment-input textarea')
    if (textarea) {
      textarea.focus()
    }
  }, 100)
}

// 切换回复展开状态
const toggleReplies = (commentId) => {
  expandedReplies.value[commentId] = !expandedReplies.value[commentId]
}

// 添加点赞和收藏状态
const isLiked = ref(false)
const isCollected = ref(false)

// 点赞功能
const handleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    forumPost.like_count++
  } else {
    forumPost.like_count--
  }
}

// 收藏功能
const handleCollect = () => {
  isCollected.value = !isCollected.value
  if (isCollected.value) {
    forumPost.collect_count++
  } else {
    forumPost.collect_count--
  }
}

// 关注功能
const handleFollow = () => {
  forumPost.is_followed = !forumPost.is_followed
}

const getForumDetailApi = '/api/getPostInfoById'
const getForumDetail = async () => {
  try {
    const response = await axios.get(getForumDetailApi, {
      params: {
        post_id: forumId.value
      }
    })
    if(response.data.code == 1) {
      Object.assign(forumPost, response.data.data)
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('获取帖子详情失败')
  }
}

onMounted(() => {
  forumId.value =  router.currentRoute.value.query.forumId
  console.log('forumId:', forumId.value)
  getForumDetail()
  getForumComments()
})
</script>

<template>
  <div class="forum-container">
    <!-- 内容区域 -->
    <div class="forum-content">
      <!-- 标题 -->
      <h2 class="forum-title">{{forumPost.title}}</h2>
      <!-- 版权，发布时间，阅读量，点赞数，收藏数 -->
      <div class="forum-data">
        <span>版权：{{forumPost.type}}</span>
        <span>发布时间：{{forumPost.publish_date}}</span>
        <span>阅读量：{{forumPost.page_views}}</span>
        <span>点赞数：{{forumPost.like_count}}</span>
        <span>收藏数：{{forumPost.collect_count}}</span>
      </div>
      <!-- 标签 -->
      <div class="forum-label">
        <span v-for="(item, index) in forumPost.label" :key="index" class="forum-label-item">{{item}}</span>
      </div>
      <!-- 简介 -->
      <div class="forum-summary">
        <p>{{forumPost.summary}}</p>
      </div>
      <!-- 正文 -->
      <div class="forum-body">
        <p>{{forumPost.content}}</p>
      </div>
    </div>

    <!-- 作者信息区域 - 固定在底部 -->
    <div class="forum-author-fixed">
      <div class="author-info">
        <img :src="forumPost.author_avatar" alt="作者头像" class="author-avatar"/>
        <span class="author-name">{{forumPost.author_name}}</span>
        <button 
          class="follow-button" 
          :class="{ 'followed': forumPost.is_followed }"
          @click="handleFollow"
        >
          {{ forumPost.is_followed ? '已关注' : '关注' }}
        </button>
      </div>
      <div class="forum-actions">
        <button 
          class="action-button like-button" 
          :class="{ 'liked': isLiked }"
          @click="handleLike"
          :title="isLiked ? '取消点赞' : '点赞'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                  :fill="isLiked ? '#ff4757' : 'currentColor'"/>
          </svg>
          <span class="action-count">{{ forumPost.like_count }}</span>
        </button>
        
        <button 
          class="action-button collect-button" 
          :class="{ 'collected': isCollected }"
          @click="handleCollect"
          :title="isCollected ? '取消收藏' : '收藏'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" 
                  :fill="isCollected ? '#ffa502' : 'currentColor'"/>
          </svg>
          <span class="action-count">{{ forumPost.collect_count }}</span>
        </button>
        
        <button 
          class="action-button comment-button"
          title="评论"
          @click="openCommentDialog"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v13l4-4h9c.55 0 1-.45 1-1z" 
                  fill="currentColor"/>
          </svg>
          <span class="action-count">{{ forumPost.comment_count }}</span>
        </button>
      </div>
    </div>

    <!-- 评论弹窗 -->
    <div class="comment-dialog" :class="{ 'active': commentDialogVisible }">
      <div class="comment-dialog-content" @click.stop>
        <!-- 弹窗头部 -->
        <div class="comment-dialog-header">
          <h3>评论 ({{ forumPost.comment_count }})</h3>
          <button class="close-button" @click="closeCommentDialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- 评论输入区域 -->
        <div class="comment-input">
          <div class="reply-hint" v-if="replyToUser">
            回复：<span class="reply-user">{{ replyToUser }}</span>
            <button class="cancel-reply" @click="replyToUser = ''; replyToCommentId = ''; commentContent = ''">取消</button>
          </div>
          <textarea 
            v-model="commentContent" 
            placeholder="写下你的评论..."
            rows="3"
          ></textarea>
          <div class="comment-actions">
            <button class="send-button" @click="sendComment">发送</button>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comment-list">
          <div 
            v-for="comment in comments.List" 
            :key="comment.id" 
            class="comment-item"
          >
            <!-- 评论内容 -->
            <div class="comment-main">
              <img :src="comment.user_avatar" alt="用户头像" class="comment-avatar"/>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-user">{{ comment.user_name }}</span>
                  <span class="comment-time">{{ comment.create_time }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
                <div class="comment-actions">
                  <button class="action-btn" @click="replyToComment(comment.id, comment.user_name)">
                    回复
                  </button>
                </div>
              </div>
            </div>

            <!-- 回复列表 -->
            <div class="replies-section" v-if="comment.replies && comment.replies.length > 0">
              <!-- 展开/收起按钮 -->
              <div class="replies-toggle" @click="toggleReplies(comment.id)">
                <span class="toggle-text">
                  {{ expandedReplies[comment.id] ? '收起' : '展开' }} {{ comment.reply_count }} 条回复
                </span>
                <svg 
                  class="toggle-icon" 
                  :class="{ 'expanded': expandedReplies[comment.id] }"
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>

              <!-- 回复列表内容 -->
              <div class="replies-list" v-show="expandedReplies[comment.id]">
                <div 
                  v-for="reply in comment.replies" 
                  :key="reply.id" 
                  class="reply-item"
                >
                  <img :src="reply.user_avatar" alt="用户头像" class="reply-avatar"/>
                  <div class="reply-content">
                    <div class="reply-header">
                      <span class="reply-user">{{ reply.user_name }}</span>
                      <span class="reply-time">{{ reply.create_time }}</span>
                    </div>
                    <p class="reply-text">{{ reply.content }}</p>
                    <div class="reply-actions">
                      <button class="action-btn" @click="replyToComment(comment.id, reply.user_name)">
                        回复
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forum-container {
  position: relative;
  min-height: 100vh;
  padding-bottom: 80px; /* 为底部固定区域留出空间 */
}

.forum-content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.forum-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

.forum-data {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
}

.forum-data span {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.forum-label {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.forum-label-item {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
}

.forum-summary {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #42b983;
}

.forum-summary p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.forum-body {
  line-height: 1.8;
  color: #333;
}

.forum-body p {
  margin: 0;
}

/* 底部固定区域 */
.forum-author-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 500;
  color: #333;
}

.follow-button {
  padding: 6px 16px;
  border: 1px solid #42b983;
  background: white;
  color: #42b983;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.follow-button:hover {
  background: #f0f9f4;
}

.follow-button.followed {
  background: #42b983;
  color: white;
}

.forum-actions {
  display: flex;
  gap: 16px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  background: white;
  color: #606266;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  min-width: 80px;
  justify-content: center;
}

.action-button:hover {
  border-color: #42b983;
  color: #42b983;
  background: #f8f9fa;
}

.action-button.liked {
  background: #fff5f5;
  color: #ff4757;
  border-color: #ff4757;
}

.action-button.liked:hover {
  background: #ffe6e6;
}

.action-button.collected {
  background: #fff9e6;
  color: #ffa502;
  border-color: #ffa502;
}

.action-button.collected:hover {
  background: #fff3d1;
}

.action-button.comment-button {
  background: #f0f9f4;
  color: #42b983;
  border-color: #42b983;
}

.action-button.comment-button:hover {
  background: #e6f7ef;
  color: #3aa676;
}

.action-count {
  font-size: 14px;
  font-weight: 500;
  min-width: 20px;
  text-align: center;
}

/* 评论弹窗样式 */
.comment-dialog {
  position: fixed;
  top: 0;
  right: -100%;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 2000;
  display: flex;
  flex-direction: column;
}

.comment-dialog.active {
  right: 0;
}

.comment-dialog.active .comment-dialog-overlay {
  display: block;
}

.comment-dialog-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
}

.comment-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
}

.comment-dialog-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background: #f5f5f5;
}

.comment-input {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.reply-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.reply-user {
  color: #42b983;
  font-weight: 500;
}

.cancel-reply {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
  color: #666;
}

.cancel-reply:hover {
  background: #e0e0e0;
}

.comment-input textarea {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.comment-input textarea:focus {
  outline: none;
  border-color: #42b983;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.send-button {
  background: #42b983;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-button:hover {
  background: #3aa676;
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.comment-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.comment-item {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-main {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-user {
  font-weight: 500;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  margin: 0 0 12px 0;
  color: #333;
  line-height: 1.5;
}

.comment-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: none;
  border: none;
  color: #42b983;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.action-btn:hover {
  background: #f0f9f4;
}

.replies-section {
  margin-top: 16px;
  margin-left: 52px;
}

.replies-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #42b983;
  font-size: 14px;
  margin-bottom: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.replies-toggle:hover {
  background: #f0f9f4;
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.replies-list {
  border-left: 2px solid #f0f0f0;
  padding-left: 16px;
}

.reply-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.reply-item:last-child {
  margin-bottom: 0;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.reply-content {
  flex: 1;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.reply-user {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.reply-time {
  font-size: 12px;
  color: #999;
}

.reply-text {
  margin: 0 0 8px 0;
  color: #333;
  line-height: 1.5;
  font-size: 14px;
}

.reply-actions {
  display: flex;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .forum-author-fixed {
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px;
  }
  
  .author-info {
    justify-content: center;
  }
  
  .forum-actions {
    width: 100%;
    justify-content: space-around;
  }
  
  .comment-dialog {
    width: 100%;
  }
  
  .replies-section {
    margin-left: 0;
  }
}
</style>