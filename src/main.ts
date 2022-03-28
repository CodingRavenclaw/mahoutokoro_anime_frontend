import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@popperjs/core/dist/umd/popper.min'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)

axios.defaults.withCredentials = true
app.use(router)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)
app.mount('#app')
