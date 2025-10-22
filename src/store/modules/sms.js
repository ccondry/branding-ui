// import { ToastProgrammatic as Toast } from 'buefy'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  async sendSms ({getters, dispatch}, data) {
    // attach dCloud session information
    data.session = getters.sessionId
    data.datacenter = getters.datacenter
    data.userId = getters.userId
    // set working state
    dispatch('setWorking', {group: 'dcloud', type: 'sms', value: true})
    console.debug('starting send SMS:', data)
    // send email request to REST API
    await dispatch('postData', {
      endpoint: getters.endpoints.sms,
      data,
      success: `We have sent you a text message. Reply to this message to
      begin chatting with one of our experts.`,
      fail: 'Failed to send you a text message'
    })
    // reset working state
    dispatch('setWorking', {group: 'dcloud', type: 'sms', value: false})
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
