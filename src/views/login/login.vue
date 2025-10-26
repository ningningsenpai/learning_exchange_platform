<script setup>
  import { reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import axios from 'axios'
  import qs from 'qs' 

  const loginAPI = '/api/login'

  // 传递用户信息
  const form = reactive({
    username: '',
    password: '',
    code: ''
  })

   //获取验证码
  const getCaptcha = async () => {
    try {
      const response = await axios.get('/api/captcha')
      if(response.data.code == 1) {
        form.codeImage = `data:image/jpeg;base64,${response.data.data.body}`
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

  const login = async (formData) => {
    const response = await axios.post(loginAPI, qs.stringify(formData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response.data
  }

  const onSubmit = async() => {
    try {
      const response = await login(form)
      if (response.code == 1) {
        ElMessage.success(response.msg)
        router.push({name: 'navigation'})
      } else {
        ElMessage.error(response.msg)
        // 显示验证码输入框
        document.querySelector('.code-item').style.display = 'block'
      }
    } catch (error) {
      ElMessage.error(error.message)
    }
  }
</script>

<template>
  <div class="login_from">
    <el-form :model="form" label-width="0px" style="width: 250px;">

      <h2 style="text-align: center;">登录</h2>
      <el-form-item label="">
        <el-input v-model="form.username" placeholder="昵称" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="form.password" type="password" placeholder="密码" />
      </el-form-item>

      <el-form-item class="code-item">
        <el-row :gutter="40">
          <el-col :span="12" >
            <el-input v-model="form.code" placeholder="验证码" style="width: 140px;" />
          </el-col>
          <el-col :span="12">
            <img 
            :src="form.codeImage" 
            alt="图片验证码" 
            style="margin-top: 5px; width: 110px; cursor: pointer;"
            @click="getCaptcha"
            />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" style="margin: auto; width: 200px;">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

  .login_from {
  width: 300px;
  height: 300px;
  background-color: #f5f5f5;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

  .code-item {
    display: none;
  }

</style>
