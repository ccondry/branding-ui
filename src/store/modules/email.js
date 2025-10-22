import { ToastProgrammatic as Toast } from 'buefy'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  async sendEmail ({getters, dispatch}, data) {
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
    const response = await dispatch('fetch', {
      url: getters.endpoints.email,
      options: {
        method: 'POST',
        body: data
      }
    })
    if (response instanceof Error) {
      // failed
      Toast.open({
        type: 'is-danger',
        message: `Failed to send your email: ${response.message}`,
        duration: 14 * 1000,
        queue: false
      })
    } else {
      Toast.open({
        type: 'is-success',
        message: `We have received your email and the next available expert will
        reply to your message.`
      })
      // success
    }
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
