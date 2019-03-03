import * as types from '../mutation-types'
import {load} from '../../utils'
import {Toast} from 'buefy'

const getters = {
  currentInstance (state, getters) {
    return getters.instances.find(v => getters.instance === v.datacenter + '-' + v.id)
  }
}

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
  sessionId: '',
  datacenter: ''
}

const mutations = {
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
  },

  [types.SET_SESSION] (state, data) {
    state.sessionId = data.sessionId
    state.datacenter = data.datacenter
  }
}

const actions = {
  setInstance ({commit}, data) {
    commit(types.SET_INSTANCE, data)
  },
  async getSession ({getters, commit, dispatch}, showNotification = true) {
    try {
      dispatch('setLoading', {group: 'app', type: 'session', value: true})
      console.log('loading dcloud session info...')
      const response = await load(getters.instance, getters.jwt, getters.endpoints.session)
      console.log('load dcloud session info:', response)
      commit(types.SET_SESSION, response.data)
      if (showNotification) {
        dispatch('successNotification', 'Successfully loaded dCloud session info')
      }
    } catch (e) {
      console.log('error loading defaults', e)
      Toast.open({
        // duration: 5000,
        message: 'load dCloud session info' + ' failed: ' + e.message,
        type: 'is-danger'
      })
    } finally {
      dispatch('setLoading', {group: 'app', type: 'session', value: false})
    }
  },
  async getEndpoints ({getters, commit, dispatch}, showNotification = true) {
    // mark loading started
    dispatch('setLoading', {group: 'app', type: 'endpoints', value: true})
    try {
      console.log('getting endpoints for instance', getters.instance)
      // get endpoints from API server
      const response = await load(getters.instance, getters.jwt, getters.endpoints.endpoints)
      // set the endpoints data in state
      await commit(types.SET_ENDPOINTS, response.data)
      // mark endpoints as loaded
      commit(types.SET_ENDPOINTS_LOADED, true)
    } catch (e) {
      console.log(e)
      // failed to get endpoints
      if (e.response && (e.response.status === 401 || e.response.status === 403)) {
        // JWT expired
        console.log('JWT expired. logging out user locally.')
        dispatch('unsetJwt')
      } else {
        // other error
        console.error(`error during GET endpoints`, e)
        Toast.open({
          // duration: 5000,
          message: 'load endpoints' + ' failed: ' + e.message,
          type: 'is-danger'
        })
      }
    } finally {
      // mark loading done
      dispatch('setLoading', {group: 'app', type: 'endpoints', value: false})
    }
  },
  async getInstances ({getters, commit, dispatch}, showNotification = true) {
    // mark loading started
    dispatch('setLoading', {group: 'app', type: 'instances', value: true})
    try {
      // get instances from API server
      const response = await load(getters.instance, getters.jwt, getters.endpoints.instances)
      // sort returned instances by ID
      const instances = response.data.sort((a, b) => a.id - b.id)
      // set the instances data in state
      commit(types.SET_INSTANCES, instances)
      // mark instances as loaded
      commit(types.SET_INSTANCES_LOADED, true)
      try {
        console.log('window.location.hostname', window.location.hostname)
        // try to find the right instance for this web address
        const hostname = window.location.hostname
        console.log('hostname', hostname)
        // get the part before ".cisco.com"
        const part1 = hostname.split('.').shift()
        console.log('part1', part1)
        // get the datacenter part
        const datacenter = part1.split('-').pop().toUpperCase()
        console.log('looking for instances matching datacenter', datacenter)
        // get instances for the datacenter, according to the URL the client is at
        const localInstances = instances
        .filter(v => v.datacenter === datacenter)

        if (localInstances.length) {
          // check for instance specified in user object
          if (getters.user.instances && getters.user.instances[datacenter]) {
            commit(types.SET_INSTANCE, localInstances[getters.user.instances[datacenter]])
            return
          }
          // else, use the lowest ID number
          // sort instances by ID ascending
          console.log('found local instances:', localInstances)
          // use first instance matching this datacenter
          commit(types.SET_INSTANCE, localInstances[0])
        } else {
          console.log('did not find local instances. using first instance', instances[0])
          // use first instance
          commit(types.SET_INSTANCE, instances[0])
        }
      } catch (e) {
        console.log('error finding local instances. using first instance', instances[0])
        commit(types.SET_INSTANCE, instances[0])
      }
    } catch (e) {
      console.log(e)
      // failed to get endpoints
      if (e.response && (e.response.status === 401 || e.response.status === 403)) {
        // JWT expired
        console.log('JWT expired. logging out user locally.')
        dispatch('unsetJwt')
      } else {
        // other error
        console.error(`error during GET instances`, e)
        Toast.open({
          // duration: 5000,
          message: 'load instances' + ' failed: ' + e.message,
          type: 'is-danger'
        })
      }
    } finally {
      // mark loading done
      dispatch('setLoading', {group: 'app', type: 'instances', value: false})
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
