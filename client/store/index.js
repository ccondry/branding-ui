import Vue from 'vue'
import Vuex from 'vuex'
import pkg from 'package'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  actions,
  getters,
  modules,
  state: {
    pkg,
    working: {
      app: {},
      session: {},
      dcloud: {}
    },
    loading: {
      app: {},
      session: {},
      dcloud: {}
    }
  },
  mutations
})

export default store
