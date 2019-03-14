import { timer } from '../base.js'

function formatJson(highlightTag) {
  return jsonString => {
    const printElapsedTime = timer()
    return new Promise((resolve, reject) => {
      resolve(jsonString)
    })
      .then(JSON.parse)
      .then(jsonStringifier(highlightTag, 2))
      .then(formattedJson => {
        printElapsedTime()
        return formattedJson
      })
  }
}

function jsonStringifier(highlightTag, spaces = 2) {
  return function stringifyJson(json, indent = 0) {
    if (json === null || json === undefined) {
      return highlightTag('null keyword')(json)
    }

    const isArray = Array.isArray(json)

    const punctuation = highlightTag('punctuation')
    const operator = highlightTag('operator')
    const property = highlightTag('property')

    const comma = punctuation(',')
    const colon = operator(':')
    const quoteWrapper = str => `"${str}"`

    const brackets = isArray
      ? Brackets(false, punctuation)
      : Brackets(true, punctuation)

    const formattedArray = isArray
      ? json.map(item => {
          const itemType = typeof item
          if (itemType === 'object') {
            return stringifyJson(item, indent + spaces)
          } else {
            const wrapper =
              itemType === 'string'
                ? combine(highlightTag(itemType), quoteWrapper)
                : highlightTag(itemType)
            return wrapper(item)
          }
        })
      : Object.keys(json).map(key => {
          const value = json[key]
          const itemType = typeof value
          const propertyString = property(quoteWrapper(key)) + colon + ' '
          if (itemType === 'object') {
            return propertyString + stringifyJson(value, indent + spaces)
          } else {
            const wrapper =
              itemType === 'string'
                ? combine(highlightTag(itemType), quoteWrapper)
                : highlightTag(itemType)
            return propertyString + wrapper(value)
          }
        })

    return formatObject(formattedArray, brackets, comma, spaces, indent)
  }
}

function formatObject(stringArray, brackets, comma, spaces, indent) {
  if (stringArray.length === 0) {
    return brackets.open + brackets.close
  }

  const minSpaces = getSpaces(indent)
  const maxSpaces = getSpaces(spaces + indent)

  let string = brackets.open + '\n'
  for (const item of stringArray) {
    string += maxSpaces + item + comma + '\n'
  }
  string += minSpaces + brackets.close
  return string
}

function Brackets(isCurly, modifier) {
  const open = isCurly ? '{' : '['
  const close = isCurly ? '}' : ']'
  return {
    open: modifier(open),
    close: modifier(close)
  }
}

function getSpaces(numSpaces) {
  return Array(numSpaces + 1).join(' ')
}

function combine(func1, func2) {
  return function() {
    return func1(func2(...arguments))
  }
}

export default formatJson
