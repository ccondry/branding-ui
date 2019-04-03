// import { Toast } from 'buefy/dist/components/toast'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  sendSms ({getters, commit, dispatch}, data) {
    // attach dCloud session information
    data.session = getters.sessionId
    data.datacenter = getters.datacenter
    data.userId = getters.userId
    // decode the URI-encoded SMS message because our API expects clear text
    data.message = decodeURIComponent(data.message)
    // set working state
    dispatch('setWorking', {group: 'dcloud', type: 'sms', value: true})
    console.debug('starting send SMS:', data)
    // send email request to REST API
    dispatch('postData', {
      endpoint: getters.endpoints.sms.path,
      data,
      success: `We have sent you a text message. Reply to this message to
      beging chatting with one of our experts.`,
      fail: 'Failed to send you a text message'
    }).finally(() => {
      // reset working state
      dispatch('setWorking', {group: 'dcloud', type: 'sms', value: false})
    })
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
