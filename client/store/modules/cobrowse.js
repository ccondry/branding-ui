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

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const actions = {
  async loadSurfly ({getters, commit, state}) {
    if (!getters.sessionConfig.surflyWidgetKey) {
      console.log('No Surfly widget key was found in the user/session config. Surfly not started.')
    }
    // surfly settings
    const settings = {
      widget_key: getters.sessionConfig.surflyWidgetKey
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
    // wait for it to be loaded
    while (!window.Surfly) {
      // wait 300ms
      await sleep(300)
    }
    // now wait another bit to make sure it's done
    await sleep(800)
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
