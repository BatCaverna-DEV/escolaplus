import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routes.js'
import VueTheMask from 'vue-the-mask'

import { library } from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(VueTheMask)
app.use(router)

app.mount('#app')
