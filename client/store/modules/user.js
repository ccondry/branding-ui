import * as types from '../mutation-types'
import axios from 'axios'
import { load } from '../../utils'

const state = {
  user: {}
}

const getters = {
  user: state => state.user
}

const mutations = {
  [types.SET_USER] (state, data) {
    state.user = data
  }
}

function getErrorMessage (error) {
  console.log(error.response)
  if (error.response.data.body) {
    return error.response.body
  } else {
    return error.response.data
  }
}

const actions = {
  async patchUser ({getters, commit, dispatch}, {body, field}) {
    try {
      const options = {}
      if (getters.authEnabled === true) {
        const jwt = getters.jwt
        options.headers = {
          Authorization: 'Bearer ' + jwt
        }
      }
      dispatch('setWorking', {group: 'app', type: 'user', value: true})
      const response = await axios.patch(`/users/${getters.user.username}?field=${field}`, body, options)
      dispatch('setWorking', {group: 'app', type: 'user', value: false})
      console.log('response:', response)
      dispatch('successNotification', {
        title: 'User Saved',
        message: 'User details updated successfully.'
      })
      // load user again
      dispatch('loadUser', false)
      return true
    } catch (error) {
      console.log('axios error: ', error)
      const title = `Failed to update your user details.`
      const message = getErrorMessage(error)
      dispatch('errorNotification', {
        title,
        message
      })
      return false
    }
  },
  async putUser ({commit, getters, dispatch}, data) {
    try {
      const options = {}
      if (getters.authEnabled === true) {
        const jwt = getters.jwt
        options.headers = {
          Authorization: 'Bearer ' + jwt
        }
      }
      dispatch('setWorking', {group: 'app', type: 'user', value: true})
      await axios.put(`/user`, data, options)
      dispatch('setWorking', {group: 'app', type: 'user', value: false})
      // console.log(response)
      dispatch('successNotification', {
        title: 'User Saved',
        message: 'User details saved successfully.'
      })
      // reload user, but don't notify user on success
      dispatch('loadUser', false)
    } catch (e) {
      dispatch('errorNotification', {
        title: 'User Not Saved',
        message: getErrorMessage(e)
      })
    }
  },
  async loadUser ({getters, commit, dispatch}, showNotification = true) {
    try {
      dispatch('setLoading', {group: 'app', type: 'user', value: true})
      const response = await load(getters, 'user')
      dispatch('setLoading', {group: 'app', type: 'user', value: false})
      console.log('load user details:', response)
      commit(types.SET_USER, response.data)
      if (showNotification) {
        dispatch('successNotification', 'Successfully loaded user details')
      }
    } catch (e) {
      console.log('error loading defaults', e)
      dispatch('errorNotification', {title: 'Failed to load user details', error: e})
    }
  },
  addUserData ({getters, dispatch}, params) {
    console.log(`adding ${params.field} ${params.data}`)
    // copy getters data into body
    let body = []
    try {
      body = getters.user[params.field].slice()
    } catch (e) {}
    // check that we're not trying to add something alread in the list
    if (body.indexOf(params.data) < 0) {
      // data not already in list, so add it
      body.push(params.data)
      dispatch('patchUser', {body, field: params.field})
    } else {
      // no change
      dispatch('infoNotification', {
        title: 'User Not Changed',
        message: 'Data you tried to add was already in the set.'
      })
    }
  },
  deleteUserData ({commit, getters, dispatch}, params) {
    console.log(`deleting ${params.phone} ${params.data}`)
    // copy getters data into body
    let body = []
    try {
      body = getters.user[params.field].slice()
    } catch (e) {}
    try {
      // remove desired entry
      body.splice(body.indexOf(params.data), 1)
      // patch server data
      dispatch('patchUser', {body, field: params.field})
    } catch (e) {
      // no change
      dispatch('infoNotification', {
        title: 'User Not Changed',
        message: 'Data you tried to delete was not in the set.'
      })
    }
  },
  setDemo ({dispatch, getters}, {dnis, demo, name, params, type}) {
    console.log(`updating user's ${type} demo ${dnis}`)
    // // copy user's demo property
    // let demos = {}
    // try {
    //   demos = JSON.parse(JSON.stringify(getters.user.demos))
    // } catch (e) {}
    // make sure we have an object for this demo type to work with
    // if (!demos[type]) {
    //   demos[type] = {}
    // }
    // // set demo config using input params
    // demos[type][dnis] = {
    //   demo,
    //   name,
    //   params
    // }

    dispatch('postData', {
      endpoint: getters.endpoints.demosSelectors,
      name: 'save ' + type + ' demo selector config',
      showNotification: true,
      data: {
        type,
        dnis,
        data: {
          demo,
          name,
          params
        }
      }
    })
    // return dispatch('patchUser', {body: demos, field: 'demos'})
    //
    //
    // const endpoint = formatUnicorn(getters.endpoints.templates, type)
    // const response = await load(getters.instance, getters.jwt, endpoint)
    // console.log('load', type, 'templates:', response)
    // commit(types.SET_TEMPLATES, {type, data: response.data})
  }
  // async provisionUser ({dispatch}) {
  //   console.log(`provisioning user department and demos`)
  //   dispatch('setWorking', {group: 'app', type: 'user', value: true})
  //   await dispatch('postData', {
  //     path: 'user/provision',
  //     name: 'Provision User',
  //     showNotification: true
  //   })
  //   dispatch('setWorking', {group: 'app', type: 'user', value: false})
  //   // update user data in state
  //   dispatch('loadUser')
  // }
}

export default {
  state,
  mutations,
  actions,
  getters
}
