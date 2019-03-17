import { Logger, CssMessage } from './interfaces'
import { curry } from './base'

function css(property, value): string {
  return `${property}:${value};`
}

function logCss(cssMessages: CssMessage[]): string[] {
  return [cssMessages.map(cm => `%c${cm.message}`).join(' ')].concat(
    cssMessages.map(cm => cm.css)
  )
}

const fontWeight: (s: string) => string = curry(css)('font-weight')
const color: (s: string) => string = curry(css)('color')
const fontStyle: (s: string) => string = curry(css)('font-style')

const bold: string = fontWeight('bold')
const italic: string = fontStyle('italic')
const labelCssBase: string = bold + italic

const colors = {
  info: '#3498DB',
  success: '#58D68D',
  error: '#E74C3C'
}

function getLogger(production: boolean = false): Logger {
  if (production) {
    return {
      info: (_: string) => {},
      success: (_: string) => {},
      error: (_: string) => {},
      log: (_: string) => {}
    }
  }
  return {
    info: (message: any) => {
      console.log(
        ...logCss([
          { message: 'info', css: labelCssBase + color(colors.info) },
          { message: message, css: '' }
        ])
      )
    },
    success: (message: any) => {
      console.log(
        ...logCss([
          { message: 'success', css: labelCssBase + color(colors.success) },
          { message: message, css: '' }
        ])
      )
    },
    error: (message: any) => {
      console.log(
        ...logCss([
          { message: 'error', css: labelCssBase + color(colors.error) },
          { message: message, css: '' }
        ])
      )
    },
    log: console.log
  }
}

export { getLogger }
