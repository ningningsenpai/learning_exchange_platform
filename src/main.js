import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import router from './router'
import App from './App.vue'

const pinia = createPinia()
createApp(App).use(ElementPlus, {locale: zhCn})
.use(router)
.use(pinia)
.mount('#app')
