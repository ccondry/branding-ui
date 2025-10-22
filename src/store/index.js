import Vue from 'vue'
import Vuex from 'vuex'
// import pkg from 'package'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules,
  state: {
    pkg: {version: '2134'}
  }
})

export default store
