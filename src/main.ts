import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'
import 'virtual:svg-icons-register'
import 'element-plus/dist/index.css'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import gloablComponent from './components/index'
import '@/styles/index.scss'
import pinia from '@/store'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)
app.use(gloablComponent)
app.use(pinia)
app.mount('#app')
