// import { Toast } from 'buefy/dist/components/toast'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
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
