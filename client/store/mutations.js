import * as types from './mutation-types'
import Vue from 'vue'

const mutations = {
  [types.SET_INSTANCE] (state, data) {
    console.log('setting instance to', `${data.datacenter}-${data.id}`)
    state.instance = `${data.datacenter}-${data.id}`
  },
  [types.SET_INSTANCES] (state, data) {
    state.instances = data
  },
  [types.SET_INSTANCES_LOADED] (state, data) {
    state.instancesLoaded = data
  },
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
  }
}

export default mutations
