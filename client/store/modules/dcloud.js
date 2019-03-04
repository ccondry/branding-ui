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
  configuration: (state, getters) => getters.sessionInfo.configuration || {},
  // is chat bot enabled?
  chatBotEnabled: (state, getters) => getters.configuration.chatBotEnabled,
  // is this a UCCX demo?
  isUccx: (state, getters) => getters.sessionInfo.demo === 'uccx',
  // is this a PCCE demo?
  isPcce: (state, getters) => getters.sessionInfo.demo === 'pcce',
  // is the configured multichannel type Upstream Works?
  isUpstream: (state, getters) => getters.configuration.multichannel === 'upstream',
  // is the configured multichannel type ECE?
  isEce: (state, getters) => !getters.configuration.multichannel || getters.configuration.multichannel === 'ece'
}

const state = {
  sessionId: '',
  datacenter: '',
  userId: '',
  sessionInfo: {}
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
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
