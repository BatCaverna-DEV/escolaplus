import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routes.js'
import VueTheMask from 'vue-the-mask'

const app = createApp(App)

app.use(VueTheMask)
app.use(router)

app.mount('#app')
