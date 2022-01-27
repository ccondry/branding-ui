import * as types from '../mutation-types'
import {load} from '../../utils'
import { Toast } from 'buefy/dist/components/toast'
import Vue from 'vue'

// const didMap = [{
//   name: 'DID1',
//   internal: '7800'
// }, {
//   name: 'DID2',
//   internal: '6021'
// }, {
//   name: 'DID3',
//   internal: '6022'
// }, {
//   name: 'DID4',
//   internal: '6023'
// }, {
//   name: 'DID5',
//   internal: '6020'
// }, {
//   name: 'DID6',
//   internal: '7019'
// }, {
//   name: 'DID7',
//   internal: '6016'
// }, {
//   name: 'DID8',
//   internal: '6017'
// }, {
//   name: 'DID9',
//   internal: '6018'
// }, {
//   name: 'DID10',
//   internal: '6019'
// }]

const getters = {
  // dCloud session ID
  sessionId: state => state.sessionId,
  // dCloud datacenter
  datacenter: state => state.datacenter,
  // dCloud instant demo user ID
  userId: state => state.userId,
  // dCloud session information, including configuration
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
  isCjp: (state) => state.datacenter.toLowerCase() === 'cjp',
  // is this a CJP CCOne demo?
  isCjpCcone: (state) => state.datacenter.toLowerCase() === 'cjp' && state.sessionId.toLowerCase() === 'ccone',
  // is this a CJP Webex Sandbox Spark Chat demo?
  isCjpWebex: (state) => state.datacenter.toLowerCase() === 'cjp' && state.sessionId.toLowerCase() === 'webex',
  // is this a CWCC Abilene demo on the Cisco TSA tenant?
  isTsaCwcc: (state) => state.datacenter.toLowerCase() === 'cwcc' && state.sessionId.toLowerCase().startsWith('tsa'),
  // is this a the Custom Stack 1 Webex Demo?
  isWebexCustom: state => state.datacenter.toLowerCase() === 'webex' && state.sessionId.toLowerCase() === 'custom',
  // is this an RCDN (Compete Lab) demo?
  isRcdn: (state) => state.datacenter.toLowerCase() === 'rcdn',
  // is this an instant demo?
  isInstantDemo: (state, getters) => getters.sessionInfo.instant === true,
  // is the configured multichannel type Upstream Works?
  isUpstream: (state, getters) => getters.sessionConfig.multichannel === 'upstream',
  // is the configured multichannel type ECE?
  isEce: (state, getters) => !getters.sessionConfig.multichannel || getters.sessionConfig.multichannel === 'ece',
  // is the configured multichannel type SalesForce?
  isSfdc: (state, getters) => getters.sessionConfig.multichannel === 'salesforce',
  // isSfdc: (state, getters) => false,
  // is the configured multichannel type ServiceNow?
  isServiceNow: (state, getters) => getters.sessionConfig.multichannel === 'servicenow',
  // is the configured multichannel type MS Dynamics?
  isMsDynamics: (state, getters) => getters.sessionConfig.multichannel === 'msdynamics',
  // is the configured multichannel type Webex Teams?
  isWebexTeams: (state, getters) => getters.sessionConfig.multichannel === 'webex',
  // isWebexTeams: (state, getters) => true,
  // brand ID (also known as vertical ID)
  brand: (state, getters) => getters.sessionConfig.vertical,
  // full vertical config
  demoConfig: state => state.brandConfig,
  // just the website branding-specific config in the vertical config
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
  // this actually includes the v2 demo as well - it's the same demo
  isCwccV1: (state, getters) => {
    try {
      return getters.sessionInfo.demo.toLowerCase() === 'cwcc' && state.sessionInfo.version.toLowerCase() === 'v1'
    } catch (e) {
      return false
    }
  },
  // is this Webex CC v3 Production (Abilene) demo?
  isWebexV3Prod: (state, getters) => {
    try {
      return getters.sessionInfo.demo.toLowerCase() === 'webex' && state.sessionInfo.version.toLowerCase() === 'v3prod'
    } catch (e) {
      return false
    }
  },
  // is this Webex CC v4 Production (Abilene) demo?
  isWebexV4Prod: (state, getters) => {
    try {
      return getters.sessionInfo.demo.toLowerCase() === 'webex' && state.sessionInfo.version.toLowerCase() === 'v4prod'
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
    try {
      // for Webex CC v1/v2/v3/v4 demo, determine main phone number based on vertical selected
      switch (getters.sessionConfig.vertical) {
        case 'finance': return getters.dids.DID7
        case 'travel': return getters.dids.DID8
        case 'healthcare': return getters.dids.DID9
        case 'city': return getters.dids.DID5
        case 'utility': return getters.dids.DID10
        // default to Finance demo DID
        default: return getters.dids.DID7
      }
    } catch (e) {
      // maybe getters.dids is not defined
      return ''
    }
  },
  demoVersion: state => {
    return state.sessionInfo.version
  },
  demoBaseConfig: state => {
    return state.demoBaseConfig
  },
  multichannelOptions: state => state.multichannelOptions
}

const state = {
  sessionId: '',
  datacenter: '',
  userId: '',
  sessionInfo: {},
  brandConfig: '',
  sessionInfoError: null,
  demoBaseConfig: null,
  multichannelOptions: []
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
  },
  [types.SET_DEMO_BASE_CONFIG] (state, data) {
    state.demoBaseConfig = data
  },
  [types.SET_MULTICHANNEL_OPTIONS] (state, data) {
    state.multichannelOptions = data.channels
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
      const response = await load(getters.endpoints.session, query)
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
      const response = await load(getters.endpoints.brand, query)
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
  async getDemoBaseConfig ({getters, commit, dispatch}) {
    // get the base config for this demo type (UCCX 12.0v2, PCCE 12.5v1, etc.)
    const type = getters.sessionInfo.demo
    const version = getters.sessionInfo.version ? getters.sessionInfo.version.toLowerCase() : null
    const instant = getters.isInstantDemo
    const operation = 'load base demo config'
    try {
      dispatch('setLoading', {group: 'dcloud', type: 'demo', value: true})
      const query = {
        type: {
          $regex: getters.sessionInfo.demo,
          $options: 'i'
        }
      }
      if (getters.sessionInfo.version) {
        query.version = {
          $regex: getters.sessionInfo.version,
          $options: 'i'
        }
      }
      if (getters.isInstantDemo) {
        query.instant = getters.isInstantDemo
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + getters.jwt
        },
        body: JSON.stringify(query)
      }
      const response = await window.fetch(getters.endpoints.demo + '/find', options)
      const json = await response.json()
      if (response.ok) {
        commit(types.SET_DEMO_BASE_CONFIG, json[0])
      } else {
        const message = `${operation} for ${type} ${version} ${instant ? 'instant' : ''} failed: ${json.message}`
        console.log(message)
        Toast.open({
          duration: 8000,
          message,
          type: 'is-danger'
        })
      }
    } catch (e) {
      console.log(operation, 'failed:', e.message)
    } finally {
      dispatch('setLoading', {group: 'dcloud', type: 'demo', value: false})
    }
  },
  getMultichannelOptions ({getters, dispatch}) {
    console.log('getMultichannelOptions', getters.sessionConfig.multichannel)
    // default to ECE multichannel
    const multichannel = getters.sessionConfig.multichannel || 'ece'
    return dispatch('fetch', {
      group: 'admin',
      type: 'multichannel',
      url: getters.endpoints.multichannel + '/' + multichannel,
      message: 'get multichannel options',
      mutation: types.SET_MULTICHANNEL_OPTIONS
    })
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
