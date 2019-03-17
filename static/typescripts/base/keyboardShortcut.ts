import { KeyboardShortcut, KeyboardAction } from './interfaces'

const deepEqual = require('deep-equal')

function checkForKeyboardShortcut(
  event: Event,
  shortcut: KeyboardShortcut
): boolean {
  const commonKeys: Object = Object.keys(shortcut).reduce((acc, cur) => {
    return cur in event ? Object.assign(acc, { [cur]: event[cur] }) : acc
  }, {})
  return deepEqual(commonKeys, shortcut)
}

function ksToString(ks: KeyboardShortcut): string {
  let ksString: string = ''
  ksString += ks.ctrlKey ? 'Ctrl + ' : ''
  ksString += ks.shiftKey ? 'Shift + ' : ''
  ksString += ks.metaKey ? 'Meta + ' : ''
  ksString += ks.altKey ? 'Alt + ' : ''
  ksString += String.fromCharCode(ks.keyCode)
  return ksString
}

export { checkForKeyboardShortcut, ksToString }
