<script setup>
  import { reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import axios from 'axios'

    const formData = reactive({
        title: '',
        content: '',
        publish_date: '',
        hits: 0,
        abstract: '',
        imageUrl: '',
        fileUrl: ''
    });

    const getFormData = async () => {
        try {
            const response = await axios.get('http://10.244.193.207:8080/getFiveNews')
            Object.assign(formData, response.data)
        } catch (error) {
            ElMessage.error('获取新闻信息失败，请重试')
        }
    }

</script>

<template>

  <el-container>
    <el-main>
        <div class="carousel">
            <div class="block text-center">
                <el-carousel height="300px" :motion-blur="true">
                <el-carousel-item v-for="item in 5" :key="item">
                    <img :src="`${item.imageUrl}`" :alt="item.title" class="carousel-image"></el-carousel-item>
                </el-carousel>
            </div>
        </div>
    </el-main>
  </el-container>
  
</template>

<style scoped>
.carousel {
  height: 300px;
  width: 450px;
  margin-top: 100px;
  margin-left: 10%;
}

.carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

</style>
