import Vue from 'vue'
import Buefy from 'buefy'
import App from './App.vue'
import store from './store'
import * as filters from './filters'

import 'buefy/lib/buefy.css'

Vue.use(Buefy)

Vue.use(require('vue-moment'))
// Enable devtools
Vue.config.devtools = true

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
  store,
  ...App
})

export { app, store }
