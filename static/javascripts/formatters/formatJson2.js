import { timer } from '../base.js'

function getJsonFormatter(highlighter) {
  const punctuation = highlighter('punctuation')
  const operator = highlighter('operator')

  const comma = punctuation(',')
  const colon = operator(':')
  const curlyBraces = Brackets(true, punctuation)
  const squareBrackets = Brackets(false, punctuation)

  const property = Wrapper(...highlighter('property')('VALUE').split('VALUE'))
  const string = Wrapper(...highlighter('string')('VALUE').split('VALUE'))
  const number = Wrapper(...highlighter('number')('VALUE').split('VALUE'))
  const boolean = Wrapper(...highlighter('boolean')('VALUE').split('VALUE'))
  const nullWrapper = Wrapper(
    ...highlighter('null keyword')('VALUE').split('VALUE')
  )

  function bracketGetter(curly, square) {
    return function(isCurly) {
      return isCurly ? curly : square
    }
  }
  const getBrackets = bracketGetter(curlyBraces, squareBrackets)

  return function formatJson(jsonString) {
    const printElapsedTime = timer()

    let formattedString = ''
    let currentIndent = 0
    let newLine = true
    let currentWrapper = null

    for (let i = 0; i < jsonString.length; i++) {
      const cur = jsonString[i]

      match(cur)
        .on(
          cur => {
            return cur === ' ' || cur === '\n'
          },
          () => {}
        )
        .on(
          cur => {
            return cur === '{' || cur === '['
          },
          cur => {
            formattedString += indent(
              getBrackets(isCurly(cur)).open + '\n',
              newLine ? currentIndent : 0
            )
            currentIndent += 2
            newLine = true
          }
        )
        .on(
          cur => {
            return cur === '}' || cur === ']'
          },
          cur => {
            formattedString +=
              (currentWrapper ? currentWrapper.close : '') +
              '\n' +
              indent(getBrackets(isCurly(cur)).close, currentIndent - 2)
            currentIndent -= 2
            newLine = true
            currentWrapper = null
          }
        )
        .on(
          cur => {
            return cur === ','
          },
          () => {
            formattedString +=
              (currentWrapper ? currentWrapper.close : '') + comma + '\n'
            newLine = true
            currentWrapper = null
          }
        )
        .on(
          cur => {
            return cur === ':' && !currentWrapper
          },
          () => {
            formattedString +=
              (currentWrapper ? currentWrapper.close : '') + colon + ' '
            newLine = false
            currentWrapper = null
          }
        )
        .on(
          cur => {
            return cur === '"'
          },
          cur => {
            if (jsonString[i - 1] === '\\') {
              formattedString += cur
            } else if (
              currentWrapper &&
              currentWrapper.open.includes('string')
            ) {
              formattedString += cur + string.close
              currentWrapper = null
            } else if (
              currentWrapper &&
              currentWrapper.open.includes('property')
            ) {
              formattedString += cur + property.close
              currentWrapper = null
            } else if (newLine) {
              formattedString += indent(property.open + cur, currentIndent)
              currentWrapper = property
            } else {
              formattedString += string.open + cur
              currentWrapper = string
            }
            newLine = false
          }
        )
        .on(
          cur => {
            return !isNaN(cur)
          },
          cur => {
            if (newLine) {
              formattedString += indent(number.open + cur, currentIndent)
              currentWrapper = number
            } else if (currentWrapper === null) {
              formattedString += number.open + cur
              currentWrapper = number
            } else {
              formattedString += cur
            }
            newLine = false
          }
        )
        .on(
          () => {
            return (
              jsonString.slice(i, i + 4) === 'true' ||
              jsonString.slice(i, i + 5) === 'false'
            )
          },
          cur => {
            if (newLine) {
              formattedString += indent(boolean.open + cur, currentIndent)
              currentWrapper = boolean
            } else if (currentWrapper === null) {
              formattedString += boolean.open + cur
              currentWrapper = boolean
            } else {
              formattedString += cur
            }
            newLine = false
          }
        )
        .on(
          () => {
            return jsonString.slice(i, i + 4) === 'null'
          },
          cur => {
            if (newLine) {
              formattedString += indent(nullWrapper.open + cur, currentIndent)
              currentWrapper = nullWrapper
            } else if (currentWrapper === null) {
              formattedString += nullWrapper.open + cur
              currentWrapper = nullWrapper
            } else {
              formattedString += cur
            }
            newLine = false
          }
        )
        .otherwise(cur => {
          formattedString += indent(cur, newLine ? currentIndent : 0)
          newLine = false
        })
    }

    printElapsedTime()

    return formattedString
  }
}

function indent(string, numSpaces) {
  return spaces(numSpaces) + string
}

function spaces(num) {
  return Array(num + 1).join(' ')
}

function Brackets(isCurly, modifier) {
  const open = isCurly ? '{' : '['
  const close = isCurly ? '}' : ']'
  return Wrapper(modifier(open), modifier(close))
}

function Wrapper(open, close) {
  return {
    open: open,
    close: close
  }
}

function isCurly(bracket) {
  return bracket === '{' || bracket === '}'
}

function matched(x) {
  return {
    on: () => matched(x),
    otherwise: () => x
  }
}
function match(x) {
  return {
    on: (pred, fn) => (pred(x) ? matched(fn(x)) : match(x)),
    otherwise: fn => fn(x)
  }
}

function isBoolean(string) {
  return string === 'true' || string === 'false'
}

export default getJsonFormatter
