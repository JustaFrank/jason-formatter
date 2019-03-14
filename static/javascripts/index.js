'use strict'

import { ready, mapAttr, charCount } from './base.js'
import formatJson from './formatters/formatJson.js'

ready(() => {
  const formatButton = document.getElementById('formatButton')
  const inputCode = document.getElementById('inputCode')
  const lineNumbersDiv = document.getElementById('lineNumbersDiv')
  const resetButton = document.getElementById('resetButton')

  inputCode.spellcheck = false

  inputCode.addEventListener('input', () => {
    inputCode.innerHTML = inputCode.innerText
  })

  resetButton.addEventListener('click', () => {
    inputCode.innerHTML = ''
    lineNumbersDiv.innerHTML = ''
    inputCode.style.width = `100%`
    inputCode.setAttribute('contenteditable', true)
    lineNumbersDiv.style.width = `0px`
  })

  formatButton.addEventListener('click', async () => {
    await mapAttr(inputCode, 'innerHTML', formatJson).then(() =>
      Prism.highlightElement(inputCode)
    )
    const lineCount = charCount(inputCode.innerText, '\n')
    lineNumbersDiv.innerHTML = new Array(lineCount)
      .fill(undefined)
      .map((item, idx) => idx + 1)
      .join('<br />')

    inputCode.style.width = `calc(100% - 40px)`
    inputCode.setAttribute('contenteditable', false)
    lineNumbersDiv.style.width = `40px`
  })
})
