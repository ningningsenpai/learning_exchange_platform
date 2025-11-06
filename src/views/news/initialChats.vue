<script setup>
import { reactive, onMounted, ref} from 'vue';
import { ElMessage} from 'element-plus';
import axios from 'axios';
import router from '@/router'

// 登陆时接受数据（所有的聊天用户以及最后一句聊天记录）
const chats = reactive({
    user_group: 1, // 1为普通信息，2为系统消息
    user_id: 1,
    user_name: '张三',
    user_avatar: 'src/static/image.png',
    send_user_id: 2, // 发送消息的用户id（和user_id比较，相等则为对方发送）
    last_message: '你好，我是张三',
})
const LastChats = reactive({
    List: [chats]
})
const getInitialChatsApi = '/api/getInitialChats'
const getInitialChats = async () => {
    try {
        const response = await axios.get(getInitialChatsApi)
        if(response.data.code === 1) {
            LastChats.List = response.data.data
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("初始化信息列表失败，请重试")
    }
}

// 根据用户id和需求的数量获取详情聊天记录
const currentChatId = ref(0)
const currentChatNum = ref(50)
const DetailChats = reactive({
    List: []
})
const getDetailChatsApi = '/api/getDetailChats'
const getDetailChats = async () => {
    try {
        const response = await axios.get(getDetailChatsApi, {
            params: {
                user_id: currentChatId.value,
                num: currentChatNum.value
            }
        })
        if(response.data.code === 1) {
            DetailChats.List = response.data.data
        } else {
            ElMessage.error(response.data.msg)
        }
    } catch (error) {
        ElMessage.error("获取详情聊天记录失败，请重试")
    }
}
// 获取历史聊天信息
const getHistoryChats = async () => {
    currentChatNum.value += 50
    getDetailChats()
}

// 退出当前聊天框（清除聊天记录和当前id以及需求的数量重置）


// 测试get和post方法
const testGetApi = '/api/testGet'
const testPostApi = '/api/testPost'
const testData = reactive({
    name: '12313',
    age: '18'
})
const testPost = async () => {
    try {
        const response = await axios.post(testPostApi, {
            name: testData.name,
            age: testData.age
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(response.data)
    } catch (error) {
        ElMessage.error("测试post方法失败，请重试")
    }
}
const testGet = async () => {
    try {
        const response = await axios.get(testGetApi, {
            params: {
                name: testData.name,
                age: testData.age
            }
        })
        console.log(response.data)
    } catch (error) {
        ElMessage.error("测试get方法失败，请重试")
    }
}



</script>

<template>
  <button @click="testPost">测试post方法</button>
  <button @click="testGet">测试get方法</button>
  
</template>

<style scoped>

</style>
