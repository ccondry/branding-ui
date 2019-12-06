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
  initSurfly ({getters}) {
    console.log('startSurflyCobrowse')

    // surfly settings
    const settings = {
      widget_key: getters.sessionConfig.surflyWidgetKey
    }

    // do init surfly
    window.initSurfly(settings)
  },
  loadSurfly ({commit, state}) {
    // only load once
    if (!state.surflyLoaded) {
      // do load surfly
      window.loadSurfly(window, document, 'script', 'Surfly')
      // set loaded in state
      commit(types.SET_SURFLY_LOADED, true)
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
