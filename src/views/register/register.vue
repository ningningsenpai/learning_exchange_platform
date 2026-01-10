<script setup>
import { reactive, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import qs from 'qs'
import { useRouter } from 'vue-router'

const registerAPI = '/api/register'
const router = useRouter()

// 传递用户信息
const form = reactive({
  phone: '',
  username: '',
  password: '',
  confirmPassword: '',
  securityCode: '',
  grade: '',
  major: ''
})

// 年级选项
const gradeOptions = [
  { label: '大一', value: '大一' },
  { label: '大二', value: '大二' },
  { label: '大三', value: '大三' },
  { label: '大四', value: '大四' },
  { label: '研究生', value: '研究生' },
  { label: '博士生', value: '博士生' },
  { label: '已毕业', value: '已毕业' }
]

// 专业选项
const majorOptions = [
  { label: '计算机科学与技术', value: '计算机科学与技术' },
  { label: '软件工程', value: '软件工程' },
  { label: '信息工程', value: '信息工程' },
  { label: '电子信息工程', value: '电子信息工程' },
  { label: '通信工程', value: '通信工程' },
  { label: '人工智能', value: '人工智能' },
  { label: '数据科学', value: '数据科学' },
  { label: '网络工程', value: '网络工程' },
  { label: '其他', value: '其他' }
]

// 获取验证码
const codeImage = ref('')
const getCaptcha = async () => {
  try {
    const response = await axios.get('/api/captcha')
    if(response.data.code == 1) {
      codeImage.value = `data:image/jpeg;base64,${response.data.data.body}`
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('获取验证码失败，请重试')
  }
}

onMounted(() => {
  getCaptcha()
})

// 验证表单
const validateForm = () => {
  if (!form.phone.trim()) {
    ElMessage.warning('请输入手机号')
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return false
  }
  if (!form.username.trim()) {
    ElMessage.warning('请输入昵称')
    return false
  }
  if (form.username.length < 2 || form.username.length > 20) {
    ElMessage.warning('昵称长度应为2-20个字符')
    return false
  }
  if (!form.password.trim()) {
    ElMessage.warning('请输入密码')
    return false
  }
  if (form.password.length < 6 || form.password.length > 20) {
    ElMessage.warning('密码长度应为6-20个字符')
    return false
  }
  if (form.password !== form.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return false
  }
  if (!form.securityCode.trim()) {
    ElMessage.warning('请输入验证码')
    return false
  }
  if (!form.grade) {
    ElMessage.warning('请选择年级')
    return false
  }
  if (!form.major) {
    ElMessage.warning('请选择专业')
    return false
  }
  return true
}

const onSubmit = async() => {
  if (!validateForm()) {
    return
  }

  try {
    const response = await axios.post(registerAPI, qs.stringify(form),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if (response.data.code == 1) {
      ElMessage.success('注册成功，系统将为您自动登录')
      router.push('/navigation')
    } else {
      ElMessage.error(response.data.msg)
      getCaptcha() // 刷新验证码
    }
  } catch (error) {
    ElMessage.error('注册失败，请稍后重试')
    getCaptcha() // 刷新验证码
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>加入校园论坛</h2>
        <p>开始你的知识分享之旅</p>
      </div>

      <el-form :model="form" class="register-form">
        <el-form-item>
          <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              size="large"
              :prefix-icon="Phone"
              maxlength="11"
          />
        </el-form-item>

        <el-form-item>
          <el-input
              v-model="form.username"
              placeholder="请输入昵称（2-20个字符）"
              size="large"
              :prefix-icon="User"
              maxlength="20"
          />
        </el-form-item>

        <el-form-item>
          <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码（6-20个字符）"
              size="large"
              :prefix-icon="Lock"
              show-password
              maxlength="20"
          />
        </el-form-item>

        <el-form-item>
          <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请确认密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              maxlength="20"
          />
        </el-form-item>

        <el-form-item class="captcha-item">
          <div class="captcha-container">
            <el-input
                v-model="form.securityCode"
                placeholder="请输入验证码"
                style="width: 150px;"
                maxlength="5"
            />
            <div class="captcha-image" @click="getCaptcha">
              <img
                  :src="codeImage"
                  alt="验证码"
                  v-if="codeImage"
              />
              <div v-else class="captcha-placeholder">加载中...</div>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-select
              v-model="form.grade"
              placeholder="请选择年级"
              style="width: 100%;"
              size="large"
          >
            <el-option
                v-for="option in gradeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
              v-model="form.major"
              placeholder="请选择专业"
              style="width: 100%;"
              size="large"
          >
            <el-option
                v-for="option in majorOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              @click="onSubmit"
              class="register-button"
              size="large"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="register-footer">
        <span>已有账号？</span>
        <router-link to="/login" class="login-link">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 8px;
}

.register-header p {
  color: #666;
  font-size: 14px;
}

.register-form {
  margin-bottom: 20px;
}

.captcha-item {
  margin-bottom: 24px;
}

.captcha-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.captcha-image {
  width: 120px;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.captcha-placeholder {
  color: #999;
  font-size: 12px;
}

.register-button {
  width: 100%;
  background: linear-gradient(135deg, #42b983 0%, #3aa676 100%);
  border: none;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.register-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

.register-footer {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.login-link {
  color: #42b983;
  text-decoration: none;
  margin-left: 5px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #3aa676;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 30px 20px;
  }

  .captcha-container {
    flex-direction: column;
    align-items: stretch;
  }

  .captcha-image {
    width: 100%;
    height: 50px;
  }
}
</style>

<script>
import { Phone, User, Lock } from '@element-plus/icons-vue'
export default {
  components: {
    Phone,
    User,
    Lock
  }
}
</script>