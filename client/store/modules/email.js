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
    data.isUpstream = getters.isUpstream
    // set working state
    dispatch('setWorking', {group: 'dcloud', type: 'email', value: true})
    console.debug('starting send email:', data)
    // send email request to REST API
    dispatch('postData', {
      endpoint: getters.endpoints.email.path,
      data,
      success: `We have received your email and the next available expert will
      reply to your message.`,
      fail: 'Failed to send your email message'
    }).finally(() => {
      // reset working state
      dispatch('setWorking', {group: 'dcloud', type: 'email', value: false})
    })
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
