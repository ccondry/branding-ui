// a function that returns a predicate function for array.filter()
// does case-insensitive matching
export const contains = needle => {
  return haystack => {
    return doContainsFiltering(needle, haystack)
  }
}

// recursive filtering function - recursively evaluates the input object or
// string and returns true if any strings match the filter input string
function doContainsFiltering (needle, haystack) {
  if (typeof haystack === 'string') {
    // string
    return haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0
  } else if (Array.isArray(haystack)) {
    // array
    return haystack.some(key => {
      return doContainsFiltering(needle, key)
    })
  } else if (typeof haystack === 'object') {
    // object
    return Object.keys(haystack).some(key => {
      return doContainsFiltering(needle, haystack[key])
    })
  }
}
