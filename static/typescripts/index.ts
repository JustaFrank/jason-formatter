'use strict'

import { ready } from './base/base'
import { getLogger } from './base/logger'
import { Logger, KeyboardAction } from './base/interfaces'
import { checkForKeyboardShortcut, ksToString } from './base/keyboardShortcut'

ready(() => {
  pasteInputDiv.spellcheck = false

  formatButton.addEventListener('click', () => {
    pasteInputDiv.innerHTML = formatInput(pasteInputDiv.innerText)
  })

  copyButton.addEventListener('click', () => {
    copyToClipboard(pasteInputDiv.innerText)
  })

  resetButton.addEventListener('click', () => {
    logger.error('TODO: restart button click')
  })

  document.addEventListener('keydown', (event: Event) => {
    keyboardActions.forEach(ka => {
      if (checkForKeyboardShortcut(event, ka.shortcut)) {
        event.preventDefault()
        logger.info(`keyboard shortcut: ${ksToString(ka.shortcut)}`)
        ka.action()
      }
    })
  })
})

function formatInput(input: string): string {
  logger.error('TODO: format input')
  return input
}

function copyToClipboard(string: string): void {
  logger.error('TODO: clipboard copy')
}

// ALL VARIABLES UNDER HERE

const logger: Logger = getLogger()

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
  }
]
