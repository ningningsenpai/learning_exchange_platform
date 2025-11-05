<script setup>
import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';


// 表单数据
const formData = reactive({
  title: '',
  label: [],
  summary: '',
  content: '',
  coverImage: null
});


// 话题选择相n
const labelBubbleVisible = ref(false);
const label = ref([
  { id: 1, name: '技术讨论' },
  { id: 2, name: '学习心得' },
  { id: 3, name: '资源共享' },
  { id: 4, name: '问题求助' },
  { id: 5, name: '经验分享' },
  { id: 6, name: '课程推荐' },
  { id: 7, name: '工具分享' },
  { id: 8, name: '职业发展' }
]);

// 话题选择按钮位置
const topicButtonRef = ref(null);
// 打开话题气泡
const openTopicBubble = () => {
  topicBubbleVisible.value = true;
};
// 关闭话题气泡
const closeTopicBubble = () => {
  topicBubbleVisible.value = false;
};

// 选择话题
const selectTopic = (topic) => {
  formData.topic = topic.name;
  closeTopicBubble();
};

// 处理封面图片上传
const handleCoverImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.coverImage = file;
    ElMessage.success('封面图片已选择');
  }
};
</script>

<template>
  <div class="release-container">
    <!-- 头部区域 - 优化布局，发布按钮放在右上角 -->
    <div class="release-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="release-title">发布新帖子</h2>
          <p class="release-subtitle">分享你的知识和见解</p>
        </div>
        <button class="release-btn" @click="publishPost">
          <span class="btn-text">发布</span>
          <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 表单内容区域 -->
    <div class="release-form">
      <!-- 帖子标题 -->
      <div class="form-section">
        <label class="section-label">帖子标题</label>
        <div class="input-container">
          <input 
            v-model="formData.title"
            class="title-input" 
            placeholder="请输入帖子标题..."
            type="text"
          />
        </div>
      </div>

      <!-- 话题选择 -->
      <div class="form-section">
        <label class="section-label">选择话题</label>
        <div class="topic-section">
          <div 
            ref="topicButtonRef"
            class="topic-selector" 
            @click="openTopicBubble"
          >
            <span class="topic-display">
              {{ formData.topic ? `#${formData.topic}` : '请选择话题' }}
            </span>
            <svg class="topic-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>

          <!-- 话题气泡弹窗 -->
          <div 
            v-if="topicBubbleVisible"
            class="topic-bubble"
            @click.stop
          >
            <div class="bubble-content">
              <div class="bubble-header">
                <span class="bubble-title">选择话题</span>
                <button class="bubble-close" @click="closeTopicBubble">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              <div class="topic-grid">
                <div 
                  v-for="topic in topics" 
                  :key="topic.id"
                  class="topic-option"
                  @click="selectTopic(topic)"
                >
                  #{{ topic.name }}
                </div>
              </div>
            </div>
            <div class="bubble-arrow"></div>
          </div>
        </div>
      </div>

      <!-- 帖子摘要 -->
      <div class="form-section">
        <label class="section-label">帖子摘要</label>
        <div class="input-container">
          <textarea 
            v-model="formData.summary"
            class="summary-input" 
            placeholder="请输入帖子摘要..."
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- 帖子内容 -->
      <div class="form-section">
        <label class="section-label">帖子内容</label>
        <div class="input-container">
          <textarea 
            v-model="formData.content"
            class="content-input" 
            placeholder="请输入帖子内容..."
            rows="8"
          ></textarea>
        </div>
      </div>

      <!-- 封面图片 -->
      <div class="form-section">
        <label class="section-label">封面图片</label>
        <div class="file-upload-section">
          <label class="file-upload-label">
            <input 
              type="file" 
              class="cover-image-input" 
              accept="image/*"
              @change="handleCoverImageChange"
            />
            <div class="upload-content">
              <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span class="upload-text">点击上传封面图片</span>
            </div>
          </label>
          <div v-if="formData.coverImage" class="file-preview">
            <span class="file-name">封面图片已选择</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.release-container {
  position: relative;
  min-height: 100vh;
  background: #f8f9fa;
}

/* 头部区域优化 - 参考论坛详情页风格 */
.release-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  flex: 1;
}

.release-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
  margin: 0;
}

.release-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 发布按钮优化 - 放在右上角 */
.release-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
}

.release-btn:hover {
  background: #3aa676;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

.release-btn:active {
  transform: translateY(0);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* 表单区域优化 */
.release-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.form-section {
  margin-bottom: 32px;
}

.section-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.input-container {
  width: 100%;
}

/* 输入框样式优化 */
.title-input,
.summary-input,
.content-input {
  width: 100%;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px 20px;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.3s ease;
  background: white;
  box-sizing: border-box;
}

.title-input:focus,
.summary-input:focus,
.content-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.title-input {
  font-size: 18px;
  font-weight: 600;
}

.summary-input,
.content-input {
  resize: vertical;
  line-height: 1.6;
}

.content-input {
  min-height: 250px;
}

/* 话题选择器优化 */
.topic-section {
  position: relative;
}

.topic-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  background: white;
  transition: all 0.3s ease;
  font-size: 16px;
}

.topic-selector:hover {
  border-color: #42b983;
}

.topic-display {
  color: #666;
  font-weight: 500;
}

.topic-display:not(:empty) {
  color: #42b983;
  font-weight: 600;
}

.topic-arrow {
  color: #999;
  transition: transform 0.3s ease;
}

.topic-selector:hover .topic-arrow {
  color: #42b983;
}

/* 话题气泡弹窗优化 */
.topic-bubble {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  z-index: 1000;
}

.bubble-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.bubble-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.bubble-title {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.bubble-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #999;
  transition: all 0.3s ease;
}

.bubble-close:hover {
  background: #f5f5f5;
  color: #333;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.topic-option {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  background: #f8f9fa;
}

.topic-option:hover {
  border-color: #42b983;
  background: #42b983;
  color: white;
}

/* 文件上传区域优化 */
.file-upload-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-upload-label {
  cursor: pointer;
}

.cover-image-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  color: #999;
  min-height: 100px;
}

.upload-content:hover {
  border-color: #42b983;
  color: #42b983;
}

.upload-icon {
  width: 40px;
  height: 40px;
  opacity: 0.7;
}

.upload-text {
  font-weight: 500;
  font-size: 14px;
}

.file-preview {
  padding: 12px 16px;
  background: rgba(66, 185, 131, 0.1);
  border-radius: 6px;
  border-left: 4px solid #42b983;
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-name {
  font-size: 14px;
  color: #42b983;
  font-weight: 500;
}

.file-preview::before {
  content: '✓';
  color: #42b983;
  font-weight: bold;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 16px;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .release-btn {
    width: 100%;
    justify-content: center;
  }
  
  .release-form {
    padding: 24px 16px;
  }
  
  .topic-grid {
    grid-template-columns: 1fr;
  }
  
  .title-input,
  .summary-input,
  .content-input {
    padding: 12px 16px;
  }
  
  .upload-content {
    padding: 24px 16px;
  }
}
</style>