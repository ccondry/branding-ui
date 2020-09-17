// import { Toast } from 'buefy/dist/components/toast'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  async sendEmail ({getters, commit, dispatch}, data) {
    // attach dCloud session information
    data.session = getters.sessionId
    data.datacenter = getters.datacenter
    data.userId = getters.userId
    // uccx or pcce demo?
    data.demo = getters.sessionInfo.demo
    // demo version
    data.version = getters.sessionInfo.version
    // true if using Upstream Works in PCCE as the multichannel option
    data.isUpstream = getters.isUpstream
    // true if this is an instant demo. false if scheduled demo.
    data.isInstantDemo = getters.isInstantDemo
    // true if using SalesForce in PCCE as the multichannel option
    data.isSfdc = getters.isSfdc
    // set working state
    dispatch('setWorking', {group: 'dcloud', type: 'email', value: true})
    console.debug('starting send email:', data)
    // send email request to REST API
    await dispatch('postData', {
      endpoint: getters.endpoints.email,
      data,
      success: `We have received your email and the next available expert will
      reply to your message.`,
      fail: 'Failed to send your email message'
    })
    // reset working state
    dispatch('setWorking', {group: 'dcloud', type: 'email', value: false})
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
