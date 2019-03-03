import axios from 'axios'

export const load = function (instance, jwt, endpoint, query) {
  console.log('GET', endpoint)
  const options = {
    params: query
  }
  options.headers = {
    Authorization: 'Bearer ' + jwt,
    instance
  }
  return axios.get(endpoint, options)
}

export const put = function (instance, jwt, endpoint, query, data) {
  const options = {
    params: query
  }
  options.headers = {
    Authorization: 'Bearer ' + jwt,
    instance
  }
  return axios.put(endpoint, data, options)
}

export const post = function (instance, jwt, endpoint, query, data) {
  const options = {
    params: query
  }
  options.headers = {
    Authorization: 'Bearer ' + jwt,
    instance
  }
  return axios.post(endpoint, data, options)
}

export const httpDelete = async function (instance, jwt, endpoint, query) {
  const options = {
    params: query
  }
  options.headers = {
    Authorization: 'Bearer ' + jwt,
    instance
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
