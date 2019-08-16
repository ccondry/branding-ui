import * as types from '../mutation-types'
import {load} from '../../utils'
import { Toast } from 'buefy/dist/components/toast'
import Vue from 'vue'

const getters = {
  // dCloud session ID
  sessionId: state => state.sessionId,
  // dCloud datacenter
  datacenter: state => state.datacenter,
  // dCloud instant demo user ID
  userId: state => state.userId,
  // dCloud session information, including configuraiton
  sessionInfo: state => state.sessionInfo,
  // dCloud session configuration
  sessionConfig: (state, getters) => getters.sessionInfo.configuration || {},
  // is chat bot enabled?
  chatBotEnabled: (state, getters) => getters.demoConfig.chatBotEnabled,
  // is this a UCCX demo?
  isUccx: (state, getters) => getters.sessionInfo.demo === 'uccx',
  // is this a PCCE demo?
  isPcce: (state, getters) => getters.sessionInfo.demo === 'pcce',
  // is this a CJP demo?
  isCjp: (state, getters) => state.datacenter.toLowerCase() === 'cjp',
  // is this a CJP CCOne demo?
  isCjpCcone: (state, getters) => state.datacenter.toLowerCase() === 'cjp' && state.sessionId.toLowerCase() === 'ccone',
  // is this a CJP Webex Sandbox Spark Chat demo?
  isCjpWebex: (state, getters) => state.datacenter.toLowerCase() === 'cjp' && state.sessionId.toLowerCase() === 'webex',
  // is this an RCDN (Compete Lab) demo?
  isRcdn: (state, getters) => state.datacenter.toLowerCase() === 'rcdn',
  // is this a an instant demo?
  isInstantDemo: (state, getters) => getters.sessionInfo.instant === true,
  // is the configured multichannel type Upstream Works?
  isUpstream: (state, getters) => getters.sessionConfig.multichannel === 'upstream',
  // is the configured multichannel type ECE?
  isEce: (state, getters) => !getters.sessionConfig.multichannel || getters.sessionConfig.multichannel === 'ece',
  // brand ID (actually its the vertical ID)
  brand: (state, getters) => getters.sessionConfig.vertical,
  // full vertical config
  demoConfig: state => state.brandConfig,
  // just the branding-specific config in the vertical
  brandConfig: state => state.brandConfig.brand,
  // null if no errors, object if errors getting dCloud session info
  sessionInfoError: state => state.sessionInfoError,
  // is this a Cisco Webex Contact Center demo?
  isCwcc: (state, getters) => {
    try {
      return getters.sessionInfo.demo.toLowerCase() === 'cwcc'
    } catch (e) {
      return false
    }
  },
  // is this a Cisco Webex Contact Center v1 demo?
  isCwccV1: (state, getters) => {
    try {
      return getters.sessionInfo.demo.toLowerCase() === 'cwcc' && state.sessionInfo.version.toLowerCase() === 'v1'
    } catch (e) {
      return false
    }
  },
  dids: (state, getters) => {
    try {
      return getters.sessionInfo.dids
    } catch (e) {
      return {}
    }
  },
  cwccDid: (state, getters) => {
    // for CWCC demo, determine main phone number based on vertical selected
    switch (getters.sessionConfig.vertical) {
      case 'finance': return getters.dids.DID7
      case 'travel': return getters.dids.DID8
      case 'healthcare': return getters.dids.DID9
      case 'city': return getters.dids.DID5
      case 'utility': return getters.dids.DID10
      default: return getters.dids.DID7
    }
  }
}

const state = {
  sessionId: '',
  datacenter: '',
  userId: '',
  sessionInfo: {},
  brandConfig: '',
  sessionInfoError: null
}

const mutations = {
  [types.SET_SESSION_ID] (state, data) {
    state.sessionId = data
  },
  [types.SET_DATACENTER] (state, data) {
    state.datacenter = data
  },
  [types.SET_USER_ID] (state, data) {
    state.userId = data
  },
  [types.SET_SESSION_INFO] (state, data) {
    state.sessionInfo = data
  },
  [types.SET_BRAND_CONFIG] (state, data) {
    state.brandConfig = data
    // if brand not set, set to empty object
    if (!state.brandConfig.brand) {
      Vue.set(state.brandConfig, 'brand', {})
    }
  },
  [types.SET_SESSION_INFO_ERROR] (state, data) {
    state.sessionInfoError = data
  }
}

const actions = {
  setUserId ({commit}, data) {
    commit(types.SET_USER_ID, data)
  },
  setSessionId ({commit}, data) {
    commit(types.SET_SESSION_ID, data)
  },
  setDatacenter ({commit}, data) {
    commit(types.SET_DATACENTER, data)
  },
  async getSessionInfo ({getters, commit, dispatch}, showNotification = true) {
    try {
      dispatch('setLoading', {group: 'dcloud', type: 'sessionInfo', value: true})
      console.log('loading dcloud session info...')
      const query = {
        session: getters.sessionId,
        datacenter: getters.datacenter,
        userId: getters.userId
      }
      const response = await load(getters.endpoints.session.path, query)
      console.log('load dcloud session info:', response)
      commit(types.SET_SESSION_INFO, response.data)
      // set error to null to remove UI error messages
      commit(types.SET_SESSION_INFO_ERROR, null)
      if (showNotification) {
        Toast.open({
          message: 'load dCloud session info succeeded',
          type: 'is-success'
        })
      }
    } catch (e) {
      console.log('error loading dcloud session info', e)
      // Toast.open({
      //   duration: 5000,
      //   message: 'load dCloud session info failed: ' + e.message,
      //   type: 'is-danger'
      // })
      commit(types.SET_SESSION_INFO_ERROR, e.response)
    } finally {
      dispatch('setLoading', {group: 'dcloud', type: 'sessionInfo', value: false})
    }
  },
  async getBrand ({getters, commit, dispatch}, showNotification = true) {
    try {
      dispatch('setLoading', {group: 'dcloud', type: 'brand', value: true})
      console.log('loading brand config for', getters.brand, '...')
      const query = {
        id: getters.brand
      }
      const response = await load(getters.endpoints.brand.path, query)
      console.log('load dcloud brand configuration for', getters.brand, response)
      commit(types.SET_BRAND_CONFIG, response.data)
      if (showNotification) {
        Toast.open({
          message: 'load dCloud brand configuration for ' + getters.brand + ' succeeded',
          type: 'is-success'
        })
      }
    } catch (e) {
      console.log('error loading brand', getters.brand, e)
      Toast.open({
        duration: 5000,
        message: 'load dCloud brand configuration for ' + getters.brand + ' failed: ' + e.message,
        type: 'is-danger'
      })
    } finally {
      dispatch('setLoading', {group: 'dcloud', type: 'brand', value: false})
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
