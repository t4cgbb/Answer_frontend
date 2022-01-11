import { createRouter, createWebHashHistory } from 'vue-router'
// 頁面初始載入
import Home from '@/views/Home.vue'

const routes = [
    {
        name: 'home',
        path: '/',
        meta:{
            title: '首頁'
        },
        component: Home,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router