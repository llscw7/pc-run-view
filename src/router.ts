import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './modules/Home.vue'
import About from './modules/About.vue'
import Picture from './modules/Picture.vue'
import Setting from './modules/Setting.vue'
import Test from './modules/Test.vue'

const routes = [
    {
        path: '/', component: Home
    },
    {
        path: '/about', component: About
    },
    {
        path: '/picture', component: Picture
    },
    {
        path: '/setting', component: Setting
    },
    {
        path: '/test', component: Test
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router