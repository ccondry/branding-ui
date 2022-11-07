import { Toast } from 'buefy/dist/components/toast'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  async sendJdsData ({getters, dispatch}, data) {
    const operation = 'send JDS request'
    // set working state
    console.debug('starting', operation, data)
    // reduce array data to an object
    const body = data.reduce((prev, current) => {
      return {...prev, [current.key]: current.value}
    }, {})
    // send email request to REST API
    const response = await dispatch('fetch', {
      group: 'jds',
      type: 'send',
      url: getters.endpoints.jds + '/' + getters.userId,
      options: {
        method: 'POST',
        body
      }
    })
    if (response instanceof Error) {
      console.log(operation, 'failed', response)
      Toast.open({
        // duration: 5000,
        message: operation + ' failed: ' + response.message,
        type: 'is-danger'
      })
    } else {
      console.log(operation, 'success!', response)
      Toast.open({
        // duration: 5000,
        message: operation + ' succeeded',
        type: 'is-success'
      })
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
