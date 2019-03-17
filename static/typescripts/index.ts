'use strict'

const fs = require('fs')

import { ready, timer, promisify } from './base/base'
import { getLogger } from './base/logger'
import { Logger, KeyboardAction } from './base/interfaces'
import { copyToClipboard, pasteIntoHtml } from './base/clipboard'
import { checkForKeyboardShortcut, ksToString } from './base/keyboardShortcut'
import { highlighter } from './base/highlight'
import { formatJson } from './formatters/formatJson'

const getLoadTime: () => number = timer()()

ready(() => {
  logger.event(`document loaded in ${getLoadTime()} ms`)

  pasteInputDiv.spellcheck = false

  formatButton.addEventListener('click', formatButtonClick, false)
  copyButton.addEventListener('click', copyButtonClick, false)
  resetButton.addEventListener('click', resetButtonClick, false)
  document.addEventListener('keydown', keyDown, false)

  window.onunload = () => {
    logger.event('exiting page')
    formatButton.removeEventListener('click', formatButtonClick, false)
    copyButton.removeEventListener('click', copyButtonClick, false)
    resetButton.removeEventListener('click', resetButtonClick, false)
    document.removeEventListener('keydown', keyDown, false)
  }
})

// START OF LISTENERS

function formatButtonClick(): void {
  logger.event('format button clicked')
  const formattedJson = formatJson(
    pasteInputDiv.innerText,
    highlighter('token'),
    timer(timeLogger(logger, 'formatting'))
  )
  pasteInputDiv.innerHTML = formattedJson
  lineNumbersDiv.innerHTML = Array(formattedJson.split('\n').length)
    .fill(0)
    .map((_, idx) => idx + 1)
    .join('<br/>')
}

function copyButtonClick(): void {
  logger.event('copy button clicked')
  copyToClipboard(navigator, pasteInputDiv.innerText)
    .then(() => {
      logger.success('copied div text to clipboard')
    })
    .catch(handleError)
}

function resetButtonClick(): void {
  logger.event('reset button clicked')
  promisify(
    () => (pasteInputDiv.innerHTML = ''),
    () => (lineNumbersDiv.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&gt;')
  )
    .then(() => {
      logger.success('all elements reset')
    })
    .catch(handleError)
}

function keyDown(event: Event): void {
  keyboardActions.forEach(ka => {
    if (checkForKeyboardShortcut(event, ka.shortcut)) {
      event.preventDefault()
      logger.event(`keyboard shortcut: ${ksToString(ka.shortcut)}`)
      ka.action()
    }
  })
}

// END OF LISTENERS

// START OF HELPER FUNCTIONS

function timeLogger(logger: Logger, label: string): (n: number) => void {
  return function(time: number): void {
    logger.info(`${label}: ${time}`)
  }
}

function handleError(err: Error): void {
  logger.error(err.message)
}

// END OF HELPER FUNCTIONS

// ALL CONSTANTS

const version = 'v0.0.2'
const production: boolean = location.hostname !== 'localhost'
console.log(`${production ? 'Production' : 'Development'} build: ${version}`)

const logger: Logger = getLogger(production)

const formatButton: HTMLElement = document.getElementById('formatButton')
const pasteInputDiv: HTMLElement = document.getElementById('pasteInputDiv')
const lineNumbersDiv: HTMLElement = document.getElementById('lineNumbersDiv')
const resetButton: HTMLElement = document.getElementById('resetButton')
const copyButton: HTMLElement = document.getElementById('copyButton')

const keyboardActions: KeyboardAction[] = [
  {
    action: () => formatButton.click(),
    shortcut: {
      keyCode: 70,
      ctrlKey: true,
      shiftKey: true
    }
  },
  {
    action: () => copyButton.click(),
    shortcut: {
      keyCode: 67,
      ctrlKey: true,
      shiftKey: true
    }
  },
  {
    action: () => resetButton.click(),
    shortcut: {
      keyCode: 82,
      ctrlKey: true,
      shiftKey: true
    }
  },
  {
    action: () =>
      pasteIntoHtml(pasteInputDiv)
        .then(() => logger.success('pasted clipboard text into div'))
        .catch(handleError),
    shortcut: {
      keyCode: 86,
      ctrlKey: true
    }
  }
]
