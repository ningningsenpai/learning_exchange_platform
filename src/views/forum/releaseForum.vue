<script setup>
import { reactive, ref, onMounted } from 'vue';
import { ElMessage} from 'element-plus';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore'

// 获取用户存储实例
const userStore = useUserStore()
const JWT_TOKEN = userStore.token

// 表单数据
const formData = reactive({
  title: '',
  label: '',
  classify: '',
  summary: '',
  content: '',
  cover_avatar: null,
  type: 0, // 0:原创, 1:转载
  visible_range: 0, // 0:公开, 1:粉丝可见, 2:好友可见, 3:私人
});

// 话题获取
const labelBubbleVisible = ref(false);
const label = ref([
  
]);
const getLabelApi = '/api/getPostLabels';
const getLabels = async () => {
  try {
    const response = await axios.get(getLabelApi, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if (response.data.code === 1) {
      topics.value = response.data.data;
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('获取话题列表失败，请重试');
  }
};
// 子分类获取
const postClassifies = ref([

])
const getPostClassifies = async () => {
  try {
    const response = await axios.get(postClassifiesApi, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if (response.data.code === 1) {
      postClassifies.value = response.data.data;
    } else {
      ElMessage.error(response.data.msg);
    }
  } catch (error) {
    ElMessage.error('获取帖子分类失败，请重试');
  }
};

// 话题选择按钮位置
const labelButtonRef = ref(null);
const openLabelBubble = () => {
  labelBubbleVisible.value = true;
};
const closeLabelBubble = () => {
  labelBubbleVisible.value = false;
};

// 选择话题
const selectLabel = (label) => {
  if (formData.label.includes(label.name)) {
    ElMessage.warning('该话题已选择');
    return;
  }
  if (formData.label.length >= 5) {
    ElMessage.warning('最多选择5个话题');
    return;
  }
  formData.label.push(label.name);
};

const URL = window.URL || window.webkitURL;
// 格式化文件大小显示
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
// 处理封面图片上传
const handleCoverImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      ElMessage.error('请选择图片文件');
      return;
    }
    // 大小限制为5MB
    if (file.size > 5 * 1024 * 1024) {
      ElMessage.error('图片大小不能超过5MB');
      return;
    }
    formData.cover_avatar = file;
    ElMessage.success('封面图片已选择');
  }
};
// 清除封面图片并释放URL对象
const clearCoverImage = () => {
  if (formData.cover_avatar) {
    formData.cover_avatar = null;
  }
  // 重置文件输入框
  const fileInputs = document.querySelectorAll('.cover-image-input');
  fileInputs.forEach(input => {
    input.value = '';
  });
};

// 发布帖子选择可见范围和版权信息
const submitChooseVisible = ref(false);
const openSubmitChooseVisible = () => {
  submitChooseVisible.value = true;
};
const closeSubmitChooseVisible = () => {
  submitChooseVisible.value = false;
  resetFormData();
};

// 重重表单数据
const resetFormData = () => {
  formData.title = '';
  formData.label = [];
  formData.summary = '';
  formData.content = '';
  formData.cover_avatar = null;
  formData.type = 0; // 0:原创, 1:转载
  formData.visible_range = 0; // 0:公开, 1:粉丝可见, 2:好友可见, 3:私人
};

// 发布帖子
const releaseForumApi = '/api/releaseForum';
const releaseForum = async () => {
  try {
    await axios.post(releaseForumApi, formData, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/json'
      }
    })
    ElMessage.success('发布帖子成功');
    resetFormData();
  } catch (error) {
    ElMessage.error('发布帖子失败')
  }
}

onMounted(() => {
  getLabels();
})

</script>

<template>
  <div class="release-container">
    <!-- 头部区域 -->
    <div class="release-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="release-title">发布新帖子</h2>
          <p class="release-subtitle">分享你的知识和见解</p>
        </div>
        <button class="release-btn" @click="openSubmitChooseVisible">
          <span class="btn-text">发布</span>
          <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 发布信息弹窗 -->
    <div v-if="submitChooseVisible" class="publish-modal-overlay" @click="closeSubmitChooseVisible">
      <div class="publish-modal" @click.stop>
        <!-- 弹窗头部 -->
        <div class="modal-header">
          <h3 class="modal-title">发布信息确认</h3>
          <button class="modal-close" @click="closeSubmitChooseVisible">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- 弹窗内容区域 -->
        <div class="modal-content">
          <!-- 左侧：封面图片区域 -->
          <div class="cover-section">
            <div v-if="formData.cover_avatar" class="cover-preview">
              <img :src="URL.createObjectURL(formData.cover_avatar)" alt="封面预览" class="cover-image">
              <div class="cover-actions">
                <button class="change-cover-btn" @click="clearCoverImage">清除封面</button>
              </div>
            </div>
            <div v-else class="cover-upload">
              <label class="cover-upload-label">
                <input 
                  type="file" 
                  class="cover-upload-input" 
                  accept="image/*"
                  @change="handleCoverImageChange"
                />
                <div class="upload-placeholder">
                  <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
                    <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span class="upload-text">上传封面图片</span>
                  <span class="upload-hint">支持 JPG、PNG 格式，最大 5MB</span>
                </div>
              </label>
            </div>
          </div>

          <!-- 右侧：帖子信息区域 -->
          <div class="post-info-section">
            <div class="post-title">
              <h4>{{ formData.title || '未设置标题' }}</h4>
            </div>
            <div class="post-summary">
              <p>{{ formData.summary || '暂无摘要' }}</p>
            </div>
            <div class="post-content-preview">
              <p>{{ formData.content ? formData.content.substring(0, 200) + (formData.content.length > 200 ? '...' : '') : '暂无内容' }}</p>
            </div>
            <div class="post-tags">
              <span v-for="tag in formData.label" :key="tag" class="tag">#{{ tag }}</span>
              <span v-if="formData.label.length === 0" class="no-tags">未选择话题</span>
            </div>
          </div>
        </div>

        <!-- 底部：设置区域 -->
        <div class="modal-footer">
          <div class="settings-section">
            <!-- 版权选择 -->
            <div class="setting-group">
              <label class="setting-label">版权</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" v-model="formData.type" value="0" class="radio-input">
                  <span class="radio-text">原创</span>
                </label>
                <label class="radio-label">
                  <input type="radio" v-model="formData.type" value="1" class="radio-input">
                  <span class="radio-text">转载</span>
                </label>
              </div>
            </div>

            <!-- 可见范围选择 -->
            <div class="setting-group">
              <label class="setting-label">可见范围</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" v-model="formData.visible_range" value="0" class="radio-input">
                  <span class="radio-text">公开</span>
                </label>
                <label class="radio-label">
                  <input type="radio" v-model="formData.visible_range" value="1" class="radio-input">
                  <span class="radio-text">粉丝可见</span>
                </label>
                <label class="radio-label">
                  <input type="radio" v-model="formData.visible_range" value="2" class="radio-input">
                  <span class="radio-text">好友可见</span>
                </label>
                <label class="radio-label">
                  <input type="radio" v-model="formData.visible_range" value="3" class="radio-input">
                  <span class="radio-text">私人</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 发布按钮 -->
          <div class="action-section">
            <button class="cancel-btn" @click="closeSubmitChooseVisible">取消</button>
            <button class="publish-final-btn" @click="releaseForum">确认发布</button>
          </div>
        </div>
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
            ref="labelButtonRef"
            class="topic-selector" 
            @click="openLabelBubble"
          >
            <span class="topic-display" v-if="formData.label.length === 0">
              请选择话题
            </span>
            <span class="topic-display" v-else v-for="label in formData.label">
              #{{ label }}
            </span>
            <svg class="topic-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>

          <!-- 话题气泡弹窗 -->
          <div 
            v-if="labelBubbleVisible"
            class="topic-bubble"
            @click.stop
          >
            <div class="bubble-content">
              <div class="bubble-header">
                <span class="bubble-title">选择话题</span>
                <button class="bubble-close" @click="closeLabelBubble">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              <div class="topic-grid">
                <div 
                  v-for="label in label" 
                  :key="label.id"
                  class="topic-option"
                  @click="selectLabel(label)"
                >
                  #{{ label.name }}
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
          <div class="upload-container">
            <!-- 左侧上传区域 -->
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
                <span class="upload-hint">支持 JPG、PNG 格式，最大 5MB</span>
              </div>
            </label>
            
            <!-- 右侧图片预览区域 -->
            <div class="image-preview">
              <div v-if="formData.cover_avatar" class="preview-content">
                <img :src="URL.createObjectURL(formData.cover_avatar)" alt="封面图片预览" class="preview-image">
              </div>
              <div v-else class="preview-placeholder">
                <span class="placeholder-text">图片预览</span>
              </div>
            </div>
            <div class="clear-button-container" v-if="formData.cover_avatar">
              <button 
              class="clear-button" 
              @click="clearCoverImage"
              >
              清除封面
            </button>
            </div>
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

/* 发布信息弹窗优化 */
.publish-modal-overlay {
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

.publish-modal {
  background: white;
  border-radius: 12px;
  width: 800px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 2px solid #e0e0e0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  color: #666;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-content {
  display: flex;
  padding: 24px;
  gap: 24px;
  min-height: 300px;
  background: white;
}

/* 左侧封面区域 */
.cover-section {
  flex: 0 0 200px;
}

.cover-preview {
  text-align: center;
}

.cover-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 2px solid #e0e0e0;
}

.cover-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.change-cover-btn {
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.change-cover-btn:hover {
  background: #3aa676;
  transform: translateY(-1px);
}

.clear-cover-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-cover-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.cover-upload-label {
  display: block;
  cursor: pointer;
}

.cover-upload-input {
  display: none;
}

.upload-placeholder {
  width: 200px;
  height: 150px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
  background: #fafafa;
}

.upload-placeholder:hover {
  border-color: #42b983;
  background: #f0f9f4;
}

.upload-text {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

/* 右侧帖子信息区域 */
.post-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-title h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.post-summary p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.post-content-preview p {
  font-size: 13px;
  color: #888;
  margin: 0;
  line-height: 1.4;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.no-tags {
  color: #999;
  font-size: 12px;
}

/* 底部设置区域 */
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
}

.settings-section {
  display: flex;
  gap: 32px;
}

.setting-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.radio-input {
  margin: 0;
}

.radio-text {
  font-size: 14px;
  color: #333;
}

/* 按钮样式优化 */
.cancel-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.publish-final-btn {
  background: #42b983;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
}

.publish-final-btn:hover {
  background: #3aa676;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

.publish-final-btn:active {
  transform: translateY(0);
}

.action-section {
  display: flex;
  gap: 12px;
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

/* 文件上传区域 */
.file-upload-section {
  width: 100%;
}

.upload-container {
  display: flex;
  gap: 16px;
  align-items: stretch;
  min-height: 200px;
}

.file-upload-label {
  cursor: pointer;
  flex: 1;
  width: 80%;
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
  height: 100%;
  min-height: 200px;
  box-sizing: border-box;
}

.upload-content:hover {
  border-color: #42b983;
  color: #42b983;
  background: rgba(66, 185, 131, 0.05);
}

.upload-icon {
  width: 48px;
  height: 48px;
  opacity: 0.7;
}

.upload-text {
  font-weight: 500;
  font-size: 14px;
  text-align: center;
}

/* 图片预览区域 */
.image-preview {
  flex: 1;
  max-width: 200px;
  min-height: 200px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  overflow: hidden;
}

.preview-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-bottom: 1px solid #f0f0f0;
}

.preview-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 14px;
}

.clear-button-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button {
  margin-top: auto;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #81ffc0;
  color: #333;
}

.clear-button:hover {
  background: #66ffb3;
  border-color: #66ffb3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .upload-container {
    flex-direction: column;
  }
  
  .file-upload-label {
    max-width: 100%;
  }
  
  .upload-content {
    min-height: 120px;
    padding: 24px;
  }
  
  .image-preview {
    min-height: 150px;
  }
  
  .preview-image {
    height: 120px;
  }
}
</style>