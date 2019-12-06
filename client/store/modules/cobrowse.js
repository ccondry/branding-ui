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
    // try to find widget key in local storage
    const localKey = window.localStorage.getItem('surflyWidgetKey')
    if (!getters.sessionConfig.surflyWidgetKey && !localKey) {
      console.log('No surflyWidgetKey was found in the user/session config or in localStorage. Surfly not started.')
    }

    // try to use user/session config key
    let widgetKey = getters.sessionConfig.surflyWidgetKey
    // if no session config key found, use local key
    if (!widgetKey) {
      widgetKey = localKey
    }

    // surfly settings
    const settings = {
      widget_key: widgetKey
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
