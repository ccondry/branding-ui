// import { Toast } from 'buefy/dist/components/toast'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  async sendCallback ({getters, commit, dispatch}, data) {
    // attach dCloud session information
    data.session = getters.sessionId
    data.datacenter = getters.datacenter
    data.userId = getters.userId
    // construct callback object
    data.callback = {
      description: data.message,
      mediaAddress: data.phone,
      name: data.name,
      tags: '',
      title: data.message,
      variables: []
    }

    // set working state
    dispatch('setWorking', {group: 'dcloud', type: 'callback', value: true})
    console.debug('starting send callback request:', data)
    // let minutes = Math.floor(response.data.ewt / 60)
    // if (minutes === 0) minutes = 1

    dispatch('postData', {
      endpoint: getters.endpoints.callback.path,
      data,
      success: `An expert will be calling you shortly. Your estimated wait
      time is 2 minutes.`,
      fail: 'Failed to complete your callback request'
    }).finally(() => {
      // reset working state
      dispatch('setWorking', {group: 'dcloud', type: 'callback', value: false})
    })
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
