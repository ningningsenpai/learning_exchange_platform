<script setup>
import { reactive, ref, onMounted } from 'vue';
import { ElMessage} from 'element-plus';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router';

// 获取路由实例
const router = useRouter()

// 获取用户存储实例
const userStore = useUserStore()
const JWT_TOKEN = userStore.token

// 表单数据
const formData = reactive({
  title: '',
  label: '',
  subject: '',
  sub_classify: '',
  summary: '',
  content: '',
  cover_avatar_file: null, // 用于保存文件对象
  cover_avatar_url: '',    // 用于保存预览URL
  type: '原创',
  visible_range: '公开',
});

// 分类选项（大类）
const subjectOptions = ref([
  '计算机',
  '文学',
  '地理',
  '历史',
  '数学',
  '物理',
  '化学',
  '生物',
  '经济',
  '艺术',
  '体育',
  '其他'
]);

// 子分类选项
const subClassifyOptions = reactive({
  '计算机': ['人工智能', 'Java编程技术', 'Web前端开发', 'Python', '数据科学', '网络安全', '数据库', '操作系统', '算法与数据结构', '软件工程'],
  '文学': ['小说', '诗歌', '散文', '戏剧', '文学理论', '文学史'],
  '地理': ['自然地理', '人文地理', '区域地理', '地理信息技术'],
  '历史': ['中国史', '世界史', '古代史', '近代史', '现代史'],
  '数学': ['高等数学', '线性代数', '概率统计', '离散数学'],
  '物理': ['力学', '电磁学', '热学', '光学', '量子物理'],
  '化学': ['无机化学', '有机化学', '物理化学', '分析化学'],
  '生物': ['细胞生物学', '遗传学', '生态学', '生物化学'],
  '经济': ['微观经济学', '宏观经济学', '金融学', '国际贸易'],
  '艺术': ['绘画', '音乐', '舞蹈', '戏剧', '摄影'],
  '体育': ['篮球', '足球', '游泳', '田径', '健身'],
  '其他': ['其他']
});

// 话题选项
const labelOptions = ref(['考试', '笔记', '分享', '讨论', '求助', '资源']);

// 文章类型选项
const typeOptions = ref(['原创', '转载']);

// 可见范围选项
const visibleRangeOptions = ref(['公开', '粉丝可见', '好友可见', '私人']);

// 上传状态
const isUploading = ref(false);
const submitChooseVisible = ref(false);

// 处理封面图片上传 - 仅预览
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

    formData.cover_avatar_file = file;

    // 创建预览URL
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.cover_avatar_url = e.target.result;
    };
    reader.readAsDataURL(file);

    ElMessage.success('封面图片已选择');
  }
};

// 清除封面图片
const clearCoverImage = () => {
  formData.cover_avatar_file = null;
  formData.cover_avatar_url = '';
  // 重置文件输入框
  const fileInputs = document.querySelectorAll('.cover-image-input');
  fileInputs.forEach(input => {
    input.value = '';
  });
};

// 打开确认弹窗
const openSubmitChooseVisible = () => {
  // 验证必填字段
  const errors = [];

  if (!formData.title.trim()) {
    errors.push('帖子标题');
  }
  if (!formData.content.trim()) {
    errors.push('帖子内容');
  }
  if (!formData.subject) {
    errors.push('文章分类');
  }
  if (!formData.label) {
    errors.push('文章话题');
  }
  if (!formData.type) {
    errors.push('文章类型');
  }
  if (!formData.visible_range) {
    errors.push('可见范围');
  }

  if (errors.length > 0) {
    ElMessage.warning(`请填写以下必填项：${errors.join('、')}`);
    return;
  }

  submitChooseVisible.value = true;
};

const closeSubmitChooseVisible = () => {
  submitChooseVisible.value = false;
};

// 重置表单数据
const resetFormData = () => {
  formData.title = '';
  formData.label = '';
  formData.subject = '';
  formData.sub_classify = '';
  formData.summary = '';
  formData.content = '';
  formData.cover_avatar_file = null;
  formData.cover_avatar_url = '';
  formData.type = '原创';
  formData.visible_range = '公开';
};

// 上传图片到阿里云
const uploadImageToOSS = async (file) => {
  if (!file) return '';

  const formDataToUpload = new FormData();
  formDataToUpload.append('image', file);

  try {
    const response = await axios.post('/api/upload', formDataToUpload, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.code === 1) {
      return response.data.data; // 返回阿里云路径
    } else {
      ElMessage.error('图片上传失败: ' + (response.data.msg || '未知错误'));
      return '';
    }
  } catch (error) {
    console.error('上传图片失败:', error);
    ElMessage.error('图片上传失败，请稍后重试');
    return '';
  }
};

// 发布帖子
const releaseForum = async () => {
  isUploading.value = true;

  try {
    let coverAvatarUrl = '';

    // 1. 如果有封面图片，先上传
    if (formData.cover_avatar_file) {
      coverAvatarUrl = await uploadImageToOSS(formData.cover_avatar_file);
      if (!coverAvatarUrl) {
        isUploading.value = false;
        return; // 上传失败，停止发布
      }
    }

    // 2. 准备帖子数据
    const postData = {
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      cover_avatar: coverAvatarUrl,
      label: formData.label,
      type: formData.type,
      visible_range: formData.visible_range,
      subject: formData.subject,
      sub_classify: formData.sub_classify || ''
    };

    console.log('准备发布的帖子数据:', postData);

    // 3. 发布帖子 - 根据你的后端，可能需要调整API路径
    const response = await axios.post('/api/insertPost', postData, {
      headers: {
        'token': JWT_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [(data) => {
        // 将对象转换为URL编码的字符串
        const params = new URLSearchParams();
        Object.keys(data).forEach(key => {
          if (data[key] !== undefined && data[key] !== null) {
            params.append(key, data[key]);
          }
        });
        return params;
      }]
    });

    if (response.data.code === 1) {
      ElMessage.success('发布帖子成功');
      resetFormData();
      closeSubmitChooseVisible();
      // 跳转到论坛首页
      router.push('/initialForum');
    } else {
      ElMessage.error(response.data.msg || '发布帖子失败');
    }
  } catch (error) {
    console.error('发布帖子错误:', error);

    if (error.response) {
      // 服务器返回错误
      console.error('服务器错误:', error.response.data);
      ElMessage.error(`发布失败: ${error.response.data.msg || error.response.statusText}`);
    } else if (error.request) {
      // 请求发送但无响应
      ElMessage.error('网络错误，请检查网络连接');
    } else {
      // 请求配置错误
      ElMessage.error('发布失败，请检查表单数据');
    }
  } finally {
    isUploading.value = false;
  }
};

// 监听分类变化，重置子分类
const handleSubjectChange = () => {
  formData.sub_classify = '';
};

onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录');
    router.push('/login');
    return;
  }
});
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
            <div v-if="formData.cover_avatar_url" class="cover-preview">
              <img :src="formData.cover_avatar_url" alt="封面预览" class="cover-image">
              <div class="cover-actions">
                <button class="clear-cover-btn" @click="clearCoverImage">更换封面</button>
              </div>
            </div>
            <div v-else class="cover-upload">
              <div class="upload-placeholder">
                <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span class="upload-text">未选择封面</span>
                <span class="upload-hint">可选</span>
              </div>
            </div>
          </div>

          <!-- 右侧：帖子信息区域 -->
          <div class="post-info-section">
            <div class="post-title">
              <h4>{{ formData.title || '未设置标题' }}</h4>
            </div>
            <div class="post-meta-info">
              <span class="meta-item"><strong>分类:</strong> {{ formData.subject || '未选择' }}</span>
              <span v-if="formData.sub_classify" class="meta-item"><strong>子分类:</strong> {{ formData.sub_classify }}</span>
              <span class="meta-item"><strong>话题:</strong> {{ formData.label || '未选择' }}</span>
              <span class="meta-item"><strong>类型:</strong> {{ formData.type || '未选择' }}</span>
              <span class="meta-item"><strong>可见范围:</strong> {{ formData.visible_range || '未选择' }}</span>
            </div>
            <div class="post-summary">
              <p>{{ formData.summary || '暂无摘要' }}</p>
            </div>
            <div class="post-content-preview">
              <p>{{ formData.content ? formData.content.substring(0, 200) + (formData.content.length > 200 ? '...' : '') : '暂无内容' }}</p>
            </div>
          </div>
        </div>

        <!-- 底部：发布按钮 -->
        <div class="modal-footer">
          <div class="action-section">
            <button class="cancel-btn" @click="closeSubmitChooseVisible" :disabled="isUploading">
              取消
            </button>
            <button class="publish-final-btn" @click="releaseForum" :disabled="isUploading">
              <span v-if="isUploading">发布中...</span>
              <span v-else>确认发布</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 表单内容区域 -->
    <div class="release-form">
      <!-- 帖子标题 -->
      <div class="form-section">
        <label class="section-label">帖子标题 <span class="required">*</span></label>
        <div class="input-container">
          <input
              v-model="formData.title"
              class="title-input"
              placeholder="请输入帖子标题..."
              type="text"
              maxlength="100"
          />
          <div class="input-counter">{{ formData.title.length }}/100</div>
        </div>
      </div>

      <!-- 文章分类选择 -->
      <div class="form-row">
        <div class="form-section form-col">
          <label class="section-label">文章分类 <span class="required">*</span></label>
          <div class="select-container">
            <select v-model="formData.subject" @change="handleSubjectChange" class="custom-select">
              <option value="">请选择分类</option>
              <option v-for="subject in subjectOptions" :key="subject" :value="subject">
                {{ subject }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-section form-col">
          <label class="section-label">子分类</label>
          <div class="select-container">
            <select v-model="formData.sub_classify" class="custom-select" :disabled="!formData.subject">
              <option value="">请选择子分类</option>
              <option v-for="subClass in subClassifyOptions[formData.subject] || []" :key="subClass" :value="subClass">
                {{ subClass }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 文章话题选择 -->
      <div class="form-section">
        <label class="section-label">文章话题 <span class="required">*</span></label>
        <div class="topic-grid">
          <label
              v-for="topic in labelOptions"
              :key="topic"
              class="topic-option-label"
              :class="{ 'selected': formData.label === topic }"
          >
            <input
                type="radio"
                v-model="formData.label"
                :value="topic"
                class="topic-radio"
            />
            <span class="topic-text">#{{ topic }}</span>
          </label>
        </div>
      </div>

      <!-- 文章类型和可见范围 -->
      <div class="form-row">
        <div class="form-section form-col">
          <label class="section-label">文章类型 <span class="required">*</span></label>
          <div class="radio-group">
            <label v-for="type in typeOptions" :key="type" class="radio-label">
              <input
                  type="radio"
                  v-model="formData.type"
                  :value="type"
                  class="radio-input"
              />
              <span class="radio-text">{{ type }}</span>
            </label>
          </div>
        </div>

        <div class="form-section form-col">
          <label class="section-label">可见范围 <span class="required">*</span></label>
          <div class="select-container">
            <select v-model="formData.visible_range" class="custom-select">
              <option v-for="range in visibleRangeOptions" :key="range" :value="range">
                {{ range }}
              </option>
            </select>
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
              placeholder="请输入帖子摘要（可选）..."
              rows="3"
              maxlength="300"
          ></textarea>
          <div class="input-counter">{{ formData.summary.length }}/300</div>
        </div>
      </div>

      <!-- 帖子内容 -->
      <div class="form-section">
        <label class="section-label">帖子内容 <span class="required">*</span></label>
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
        <label class="section-label">封面图片（可选）</label>
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
              <div v-if="formData.cover_avatar_url" class="preview-content">
                <img :src="formData.cover_avatar_url" alt="封面图片预览" class="preview-image">
              </div>
              <div v-else class="preview-placeholder">
                <span class="placeholder-text">图片预览</span>
              </div>
            </div>
          </div>
          <div class="clear-button-container" v-if="formData.cover_avatar_url">
            <button
                class="clear-button"
                @click="clearCoverImage"
                :disabled="isUploading"
            >
              清除封面
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.release-container {
  position: relative;
  min-height: calc(100vh - 140px);
  background: #f8f9fa;
}

/* 头部区域优化 */
.release-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1000px;
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

/* 发布按钮优化 */
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
  max-width: 1000px;
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

.section-label .required {
  color: #ff4757;
  margin-left: 4px;
}

.input-container {
  width: 100%;
  position: relative;
}

.input-counter {
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 12px;
  color: #999;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 3px;
}

/* 输入框样式优化 */
.title-input,
.summary-input,
.content-input,
.custom-select {
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
.content-input:focus,
.custom-select:focus {
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

.custom-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
  cursor: pointer;
}

.custom-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/* 表单行布局 */
.form-row {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.form-col {
  flex: 1;
}

/* 话题网格 */
.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.topic-option-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.topic-option-label:hover {
  border-color: #42b983;
  background: #e6f7ef;
}

.topic-option-label.selected {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.topic-radio {
  display: none;
}

.topic-text {
  font-weight: 500;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-input {
  margin: 0;
  width: 18px;
  height: 18px;
}

.radio-text {
  font-size: 16px;
  color: #333;
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
  z-index: 2000;
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

.post-meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.meta-item {
  font-size: 13px;
  color: #666;
  padding: 4px 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.meta-item strong {
  color: #333;
  margin-right: 4px;
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

/* 底部设置区域 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
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
  margin-top: 12px;
  text-align: center;
}

.clear-button {
  padding: 8px 16px;
  border: 1px solid #ff4757;
  background: white;
  color: #ff4757;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.clear-button:hover {
  background: #ff4757;
  color: white;
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

  .modal-content {
    flex-direction: column;
  }

  .cover-section {
    flex: none;
    width: 100%;
  }

  .upload-placeholder,
  .cover-image {
    width: 100%;
    height: 150px;
  }

  .form-row {
    flex-direction: column;
    gap: 16px;
  }

  .modal-footer {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .action-section {
    justify-content: flex-end;
  }

  .topic-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
/* 添加发布中状态样式 */
.publish-final-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 发布中动画效果 */
.publish-final-btn:disabled:hover {
  background: #ccc;
  transform: none;
  box-shadow: none;
}

/* 加载动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}
</style>