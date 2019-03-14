'use strict'

import {
  ready,
  mapAttr,
  charCount,
  timer,
  copyDivToClipboard,
  htmlTag
} from './base.js'
import formatJson from './formatters/formatJson.js'

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
      formatJson(htmlTag('span', 'token'))
    ).catch(err => {
      alert('An error occured. Check the console for details.')
      console.log(err)
    })
    const lineCount = charCount(inputCode.innerText, '\n')
    lineNumbersDiv.innerHTML = new Array(lineCount)
      .fill(undefined)
      .map((item, idx) => idx + 1)
      .join('<br />')

    inputCode.style.width = `calc(100% - 40px)`
    inputCode.setAttribute('contenteditable', false)
    lineNumbersDiv.style.width = `40px`
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
})
