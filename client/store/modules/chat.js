// import { Toast } from 'buefy/dist/components/toast'

const getters = {
}

const state = {
}

const mutations = {
}

const actions = {
  popCconeChatWindow ({getters}, data) {
    // cc one chat parameters
    const PROTOCOL = 'https'
    const IP = 'mm.ccone.net'
    const PORT = 443
    const EXCEPTION_MESSAGE = 'Unable to process your request.'
    const SHOW_EXCEPTION_DETAILS = false

    // init the CCOne chat system
    const chatAPI = new window.ThinConnectChat(PROTOCOL, IP, PORT, EXCEPTION_MESSAGE, SHOW_EXCEPTION_DETAILS)

    // attach data
    const dataArr = []
    dataArr.push({ key: 'custname', value: data.name })
    dataArr.push({ key: 'mobilenum', value: data.phone })
    dataArr.push({ key: 'emailid', value: data.email })
    dataArr.push({ key: 'question', value: data.message })
    dataArr.push({ key: 'reason', value: getters.sessionConfig.reasonId || '3'})
    dataArr.push({ key: 'sendtranscript', value: 'false' })
    dataArr.push({ key: 'CUSTOM_MESSAGE', value: 'Unable to process your request.' })
    dataArr.push({ key: 'SHOW_EXCEPTION_DETAILS', value: false })
    dataArr.push({ key: 'REQUEST-ID', value: 0 })
    dataArr.push({ key: 'sourceUrl', value: '' })
    dataArr.push({ key: 'chatRsnSelMode', value: '' })
    dataArr.push({ key: 'websitePkey', value: '' })
    dataArr.push({ key: 'defaultChatReason', value: '' })
    dataArr.push({ key: 'traversalHistory', value: '' })
    dataArr.push({ key: 'customerId', value: '' })
    dataArr.push({ key: 'groupId', value: '' })

    dataArr.push({ key: 'data0', value: 'Cumulus Homepage' })
    dataArr.push({ key: 'data1', value: 'Model_X Diamond Customer' })
    dataArr.push({ key: 'data2', value: 'Finance Quote' })
    dataArr.push({ key: 'data3', value: '' })
    dataArr.push({ key: 'data4', value: '' })
    dataArr.push({ key: 'data5', value: '' })
    dataArr.push({ key: 'data6', value: '' })
    dataArr.push({ key: 'data7', value: '' })
    dataArr.push({ key: 'data8', value: '' })
    dataArr.push({ key: 'data9', value: '' })

    // pop the chat window
    chatAPI.submit(dataArr)
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
