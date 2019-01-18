import Vue from 'vue'
import axios from 'axios'
import App from '@/app.vue'

Vue.prototype.$http = axios

new Vue({
  el: '#app',
  render: h => h(App)
})
