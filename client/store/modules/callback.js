import { Toast } from 'buefy/dist/components/toast'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  async sendCallback ({getters, commit, dispatch}, data) {
    const type = 'Send callback request'
    try {
      // attach dCloud session information
      data.session = getters.sessionId
      data.datacenter = getters.datacenter
      data.userId = getters.userId
      // set working state
      dispatch('setWorking', {group: 'dcloud', type: 'callback', value: true})
      console.debug('starting', type, data, '...')
      // send email request to REST API
      await dispatch('postData', {
        endpoint: getters.endpoints.callback.path,
        data
      })
      // success
      console.info(type, 'succeeded')
      // pop toast notification for user
      Toast.open({
        duration: 15000,
        message: `An expert will be calling you shortly. Your estimated wait
        time is 2 minutes.`,
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
      dispatch('setWorking', {group: 'dcloud', type: 'callback', value: false})
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
