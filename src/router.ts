import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './modules/Home.vue'
import About from './modules/About.vue'

const routes = [
    {
        path: '/', component: Home
    },
    {
        path: '/about', component: About
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router