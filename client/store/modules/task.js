// import { Toast } from 'buefy/dist/components/toast'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  async sendTask ({getters, commit, dispatch}, data) {
    // attach dCloud session information
    data.session = getters.sessionId
    data.datacenter = getters.datacenter
    data.userId = getters.userId

    // construct the task request object
    data.task = {
      cv1: data.name,
      cv2: data.task.text,
      cv3: data.phone,
      cv4: data.email,
      description: data.task.text,
      email: data.email,
      name: data.name,
      phone: data.phone,
      title: data.task.text
    }

    // set working state
    dispatch('setWorking', {group: 'dcloud', type: 'task', value: true})
    console.debug('starting send task request:', data)
    // send email request to REST API
    dispatch('postData', {
      endpoint: getters.endpoints.task.path,
      data,
      success: `We have received your task request and the next available expert
      will begin working on it.`,
      fail: 'Failed to send your task request'
    }).finally(() => {
      // reset working state
      dispatch('setWorking', {group: 'dcloud', type: 'task', value: false})
    })
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
