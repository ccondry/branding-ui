import * as types from '../mutation-types'
import {load} from '../../utils'
import {Toast} from 'buefy'

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
  chatBotEnabled: (state, getters) => getters.sessionConfig.chatBotEnabled,
  // is this a UCCX demo?
  isUccx: (state, getters) => getters.sessionInfo.demo === 'uccx',
  // is this a PCCE demo?
  isPcce: (state, getters) => getters.sessionInfo.demo === 'pcce',
  // is this a an instant demo?
  isInstantDemo: (state, getters) => getters.sessionInfo.instant === true,
  // is the configured multichannel type Upstream Works?
  isUpstream: (state, getters) => getters.sessionConfig.multichannel === 'upstream',
  // is the configured multichannel type ECE?
  isEce: (state, getters) => !getters.sessionConfig.multichannel || getters.sessionConfig.multichannel === 'ece',
  // brand
  brand: (state, getters) => getters.sessionConfig.brand,
  brandConfig: state => state.brandConfig
}

const state = {
  sessionId: '',
  datacenter: '',
  userId: '',
  sessionInfo: {},
  brandConfig: ''
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
      if (showNotification) {
        Toast.open({
          message: 'load dCloud session info' + ' succeeded',
          type: 'is-success'
        })
      }
    } catch (e) {
      console.log('error loading defaults', e)
      Toast.open({
        duration: 5000,
        message: 'load dCloud session info' + ' failed: ' + e.message,
        type: 'is-danger'
      })
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
  },
  async sendEmail ({getters, commit, dispatch}, data) {
    const type = 'Send email'
    try {
      dispatch('setWorking', {group: 'dcloud', type: 'email', value: true})
      console.debug('starting', type, data, '...')
      await dispatch('postData', {
        endpoint: getters.endpoints.brand.email,
        data
      })
      console.info(type, 'succeeded:', response)
      Toast.open({
        message: type + ' succeeded',
        type: 'is-success'
      })
    } catch (e) {
      console.error(type, 'error:', getters.brand, e)
      Toast.open({
        duration: 5000,
        message: type + ' failed: ' + e.message,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'dcloud', type: 'email', value: false})
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
