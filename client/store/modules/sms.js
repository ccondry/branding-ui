import {Toast} from 'buefy'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  async sendSms ({getters, commit, dispatch}, data) {
    const type = 'Send SMS'
    try {
      // attach dCloud session information
      data.session = getters.sessionId
      data.datacenter = getters.datacenter
      data.userId = getters.userId
      // set working state
      dispatch('setWorking', {group: 'dcloud', type: 'sms', value: true})
      console.debug('starting', type, data, '...')
      // send email request to REST API
      await dispatch('postData', {
        endpoint: getters.endpoints.sms.path,
        data
      })
      // success
      console.info(type, 'succeeded')
      // pop toaster notification for user
      Toast.open({
        duration: 15000,
        message: `We have sent you a text message. Reply to this message to
        beging chatting with one of our experts.`,
        type: 'is-primary'
      })
    } catch (e) {
      // failed
      console.error(type, 'error:', getters.brand, e)
      // pop toast notification for user
      Toast.open({
        duration: 15000,
        message: type + ' failed: ' + e.message,
        type: 'is-danger'
      })
    } finally {
      // reset working state
      dispatch('setWorking', {group: 'dcloud', type: 'sms', value: false})
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
