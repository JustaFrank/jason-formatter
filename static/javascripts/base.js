function ready(func) {
  document.addEventListener('DOMContentLoaded', func)
}

function result(value, err = false) {
  return {
    value: value,
    err: err,
    isLeft: () => !!value,
    isRight: () => !!err
  }
}

async function mapAttr(element, attr, mapFunc) {
  const [getAttr, setAttr] = await Promise.all([
    attrGetter(attr),
    attrSetter(attr)
  ])
  const attrValue = await getAttr(element).then(value => {
    return value === undefined ? result('Undefined attribute.', true) : value
  })
  await setAttr(element, await mapFunc(attrValue))
  return result('Successfully mapped attribute.', false)
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

export { ready, mapAttr, charCount }
