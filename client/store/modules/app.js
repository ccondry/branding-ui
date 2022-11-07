import * as types from '../mutation-types'
// import {ToastProgrammatic as Toast} from 'buefy'
import { Toast } from 'buefy/dist/components/toast'
import { addUrlQueryParams, load, put, post, httpDelete} from '../../utils'
import Vue from 'vue'

const state = {
  device: {
    isMobile: false,
    isTablet: false
  },
  sidebar: {
    opened: false,
    hidden: false
  },
  effect: {
    translate3d: true
  },
  working: {
    app: {},
    session: {},
    dcloud: {},
    jds: {}
  },
  loading: {
    app: {},
    session: {},
    dcloud: {},
    jds: {}
  }
}

const getters = {
  // this software package
  pkg: state => state.pkg,
  app: state => state.app,
  // what kind of device is viewing this website
  device: state => state.app.device,
  effect: state => state.app.effect,
  // loading and working status objects. used for tracking status of REST API operations
  loading: state => state.loading,
  working: state => state.working
}

const mutations = {
  [types.SET_WORKING] (state, data) {
    // if state container for this group is not existing, create it
    if (!state.working[data.group]) {
      Vue.set(state.working, data.group, {})
    }

    // if state container for this type is not existing, create it
    if (!state.working[data.group][data.type]) {
      Vue.set(state.working[data.group], data.type, data.value)
    } else {
      state.working[data.group][data.type] = data.value
    }
  },
  [types.SET_LOADING] (state, data) {
    // if state container for this group is not existing, create it
    if (!state.loading[data.group]) {
      Vue.set(state.loading, data.group, {})
    }

    // if state container for this type is not existing, create it
    if (!state.loading[data.group][data.type]) {
      Vue.set(state.loading[data.group], data.type, data.value)
    } else {
      state.loading[data.group][data.type] = data.value
    }
  },

  [types.TOGGLE_DEVICE] (state, device) {
    state.device.isMobile = device === 'mobile'
    state.device.isTablet = device === 'tablet'
  },

  [types.TOGGLE_SIDEBAR] (state, config) {
    if (state.device.isMobile && config.hasOwnProperty('opened')) {
      state.sidebar.opened = config.opened
    } else {
      state.sidebar.opened = true
    }

    if (config.hasOwnProperty('hidden')) {
      state.sidebar.hidden = config.hidden
    }
  },

  [types.SWITCH_EFFECT] (state, effectItem) {
    for (let name in effectItem) {
      state.effect[name] = effectItem[name]
    }
  }
}

const actions = {
  toggleSidebar ({ commit }, data) {
    if (data instanceof Object) {
      commit(types.TOGGLE_SIDEBAR, data)
    }
  },

  toggleDevice ({ commit }, data) {
    commit(types.TOGGLE_DEVICE, data)
  },

  expandMenu ({ commit }, data) {
    if (data) {
      data.expanded = data.expanded || false
      commit(types.EXPAND_MENU, data)
    }
  },

  switchEffect ({ commit }, data) {
    if (data) {
      commit(types.SWITCH_EFFECT, data)
    }
  },

  async loadToState ({commit, dispatch}, options) {
    if (!options.mutation) {
      const message = 'error during loadToState ' + options.name + ' - options.mutation was undefined. Verify that the mutation type constant is in mutation-types.js'
      console.log(message)
      return
      // throw Error(message)
    }
    try {
      const response = await load(options.endpoint, options.query)
      console.log(`GET ${options.name}`, response)
      let data
      if (typeof options.transform === 'function') {
        data = options.transform(response)
      } else {
        data = response.data
      }
      commit(options.mutation, data)
      if (options.showNotification) {
        Toast.open({
          // duration: 5000,
          message: options.name + ' succeeded',
          type: 'is-success'
        })
      }
      return response
    } catch (e) {
      console.error(`error during GET ${options.name}`, e)
      // check for 401 (expired JWT)
      // console.error('e.response', e.response)
      try {
        if (e.response.status === 401 && e.response.data.toLowerCase() === 'jwt expired') {
          // JWT expired
          console.log('JWT expired. logging out user locally.')
          dispatch('unsetJwt')
          // don't display any error message now
          return
        }
      } catch (e2) {
        // continue with default error
      }
      Toast.open({
        // duration: 5000,
        message: options.name + ' failed: ' + e.message,
        type: 'is-danger'
      })
    }
  },

  setWorking ({commit}, {group, type, value = true}) {
    commit(types.SET_WORKING, {group, type, value})
  },

  setLoading ({commit}, {group, type, value = true}) {
    commit(types.SET_LOADING, {group, type, value})
  },

  async putData ({}, options) {
    try {
      console.log(`putData ${options.endpoint}`, options.data)
      const response = await put(options.endpoint, options.query, options.data)
      console.log(`put ${options.name}`, response)
      if (options.showNotification) {
        Toast.open({
          // duration: 5000,
          message: options.name + ' succeeded',
          type: 'is-success'
        })
      }
      return response
    } catch (e) {
      console.log(`error during PUT ${options.name}`, e)
      Toast.open({
        // duration: 5000,
        message: options.name + ' failed: ' + e.message,
        type: 'is-danger'
      })
    }
  },

  async postData ({commit}, options) {
    try {
      console.log(`postData ${options.endpoint}`, options.data)
      const response = await post(options.endpoint, options.query, options.data)
      console.log(`post ${options.name}`, response)
      if (options.success) {
        Toast.open({
          duration: 15000,
          message: options.success,
          type: 'is-primary'
        })
      }
      let data
      // transform response data before commiting?
      if (typeof options.transform === 'function') {
        data = options.transform(response)
      } else {
        data = response.data
      }
      // commit data to state?
      if (options.mutation) {
        commit(options.mutation, data)
      }
      return response
    } catch (e) {
      console.log(`error during POST ${options.name}`, e)
      Toast.open({
        duration: 15000,
        message: options.fail + ': ' + e.message,
        type: 'is-danger'
      })
    }
  },

  async deleteData ({}, options) {
    try {
      console.log(`deleteData ${options.endpoint}`, options.data)
      const response = await httpDelete(options.endpoint, options.query)
      console.log(`delete ${options.name}`, response)
      if (options.showNotification) {
        Toast.open({
          // duration: 5000,
          message: options.name + ' succeeded',
          type: 'is-success'
        })
      }
      return response
    } catch (e) {
      console.log(`error during DELETE ${options.name}`, e)
      Toast.open({
        // duration: 5000,
        message: options.name + ' failed: ' + e.message,
        type: 'is-danger'
      })
    }
  },

  async fetch ({commit, getters, dispatch}, {
    group,
    type,
    url,
    options = {},
    mutation,
    message,
    showNotification = true
  }) {
    if (!url) {
      throw Error('url is a required parameter for fetch')
    }
    message = message || `${options.method === 'POST' ? 'save' : 'get'} ${group} ${type}`
    console.log(`${message}...`)
    const loadingOrWorking = !options.method || options.method === 'GET' ? 'setLoading' : 'setWorking'
    dispatch(loadingOrWorking, {group, type, value: true})
    try {
      // const data = await dispatch('fetch', {url, options})
      // set default headers
      options.headers = options.headers || {}
      // set content type to JSON by default
      options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json'
      // set accept to JSON by default
      options.headers['Accept'] = options.headers['Accept'] || 'application/json'
      // set JWT auth header by default
      // options.headers['Authorization'] = options.headers['Authorization'] || 'Bearer ' + getters.jwt
      // set instant demo instance name
      options.headers['Instance'] = getters.instanceName
      // stringify body if it is an object
      if (typeof options.body === 'object') {
        options.body = JSON.stringify(options.body)
      }
      // add query parameters to URL
      const endpoint = addUrlQueryParams(url, options.query)
      // console.log('endpoint', endpoint)
      const response = await window.fetch(endpoint, options)
      // get the response body as text
      const text = await response.text()
      // response code 200 - 299?
      if (response.ok) {
        try {
          // parse response text into JSON
          const json = JSON.parse(text)
          console.log(`${message} success:`, json)
          if (mutation) {
            // put JSON data into state
            commit(mutation, json)
          }
          return json
        } catch (e) {
          // body is not json data. return the raw text, and don't attempt
          // to put it into state
          console.log(`${message} success:`, text)
          return text
        }
      } else if (response.status === 401) {
        // expired JWT. forget jwt and forward to SSO login
        window.localStorage.removeItem('jwt')
        return dispatch('login')
      } else {
        // not OK and not 401
        let m = text
        try {
          const json = JSON.parse(text)
          m = json.message || json.apiError || json[Object.keys(json)[0]]
        } catch (e) {
          // use empty string instead of text/html content
          const regex = /text\/html/i
          if (response.headers.get('content-type').match(regex)) {
            m = ''
          }
        }
        // console.log('bad response', m)
        let message = `${response.status} ${response.statusText}`
        if (m.length) {
          message += ` - ${m}`
        }
        const error = Error(message)
        error.status = response.status
        error.statusText = response.statusText
        error.text = m
        return error
      }
    } catch (e) {
      console.error(`${message} failed: ${e.message}`)
      if (showNotification) {
        Toast.open({
          message: `Failed to ${message}: ${e.message}`,
          type: 'is-danger',
          duration: 6 * 1000,
          queue: false
        })
      }
    } finally {
      dispatch(loadingOrWorking, {group, type, value: false})
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
