import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './modules/Home.vue'
import About from './modules/About.vue'
import Picture from './modules/Picture.vue'

const routes = [
    {
        path: '/', component: Home
    },
    {
        path: '/about', component: About
    },
    {
        path: '/picture', component: Picture
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router