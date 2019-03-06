import {Toast} from 'buefy'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  async sendEmail ({getters, commit, dispatch}, data) {
    const type = 'Send email'
    try {
      // attach dCloud session information
      data.session = getters.sessionId
      data.datacenter = getters.datacenter
      data.userId = getters.userId
      // set working state
      dispatch('setWorking', {group: 'dcloud', type: 'email', value: true})
      console.debug('starting', type, data, '...')
      // send email request to REST API
      await dispatch('postData', {
        endpoint: getters.endpoints.email.path,
        data
      })
      // success
      console.info(type, 'succeeded')
      // pop toast notification for user
      this.$toast.open({
        duration: 15000,
        message: `We have received your email and an expert will respond as
        soon as possible.`,
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
      dispatch('setWorking', {group: 'dcloud', type: 'email', value: false})
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
