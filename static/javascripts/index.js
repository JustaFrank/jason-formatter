'use strict'

import {
  ready,
  mapAttr,
  charCount,
  copyDivToClipboard,
  htmlTag
} from './base.js'
import getJsonFormatter from './formatters/formatJson2.js'

ready(() => {
  const formatButton = document.getElementById('formatButton')
  const inputCode = document.getElementById('inputCode')
  const lineNumbersDiv = document.getElementById('lineNumbersDiv')
  const resetButton = document.getElementById('resetButton')
  const copyButton = document.getElementById('copyButton')

  inputCode.spellcheck = false

  formatButton.addEventListener('click', async () => {
    inputCode.innerHTML = inputCode.innerText
    await mapAttr(
      inputCode,
      'innerHTML',
      getJsonFormatter(htmlTag('span', 'token'))
    ).catch(err => {
      alert('An error occured. Check the console for details.')
      console.log(err)
    })
    const lineCount = charCount(inputCode.innerText, '\n') + 1
    lineNumbersDiv.innerHTML = new Array(lineCount)
      .fill(undefined)
      .map((item, idx) => idx + 1)
      .join('<br />')

    const lineCountDigits = lineCount.toString().length

    inputCode.style.width = `calc(100% - ${
      lineCountDigits > 2 ? lineCountDigits + 1 : 4
    }0px)`
    inputCode.setAttribute('contenteditable', false)
    lineNumbersDiv.style.width = `${
      lineCountDigits > 2 ? lineCountDigits + 1 : 4
    }0px`
    window.scrollTo(0, 0)
  })

  copyButton.addEventListener('click', () => {
    copyDivToClipboard(inputCode)
  })

  resetButton.addEventListener('click', () => {
    inputCode.innerHTML = ''
    lineNumbersDiv.innerHTML = ''
    inputCode.style.width = `100%`
    inputCode.setAttribute('contenteditable', true)
    lineNumbersDiv.style.width = `0px`
  })

  document.addEventListener('keydown', event => {
    if (event.isComposing || event.keyCode === 229) {
      return
    } else if (event.ctrlKey && event.shiftKey) {
      switch (event.keyCode) {
        case 70:
          formatButton.click()
          break
        case 82:
          resetButton.click()
          break
        case 67:
          copyButton.click()
          break
      }
    }
  })
})
