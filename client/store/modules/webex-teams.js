import { addUrlQueryParams } from '../../utils'
import * as types from '../mutation-types'
import { Toast } from 'buefy/dist/components/toast'

const state = {
  webexTeamsWidgetStarted: false,
  webexTeamsRoomId: null,
  webexTeamsAccessToken: null
}

const mutations = {
  [types.SET_WEBEX_TEAMS_WIDGET_STARTED] (state, data) {
    state.webexTeamsWidgetStarted = data
  },
  [types.SET_WEBEX_TEAMS_ACCESS_TOKEN] (state, data) {
    state.webexTeamsAccessToken = data
  },
  [types.SET_WEBEX_TEAMS_ROOM_ID] (state, data) {
    state.webexTeamsRoomId = data
  }
}

const getters = {
  webexTeamsWidgetStarted: state => state.webexTeamsWidgetStarted,
  webexTeamsAccessToken: state => state.webexTeamsAccessToken,
  webexTeamsRoomId: state => state.webexTeamsRoomId
}

const actions = {
  async startWebexTeamsWidget ({commit, getters}) {
    console.log('starting webex teams multichannel chat')
    const url = getters.endpoints.webexGuest
    const query = {
      id: 'ccondry-test-1',
      name: 'Jimothy Timston',
      topic: 'Web Chat Assistant',
      session: getters.sessionId,
      datacenter: getters.datacenter
    }
    const urlWithQuery = addUrlQueryParams(url, query)
    const options = {
      headers: {
        Accept: 'application/json'
      }
    }

    try {
      console.log('getting', urlWithQuery)
      const response = await window.fetch(urlWithQuery, options)
      const json = await response.json()
      console.log('get webex teams guest info success')
      commit(types.SET_WEBEX_TEAMS_ACCESS_TOKEN, json.accessToken)
      commit(types.SET_WEBEX_TEAMS_ROOM_ID, json.roomId)
      if (response.ok) {
        await window.startWebexTeamsWidget({
          elementId: 'my-webexteams-widget',
          roomId: json.roomId,
          accessToken: json.accessToken
        })
        commit(types.SET_WEBEX_TEAMS_WIDGET_STARTED, true)
      } else {
        throw Error(json.message)
      }
    } catch (e) {
      const message = 'failed to start webex teams space widget: ' + e.message
      console.log(message)
      // notify user that chat is not configured properly
      Toast.open({
        duration: 10000,
        message,
        type: 'is-danger'
      })
    }
  },
  async getWebexTeamsAgent ({commit, getters}, data) {
    console.log('getting webex teams agent...')
    const url = getters.endpoints.webexAgent
    const body = {
      session: getters.sessionId,
      datacenter: getters.datacenter,
      token: getters.webexTeamsAccessToken,
      roomId: getters.webexTeamsRoomId,
      userId: getters.userId,
      email: data.email,
      name: data.name,
      phone: data.phone,
      message: data.message
    }
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }

    try {
      const response = await window.fetch(url, options)
      const json = await response.json()
      console.log('get webex teams agent success:', json)
      if (response.ok) {
        Toast.open({
          message: 'An agent will be with you shortly',
          type: 'is-info'
        })
      } else {
        throw Error(json.message)
      }
    } catch (e) {
      const message = 'failed to get webex teams agent: ' + e.message
      console.log(message)
      // notify user that chat is not configured properly
      Toast.open({
        duration: 10000,
        message,
        type: 'is-danger'
      })
    }
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
