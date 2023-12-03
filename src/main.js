import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Router from '@/router/index'

const app = createApp(App)

app.use(ElementPlus).use(Router).mount('#app')
