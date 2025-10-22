// sleep / noop
export const sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// helper function to append query parameters to a URL for fetch
export const addUrlQueryParams = function (endpoint, params) {
  let url = endpoint
  if (typeof params === 'object') {
    // append URL query paramenters
    const keys = Object.keys(params)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = params[key]
      if (i === 0) {
        url += '?'
      } else {
        url += '&'
      }
      url += encodeURIComponent(key) + '=' + encodeURIComponent(value)
    }
  }
  return url
}

export async function load (endpoint, query) {
  const url = addUrlQueryParams(endpoint, query)
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })
  if (response.ok) {
    return await response.json()
  } else {
    const e = new Error(`${response.status} - ${await response.text()}`)
    e.status = response.status
    throw e
  }
}

export async function put (endpoint, query, data) {
  const url = addUrlQueryParams(endpoint, query)
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(data)
  })
  if (response.ok) {
    return await response.json()
  } else {
    const e = new Error(`${response.status} - ${await response.text()}`)
    e.status = response.status
    throw e
  }
}

export async function post (endpoint, query, data) {
  const url = addUrlQueryParams(endpoint, query)
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  })
  if (response.ok) {
    return await response.json()
  } else {
    const e = new Error(`${response.status} - ${await response.text()}`)
    e.status = response.status
    throw e
  }
}

export async function httpDelete (endpoint, query) {
  const url = addUrlQueryParams(endpoint, query)
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  })
  if (response.ok) {
    return await response.json()
  } else {
    const e = new Error(`${response.status} - ${await response.text()}`)
    e.status = response.status
    throw e
  }
}

export function formatUnicorn () {
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

export function fillOption (value, storeName, store) {
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
        throw new Error(`Required parameter ${v1key} did not exist in ${storeName}.`)
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
