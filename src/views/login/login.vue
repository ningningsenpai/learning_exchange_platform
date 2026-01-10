<script setup>
import { reactive, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'
import qs from 'qs'
import { useRouter } from 'vue-router'

const loginAPI = '/api/login'
const userStore = useUserStore()
const router = useRouter()

// 传递用户信息
const form = reactive({
  username: '',
  password: '',
  code: ''
})

const codeImage = ref('')

//获取验证码
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


const onSubmit = async() => {
  if (!form.username.trim()) {
    ElMessage.warning('请输入用户名')
    return
  }
  if (!form.password.trim()) {
    ElMessage.warning('请输入密码')
    return
  }

  try {
    const response = await axios.post(loginAPI, qs.stringify(form),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    if (response.data.code == 1) {
      userStore.setToken(response.data.data)
      userStore.setUserInfo(response.data.data.userInfo || { username: form.username })
      userStore.setIsLoggedIn(true)
      ElMessage.success('登录成功')
      router.push('/navigation')
    } else {
      ElMessage.error(response.data.msg || '登录失败')
      getCaptcha() // 刷新验证码
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('网络错误，请稍后重试')
    getCaptcha() // 刷新验证码
  }
}

</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>登录</h2>
        <p>欢迎来到校内知识交流平台</p>
      </div>

      <el-form :model="form" class="login-form">
        <el-form-item>
          <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              size="large"
              :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item>
          <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
          />
        </el-form-item>

        <el-form-item class="captcha-item">
          <div class="captcha-container">
            <el-input
                v-model="form.code"
                placeholder="请输入验证码"
                style="width: 150px;"
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
          <el-button
              type="primary"
              @click="onSubmit"
              class="login-button"
              size="large"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <span>还没有账号？</span>
        <router-link to="/register" class="register-link">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 8px;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.login-form {
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

.login-button {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-footer {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  margin-left: 5px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
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
import { User, Lock } from '@element-plus/icons-vue'
export default {
  components: {
    User,
    Lock
  }
}
</script>