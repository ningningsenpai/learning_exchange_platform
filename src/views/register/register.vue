<script setup>
  import { reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import axios from 'axios'
  import qs from 'qs' 

  const registerAPI = '/api/register'

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

   //获取验证码
  let  codeImage = ''
  const getCaptcha = async () => {
    try {
      const response = await axios.get('/api/captcha')
      if(response.code == 1) {
        form.codeImage = `data:image/jpeg;base64,${response.data.data.body}`
      } else {
        ElMessage.error(response.msg)
      }
    } catch (error) {
      ElMessage.error('获取验证码失败，请重试')
    }
  }
   onMounted(() => {
    getCaptcha()
  })

  
 const register = async (formData) => {
    const response = await axios.post(registerAPI, qs.stringify(formData),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response.data
  }

  const onSubmit = async() => {
    console.log(form)
      try {
        const response = await register(form)
        if(response.code == 1) {
          ElMessage.success(response.msg)
          router.push({name: 'navigation'})
        } else {
          ElMessage.error(response.msg)
        }
        console.log(response.data)
      } catch (error) {
        ElMessage.error(error.message)
      }
  }
</script>

<template>
  <div class="register_from">
    <el-form :model="form" label-width="0px" style="width: 250px;">

      <h2 style="text-align: center;">注册</h2>
      <el-form-item label="">
        <el-input v-model="form.phone" placeholder="手机号" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="form.username" placeholder="昵称" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="form.password" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" />
      </el-form-item>

      <el-form-item>
        <el-row :gutter="40">
          <el-col :span="12" >
            <el-input v-model="form.securityCode" placeholder="验证码" style="width: 140px;" />
          </el-col>
          <el-col :span="12">
            <img 
            :src="codeImage" 
            alt="图片验证码" 
            style="margin-top: 5px; width: 110px; cursor: pointer;"
            @click="getCaptcha"
            />
          </el-col>
        </el-row>
      </el-form-item>


      <el-form-item>
        <el-row :gutter="30">
          <el-col :span="12" >
            <el-select v-model="form.grade" placeholder="年级" style="margin: auto; width: 110px;">
              <el-option label="大一" value="大一" />
              <el-option label="大二" value="大二" />
              <el-option label="大三" value="大三" />
              <el-option label="大四" value="大四" />
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-select v-model="form.major" placeholder="专业" style="width: 110px;">
              <el-option label="计算机科学与技术" value="计算机科学与技术" />
              <el-option label="信息工程" value="信息工程" />
              <el-option label="软件学院" value="软件学院" />
              <el-option label="电子信息工程" value="电子信息工程" />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" style="margin: auto; width: 200px;">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

.register_from {
  width: 300px;
  height: 450px;
  background-color: #f5f5f5;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
