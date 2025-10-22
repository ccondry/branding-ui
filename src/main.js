import Vue from 'vue'
import App from './App.vue'
import store from './store'

// use 'buefy/src' when running from git,
// import Buefy from 'buefy/src'
// or use 'buefy' when running from npm
import Buefy from 'buefy'

import 'buefy/dist/buefy.css'

// add Buefy to Vue
Vue.use(Buefy)

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
