import { createWebHashHistory, createRouter } from 'vue-router'
import Home from '@/pages/home/index.vue'
import Detail from '@/pages/detail/index.vue'


const routes = [
  { name: 'Home', path: '/', component: Home },
  { name: 'Detail', path: '/detail', component: Detail }
]


const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router