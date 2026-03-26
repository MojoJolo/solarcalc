import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PrivacyView from '../views/PrivacyView.vue'
import SolarSavingsPost from '../views/blog/SolarSavingsPost.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView },
        { path: '/about', component: AboutView },
        { path: '/privacy', component: PrivacyView },
        { path: '/blog/solar-savings-meralco-2026', component: SolarSavingsPost },
    ],
})

export default router
