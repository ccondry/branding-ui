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
      // smsDeflectionMessage: 'Hello, this is Cumulus. Please reply to this message to begin chatting with one of our agents.',
      duoFraudSmsNumber: '',
      duoWelcomeMessage: 'Hello, and thanks for calling Cumulus internal service center.',
      duoFraudSmsMessage: 'Mr Littlefoot,\n\nDue to a recorded fraudulent login attempt, we recommend changing your account information as it may be compromised. You can do that here:\n\nwww.cumulus.com/memberportal\n\nYou can also call us at 1-555-942-9464 if you would rather speak to a fraud specialist.',
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
  async loadDefaults ({getters, dispatch}, {type, showNotification = true}) {
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
  async putDefaults ({getters, dispatch}, data) {
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
