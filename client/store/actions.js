import * as types from './mutation-types'
import { load, put, post, httpDelete } from '../utils'
import { Toast } from 'buefy/dist/components/toast'

export const toggleSidebar = ({ commit }, data) => {
  if (data instanceof Object) {
    commit(types.TOGGLE_SIDEBAR, data)
  }
}

export const toggleDevice = ({ commit }, data) => commit(types.TOGGLE_DEVICE, data)

export const expandMenu = ({ commit }, data) => {
  if (data) {
    data.expanded = data.expanded || false
    commit(types.EXPAND_MENU, data)
  }
}

export const switchEffect = ({ commit }, data) => {
  if (data) {
    commit(types.SWITCH_EFFECT, data)
  }
}

export const loadToState = async function ({getters, commit, dispatch}, options) {
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
}

export const setWorking = function ({getters, commit, dispatch}, {group, type, value = true}) {
  commit(types.SET_WORKING, {group, type, value})
}

export const setLoading = function ({getters, commit, dispatch}, {group, type, value = true}) {
  commit(types.SET_LOADING, {group, type, value})
}

export const putData = async function ({getters, commit, dispatch}, options) {
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
}

export const postData = async function ({getters, commit, dispatch}, options) {
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
}

export const deleteData = async function ({getters, commit, dispatch}, options) {
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
}
