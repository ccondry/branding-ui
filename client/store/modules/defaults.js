import * as types from '../mutation-types'
import Vue from 'vue'

const state = {
  defaults: {
    inbound: {},
    chat: {},
    email: {},
    outbound: {},
    ccb: {
      'Courtesy_Callback': {
        demo: 'default',
        params: {}
      }
    },
    pcs: {},
    rem: {},
    task: {},
    callback: {},
    ar: {},
    cumulus: {
      chatBotToken: '5dc044d7822d43a5839627427ed28935',
      chatBotEnabled: true,
      chatBotSurveyEnabled: true,
      language: 'en',
      region: 'US',
      multichannel: 'ece',
      vertical: 'finance',
      smsDeflectionMessage: 'Hello%2C%20this%20is%20Cumulus.%20Please%20reply%20to%20this%20message%20to%20begin%20chatting%20with%20one%20of%20our%20agents.',
      duoFraudSmsNumber: '',
      duoWelcomeMessage: 'Hello, and thanks for calling Cumulus internal service center.',
      duoFraudSmsMessage: 'Mr%20Littlefoot%2C%0A%0ADue%20to%20a%20recorded%20fraudulent%20login%20attempt%2C%20we%20recommend%20changing%20your%20account%20information%20as%20it%20may%20be%20compromised.%20You%20can%20do%20that%20here%3A%0A%0Awww.cumulus.com%2Fmemberportal%0A%0AYou%20can%20also%20call%20us%20at%201-555-942-9464%20if%20you%20would%20rather%20speak%20to%20a%20fraud%20specialist.',
      ttsEngine: 'nuance'
    }
  }
}

const getters = {
  defaults: state => state.defaults
}

const mutations = {
  [types.SET_DEFAULTS] (state, data) {
    Vue.set(state.defaults, data.type, data.defaults)
  }
}

const actions = {
  async loadDefaults ({getters, commit, dispatch}, {type, showNotification = true}) {
    dispatch('setLoading', {group: 'app', type: 'defaults', value: true})
    await dispatch('loadToState', {
      endpoint: getters.endpoints.defaults,
      query: {type},
      mutation: types.SET_DEFAULTS,
      name: 'defaults',
      transform (response) {
        return {
          type,
          defaults: response.data.demos || {}
        }
      },
      showNotification
    })
    dispatch('setLoading', {group: 'app', type: 'defaults', value: false})
  },
  async putDefaults ({commit, getters, dispatch}, data) {
    dispatch('setWorking', {group: 'app', type: 'defaults', value: true})
    await dispatch('putData', {
      endpoint: getters.endpoints.defaults,
      query: {type: data.type},
      name: 'defaults',
      data: data.data,
      showNotification: true
    })
    dispatch('setWorking', {group: 'app', type: 'defaults', value: false})
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
