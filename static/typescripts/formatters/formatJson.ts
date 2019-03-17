import { curry } from '../base/base.js'

export function formatJson(
  jsonString: string,
  highlighter: (s: string) => (s: string) => string,
  timer: () => () => void = null
): string {
  const printElapsedTime: () => void = timer ? timer() : null

  let formattedString: string = ''
  let currentIndent: number = 0
  let stringIsProperty = true

  const findStringUntilQuote = curry(findStringUntil)(['"'])
  const findStringUntilComma = curry(findStringUntil)([',', '}', ']'])

  const hpunc = highlighter('punctuation')
  const hprop = highlighter('property')
  const hoper = highlighter('operator')
  const hstr = highlighter('string')
  const hnum = highlighter('number')
  const hnull = highlighter('null keyword')
  const hbool = highlighter('boolean')

  const comma = hpunc(',')
  const colon = hoper(':')

  for (let i: number = 0; i < jsonString.length; i++) {
    const currentChar: string = jsonString[i]
    switch (currentChar) {
      case '{':
      case '[':
        currentIndent += 2
        formattedString += hpunc(currentChar) + '\n' + spaces(currentIndent)
        stringIsProperty = true
        break
      case '}':
      case ']':
        currentIndent -= 2
        formattedString += '\n' + spaces(currentIndent) + hpunc(currentChar)
        stringIsProperty = true
        break
      case '"':
        const stringUntilQuote: string = findStringUntilQuote(
          jsonString,
          i + 1,
          ['\\']
        )
        if (stringIsProperty) {
          formattedString += hprop(`"${stringUntilQuote}"`)
        } else {
          formattedString += hstr(`"${stringUntilQuote}"`)
        }
        i += stringUntilQuote.length + 1
        break
      case ':':
        formattedString += colon + ' '
        stringIsProperty = false
        break
      case ' ':
      case '\n':
        break
      default:
        const stringUntilComma: string = findStringUntilComma(jsonString, i, [])
        const stringHighlighter = !isNaN(Number(stringUntilComma))
          ? hnum
          : stringUntilComma === 'true' || stringUntilComma === 'false'
          ? hbool
          : hnull
        i += stringUntilComma.length

        const stopChar = jsonString[i]
        switch (stopChar) {
          case ',':
            formattedString +=
              `${stringHighlighter(stringUntilComma)}` +
              comma +
              '\n' +
              spaces(currentIndent)
            break
          case '}':
          case ']':
            formattedString += `${stringHighlighter(stringUntilComma)}`
            i -= 1
            break
        }
        stringIsProperty = true
    }
  }

  if (timer) {
    printElapsedTime()
  }

  return formattedString
}

function findStringUntil(
  chars: string[],
  string: string,
  start: number,
  ignore: string[]
): string {
  let resultString = ''
  let ignoreNext = false
  for (let i: number = start; i < string.length; i++) {
    const currentChar: string = string[i]
    if (ignoreNext) {
      resultString += currentChar
      ignoreNext = false
    } else if (ignore.includes(currentChar)) {
      resultString += currentChar
      ignoreNext = true
    } else if (!chars.includes(currentChar)) {
      resultString += currentChar
    } else {
      return resultString
    }
  }
  return resultString
}

function spaces(numSpaces: number): string {
  return Array(numSpaces + 1).join(' ')
}
