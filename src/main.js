import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import api from './api'

const app = createApp(App)

// Vue3，全局使用（封裝Axios）（PS：建議真實環境用Inject 及 Provider，僅供demo用）
app.config.globalProperties.$api = api

app .use(router)
    .use(ElementPlus)
    .mount('#app')