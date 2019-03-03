import * as types from '../mutation-types'
import axios from 'axios'
import { post } from '../../utils'

function parseJwt (token) {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(window.atob(base64))
}

const state = {
  jwt: null,
  forwardTo: null
}

const getters = {
  jwt: state => state.jwt,
  authenticated: state => state.jwt !== null,
  forwardTo: state => state.forwardTo
}

const mutations = {
  [types.SET_JWT] (state, data) {
    state.jwt = data
  },
  [types.FORWARD_TO] (state, data) {
    state.forwardTo = data
  }
}

const actions = {
  setForwardTo ({commit}, data) {
    commit(types.FORWARD_TO, data)
  },
  setJwt ({commit}, data) {
    commit(types.SET_JWT, data)
    // set authToken in localStorage also
    window.localStorage.setItem('jwt', data)
    // decode jwt and store as user data
    try {
      commit(types.SET_USER, parseJwt(data))
    } catch (e) {
      // invalid JWT?
      console.error('invalid JWT', data)
      // unset JWT in state
      commit(types.SET_JWT, null)
      // remove JWT from localStorage
      window.localStorage.removeItem('jwt')
      // unset user in state
      commit(types.SET_USER, {})
    }
  },
  unsetJwt ({commit}) {
    // unset JWT in state
    commit(types.SET_JWT, null)
    // remove JWT from localStorage
    window.localStorage.removeItem('jwt')
    // unset user in state
    commit(types.SET_USER, {})
  },
  async logout ({dispatch, commit, getters}) {
    console.log('logging out user')
    try {
      // tell server we're logging out
      const response = await post(getters.instance, getters.jwt, getters.endpoints.logout)
      // did they successfully log out of superuser mode?
      if (response.status >= 200 && response.status < 300) {
        if (response.data.jwt) {
          // store new auth token in localStorage
          dispatch('setJwt', response.data.jwt)
          // load user data using JWT
          // dispatch('loadUser')
          dispatch('successNotification', `Successfully logged out of ${getters.user.username}`)
        } else {
          // remove JWT
          commit(types.SET_JWT, null)
          // remove JWT from localStorage
          window.localStorage.removeItem('jwt')
          // remove user from state
          commit(types.SET_USER, {})
        }
      } else {
        dispatch('errorNotification', `Failed to log out of ${getters.user.username}`)
      }
    } catch (e) {
      console.log(e.message)
    }
  },
  async login ({getters, dispatch}, data) {
    dispatch('setWorking', {group: 'app', type: 'login', value: true})
    // store a local copy of user/pass
    let username = data.username
    let password = data.password
    // try login request
    try {
      const response = await axios.post(getters.endpoints.login, {
        username,
        password
      })
      // console.log(response)
      // if successful
      if (response.status >= 200 && response.status < 300) {
        // store auth token in localStorage
        dispatch('setJwt', response.data.jwt)

        dispatch('successNotification', {
          title: `Logged in Successfully`,
          message: ''
        })

        // load user data using JWT
        // dispatch('loadUser')
        // load the session details - dCloud only
        // dispatch('getSession')
      } else {
        dispatch('errorNotification', {
          title: `Login Failed`,
          message: `${response.status} ${response.statusText}`
        })
      }
    } catch (error) {
      console.log(error)
      dispatch('errorNotification', {
        title: `Login Failed`,
        message: `${error.response.status} ${error.response.statusText}`
      })
      throw error
    } finally {
      dispatch('setWorking', {group: 'app', type: 'login', value: false})
    }
  },
  async checkLogin ({getters, dispatch, commit, rootState}) {
    console.log('checking localstorage for JWT login token')
    // retrieve auth token from localStorage
    const jwt = window.localStorage.getItem('jwt')
    // if we found a token, check the web service to see if it's still valid
    if (jwt !== null) {
      console.log('JWT login token found in localStorage')
      console.log('saving JWT in state')
      dispatch('setJwt', jwt)
    } else {
      console.log('JWT not found in localstorage.')
      // forward user to login page if not development
      if (process.env.NODE_ENV === 'production') {
        window.location = '/auth/login?destination=' + window.location
      }
    }
  },
  async sendPasswordResetEmail ({getters, dispatch, commit, rootState}, data) {
    // try reset password request
    try {
      // send data as email or username depending on contents
      let body
      if (data.indexOf('@') > 0) {
        body = {email: data}
      } else {
        body = {username: data}
      }
      const response = await axios.post(`/auth/password/reset/request`, body)
      // if successful
      if (response.status >= 200 && response.status < 300) {
        dispatch('successNotification', {
          title: `Password Reset Email Sent`,
          message: 'You should be receiving an email shortly with the link to reset your password.',
          duration: 12000
        })
      } else {
        dispatch('errorNotification', {
          title: `Failed to Send Password Reset Email`,
          message: `${response.status} ${response.statusText}`
        })
      }
    } catch (error) {
      console.log(error)
      dispatch('errorNotification', {
        title: `Failed to Send Password Reset Email`,
        message: `${error.response.status} ${error.response.statusText}`
      })
      throw error
    }
  },
  async resetPassword ({getters, dispatch}, data) {
    // try password reset request
    try {
      const response = await axios.post(`/auth/password/reset`, data)
      // if successful
      if (response.status >= 200 && response.status < 300) {
        dispatch('successNotification', {
          title: `Password Reset Successful`,
          message: 'You can now log in with your new password.'
        })
      } else {
        dispatch('errorNotification', {
          title: `Failed to Reset Password`,
          message: `${response.status} ${response.statusText}`
        })
      }
    } catch (error) {
      console.log(error)
      dispatch('errorNotification', {
        title: `Failed to Reset Password`,
        message: `${error.response.status} ${error.response.statusText}`
      })
      throw error
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
