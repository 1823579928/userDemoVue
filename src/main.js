import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Qs from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
Vue.prototype.qs = Qs;
axios.defaults.headers.post['Content-Type'] = 'text/plain'
Vue.prototype.$axios = axios
/* axios.default.baseURL = 'http://localhost:8080' */
axios.defaults.baseURL = '/api/'  // api 即上面 vue.config.js 中配置的地址
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
