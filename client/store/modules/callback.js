// import { Toast } from 'buefy/dist/components/toast'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  popEceCallbackWindow () {
    console.log('popEceCallbackWindow')
    // create url
    // rainbow template
    let url = `https://${this.datacenter}-${this.sessionId}.tunnel.cc-dcloud.com/ece/system/templates/callback/rainbow/call.html?subActivity=Callback&entryPointId=1002&templateName=rainbow&languageCode=en&countryCode=US&ver=v11`
    // cumulus template
    // let url = `https://${this.datacenter}-${this.sessionId}.tunnel.cc-dcloud.com/ece/system/templates/callback/cumulus/call.html?subActivity=Callback&entryPointId=1002&templateName=cumulus&languageCode=en&countryCode=US&ver=v11`
    console.log('ECE callback URL:', url)
    let w = 400
    let h = 600
    let top = (window.screen.height / 2) - (h / 2)
    let left = (window.screen.width / 2) - (w / 2)
    // open popup
    window.open(url, '_blank', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`)
    // window.resize('400', '600')
  },
  async sendCallback ({getters, dispatch}, data) {
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
      title: data.message || 'Hi',
      variables: []
    }

    // set working state
    dispatch('setWorking', {group: 'dcloud', type: 'callback', value: true})
    console.debug('starting send callback request:', data)
    // let minutes = Math.floor(response.data.ewt / 60)
    // if (minutes === 0) minutes = 1

    await dispatch('postData', {
      endpoint: getters.endpoints.callback,
      data,
      success: `An expert will be calling you shortly. Your estimated wait
      time is 2 minutes.`,
      fail: 'Failed to complete your callback request'
    })
    // reset working state
    dispatch('setWorking', {group: 'dcloud', type: 'callback', value: false})
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
