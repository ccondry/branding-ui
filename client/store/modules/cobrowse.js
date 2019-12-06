import * as types from '../mutation-types'

const getters = {
}

const state = {
  surflyLoaded: false
}

const mutations = {
  [types.SET_SURFLY_LOADED] (state, data) {
    state.surflyLoaded = data
  }
}

const actions = {
  loadSurfly ({getters, commit, state}) {
    if (!getters.sessionConfig.surflyWidgetKey) {
      console.log('No Surfly widget key was found in the user/session config. Surfly not started.')
    }
    // only load once
    if (state.surflyLoaded) {
      console.log('Surfly is already loaded.')
      return
    }
    // load surfly into DOM
    window.loadSurfly(window, document, 'script', 'Surfly')
    // set loaded flag in state
    commit(types.SET_SURFLY_LOADED, true)
    // surfly settings
    const settings = {
      widget_key: getters.sessionConfig.surflyWidgetKey
    }
    // do init surfly. this will add the surfly cobrowse button to the DOM
    window.initSurfly(settings)
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
