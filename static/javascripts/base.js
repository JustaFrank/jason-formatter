function ready(func) {
  document.addEventListener('DOMContentLoaded', func)
}

async function mapAttr(element, attr, mapFunc) {
  const [getAttr, setAttr] = await Promise.all([
    attrGetter(attr),
    attrSetter(attr)
  ])
  const attrValue = await getAttr(element).then(value => {
    if (value === undefined) {
      throw Error('Undefined attribute.')
    }
    return value
  })
  await setAttr(element, await mapFunc(attrValue)).catch(err => {
    console.log(err)
  })
}

async function attrGetter(attr) {
  return async function(element) {
    return element[attr]
  }
}

async function attrSetter(attr) {
  return async function(element, newValue) {
    element[attr] = newValue
  }
}

function charCount(string, char) {
  return string.split(char).length - 1
}

function timer() {
  const startTime = new Date().getTime()
  const logTime = time => console.log(`Elapsed time: ${time}`)
  return function(func = logTime) {
    const elapsedTime = new Date().getTime() - startTime
    func(elapsedTime)
    return elapsedTime
  }
}

function copyDivToClipboard(element) {
  var range = document.createRange()
  range.selectNode(element)
  window.getSelection().removeAllRanges()
  window.getSelection().addRange(range)
  document.execCommand('copy')
}

function htmlTag(tagName, classes) {
  return function(secondaryClasses) {
    return function(value) {
      return `<${tagName} class="${classes} ${secondaryClasses}">${value}</${tagName}>`
    }
  }
}

export { ready, mapAttr, charCount, timer, copyDivToClipboard, htmlTag }
