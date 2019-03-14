async function formatJson(jsonString) {
  return stringifyJson(JSON.parse(jsonString), 2)
}

function stringifyJson(json, spaces = 2, indent = 0, firstIndent = undefined) {
  if (firstIndent === undefined) {
    firstIndent = indent
  }
  const firstSpaces = Array(firstIndent + 1).join(' ')
  const minSpaces = Array(indent + 1).join(' ')
  const maxSpaces = Array(spaces + indent + 1).join(' ')

  if (Array.isArray(json)) {
    let string = firstSpaces + '['
    if (json.length !== 0) {
      string += '\n'
      for (const item of json) {
        if (typeof item === 'object') {
          string += stringifyJson(item, spaces, indent + spaces) + ',\n'
        } else {
          const quotes = str => `"${str}"`
          const wrapper = typeof item === 'string' ? quotes : x => x
          string += maxSpaces + `${wrapper(item)},\n`
        }
      }
      string += minSpaces + ']'
    } else {
      string += ']'
    }
    return string
  } else if (json !== undefined && json !== null) {
    let string = firstSpaces + '{'
    if (Object.keys(json).length !== 0) {
      string += '\n'
      for (const key in json) {
        const value = json[key]

        const quotes = str => `"${str}"`
        string += maxSpaces + `${quotes(key)}: `

        if (typeof value === 'object') {
          string += stringifyJson(value, spaces, indent + spaces, 0) + ',\n'
        } else {
          const quotes = str => `"${str}"`
          const wrapper = typeof value === 'string' ? quotes : x => x
          string += `${wrapper(value)},\n`
        }
      }
      string += minSpaces + '}'
    } else {
      string += '}'
    }
    return string
  }
  return json
}

export default formatJson
