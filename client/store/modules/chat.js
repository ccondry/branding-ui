// import { Toast } from 'buefy/dist/components/toast'
import queryString from 'query-string'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  popCconeChatWindow ({getters}, data) {
    console.log('popCconeChatWindow', data)
    // validate
    if (isNaN(getters.sessionConfig.reasonId) || isNaN(getters.sessionConfig.tenantId)) {
      // reasonId or tenantId are not set - pop error message
      console.log('popCconeChatWindow - reasonId or tenantId are not set. Not starting chat.')
      // stop here - don't pop chat window without all the params
      return
    }
    // build URL query parameter options
    const query = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      question: data.message,
      reasonId: getters.sessionConfig.reasonId,
      tenantId: getters.sessionConfig.tenantId,
      data0: 'Cumulus Homepage',
      data1: 'Model_X Diamond Customer',
      data2: 'Finance Quote'
    }
    console.log('popCconeChatWindow - starting chat with query =', query)
    // make a URL-friendly query string from JSON data
    const qs = queryString.stringify(query)
    // build the URL
    const url = `https://mm-static.cxdemo.net/ccone-chat.html?${qs}`
    console.log('popCconeChatWindow - starting chat with full url =', url)
    // pop the chat window
    let w = 400
    let h = 600
    let top = (window.screen.height / 2) - (h / 2)
    let left = (window.screen.width / 2) - (w / 2)
    window.open(url, '_blank', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`)
    console.log('popCconeChatWindow - chat window opened.')
  },
  popUpstreamChatWindow ({getters}, data) {
    console.log('popUpstreamChatWindow', data)
    let url = `https://mm-static.cxdemo.net/upstream.html?name=${data.name}&phone=${data.phone}&email=${data.email}&session=${getters.sessionId}&datacenter=${getters.datacenter}`
    // let url = `https://${this.datacenter}-${this.sessionId}.tunnel.cc-dcloud.com/Home`
    console.log('Upstream URL:', url)
    let w = 400
    let h = 600
    let top = (window.screen.height / 2) - (h / 2)
    let left = (window.screen.width / 2) - (w / 2)
    // open popup
    window.open(url, '_blank', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`)
    // window.resize('400', '600')
  },
  popEceChatWindow ({getters}) {
    console.log('popEceChatWindow')
    // create url
    let url = `https://${getters.datacenter}-${getters.sessionId}.tunnel.cc-dcloud.com/ece/system/templates/chat/aqua/index.html?subActivity=Chat&entryPointId=1001&templateName=aqua&ver=v11&locale=en-US`
    console.log('ECE chat URL:', url)
    let w = 400
    let h = 600
    let top = (window.screen.height / 2) - (h / 2)
    let left = (window.screen.width / 2) - (w / 2)
    // open popup
    window.open(url, '_blank', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`)
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
