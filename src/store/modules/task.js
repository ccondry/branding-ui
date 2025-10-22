// import { ToastProgrammatic as Toast } from 'buefy'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  async sendTask ({getters, dispatch}, data) {
    // attach dCloud session information
    data.session = getters.sessionId
    data.datacenter = getters.datacenter
    data.userId = getters.userId

    // construct the task request object
    data.task = {
      // customer name
      cv1: data.name,
      // the task option, like 'Request a Parking'
      cv2: data.task,
      // customer phone
      cv3: data.phone,
      // customer email
      cv4: data.email,
      // the task description, like 'Request a Parking'
      description: data.task,
      // customer email
      email: data.email,
      // customer name
      name: data.name,
      // customer phone
      phone: data.phone,
      // the task title, like 'Request a Parking'
      title: data.task
    }

    // task PQ ID for routing
    if (getters.sessionConfig.taskPqId) {
      data.task.cv5 = getters.sessionConfig.taskPqId
      data.task.pqId = getters.sessionConfig.taskPqId
    }
    // task call type ID, for reporting
    if (getters.sessionConfig.taskCtId) {
      data.task.cv6 = getters.sessionConfig.taskCtId
      data.task.ctId = getters.sessionConfig.taskCtId
    }

    // set working state
    dispatch('setWorking', {group: 'dcloud', type: 'task', value: true})
    console.debug('starting send task request:', data)
    // send email request to REST API
    await dispatch('postData', {
      endpoint: getters.endpoints.task,
      data,
      success: `We have received your task request and the next available expert
      will begin working on it.`,
      fail: 'Failed to send your task request'
    })
    // reset working state
    dispatch('setWorking', {group: 'dcloud', type: 'task', value: false})
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
