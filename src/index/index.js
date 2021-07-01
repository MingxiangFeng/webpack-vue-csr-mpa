import { createApp } from 'vue'
import '../../static/1'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
