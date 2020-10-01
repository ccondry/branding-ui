import axios from 'axios'

// helper function to append query parameters to a URL
export const addUrlQueryParams = function (endpoint, params) {
  let url = endpoint
  if (params) {
    url += '?'
    const keys = Object.keys(params)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = params[key]
      if (i !== 0) {
        url += '&'
      }
      url += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    }
  }
  return url
}

export const load = function (endpoint, query) {
  console.log('GET', endpoint)
  const options = {
    params: query
  }
  return axios.get(endpoint, options)
}

export const put = function (endpoint, query, data) {
  const options = {
    params: query
  }
  return axios.put(endpoint, data, options)
}

export const post = function (endpoint, query, data) {
  const options = {
    params: query
  }
  return axios.post(endpoint, data, options)
}

export const httpDelete = async function (endpoint, query) {
  const options = {
    params: query
  }
  return axios.delete(endpoint, options)
}

export const formatUnicorn = function () {
  // first arg is the string
  let str = arguments[0]
  for (let i in arguments) {
    if (i !== 0) {
      // following args are the replacements
      str = str.replace(new RegExp('\\{' + (i - 1) + '\\}', 'gi'), arguments[i])
    }
  }

  return str
}
