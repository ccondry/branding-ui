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

export const fillOption = function (value, storeName, store) {
  try {
    // don't operate on non-string values
    if (typeof value !== 'string') {
      return value
    }
    const s1 = '${' + storeName + '.'
    // look for all variables to replace with store value
    let v1 = value.indexOf(s1)
    // console.log('v1 =', v1)
    // return value
    let ret = value
    // loop to find all user values in this key
    while (v1 >= 0) {
      // found one. extract the name of the key.
      const start = v1
      const end = ret.indexOf('}', start)
      const v1key = ret.substring(start + s1.length, end)
      let storeValue
      // set value if exists
      if (store && store[v1key]) {
        // find matching value in store
        storeValue = store[v1key]
        // extract string parts to combine as replacement value
        const p1 = ret.substring(0, start)
        const p2 = storeValue
        const p3 = ret.substring(end + 1, ret.length)
        const newValue = p1 + p2 + p3
        // update ret var to the newValue as well, so the loop can continue
        ret = newValue
        // search for any more store values to loop on
        v1 = ret.indexOf(s1)
      } else {
        // store or store value did not exist
        console.log('required option not found in', storeName, ':', v1key)
        // required but did not exist - return 400
        throw Error(`Required parameter ${v1key} did not exist in ${storeName}.`)
        // search for any more store values to loop on after this one
      }
    }
    return ret
  } catch (e) {
    console.log('error in fillOption:', e)
    // return original value
    return value
  }
}
