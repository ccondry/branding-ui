import * as types from '../mutation-types'
import {Toast} from 'buefy'
import {load} from '../../utils'
import config from '../../config'

const getters = {
}

const state = {
  device: {
    isMobile: false,
    isTablet: false
  },
  sidebar: {
    opened: false,
    hidden: false
  },
  effect: {
    translate3d: true
  },
  endpointsLoaded: false,
  endpoints: config.app.endpoints
}

const mutations = {
  [types.TOGGLE_DEVICE] (state, device) {
    state.device.isMobile = device === 'mobile'
    state.device.isTablet = device === 'tablet'
  },

  [types.TOGGLE_SIDEBAR] (state, config) {
    if (state.device.isMobile && config.hasOwnProperty('opened')) {
      state.sidebar.opened = config.opened
    } else {
      state.sidebar.opened = true
    }

    if (config.hasOwnProperty('hidden')) {
      state.sidebar.hidden = config.hidden
    }
  },

  [types.SWITCH_EFFECT] (state, effectItem) {
    for (let name in effectItem) {
      state.effect[name] = effectItem[name]
    }
  },

  [types.SET_ENDPOINTS] (state, data) {
    state.endpoints = data
  },

  [types.SET_ENDPOINTS_LOADED] (state, data) {
    console.log('state.endpointsLoaded =', data)
    state.endpointsLoaded = data
  }
}

const actions = {
  async getEndpoints ({getters, commit, dispatch}, showNotification = true) {
    // mark loading started
    dispatch('setLoading', {group: 'app', type: 'endpoints', value: true})
    try {
      console.log('getting endpoints for branding-ui')
      // get endpoints from API server
      const response = await load(getters.instance, getters.jwt, getters.endpoints.endpoints)
      // set the endpoints data in state
      await commit(types.SET_ENDPOINTS, response.data)
      // mark endpoints as loaded
      commit(types.SET_ENDPOINTS_LOADED, true)
    } catch (e) {
      console.log(e)
      // failed to get endpoints
      console.error('load endpoints', 'failed:', e)
      Toast.open({
        // duration: 5000,
        message: 'load endpoints' + ' failed: ' + e.message,
        type: 'is-danger'
      })
    } finally {
      // mark loading done
      dispatch('setLoading', {group: 'app', type: 'endpoints', value: false})
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
