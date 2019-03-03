import Vue from 'vue'
import Vuex from 'vuex'
import pkg from 'package'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import modules from './modules'
import config from '../config'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  actions,
  getters,
  modules,
  state: {
    endpointsLoaded: false,
    endpoints: config.app.endpoints,
    // dcloud PCCE instant demo session instances
    instance: '',
    instances: [],
    instancesLoaded: false,
    pkg,
    working: {
      app: {},
      images: {},
      cce: {},
      cvp: {},
      duo: {},
      admin: {},
      facebook: {},
      finesse: {},
      templates: {},
      user: {},
      session: {}
    },
    loading: {
      app: {},
      images: {},
      cce: {},
      cvp: {},
      duo: {},
      admin: {},
      facebook: {},
      finesse: {},
      templates: {},
      user: {},
      session: {}
    },
    defaultChatEntryPointId: config.ece.defaultChatEntryPointId
  },
  mutations
})

export default store
