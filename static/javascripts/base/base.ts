function ready(func) {
  document.addEventListener('DOMContentLoaded', func)
}

function curry(fn) {
  var arity = fn.length

  return (function resolver(...args: any[]) {
    var mem = Array.prototype.slice.call(args)
    return function(...args: any[]) {
      var partialArgs = mem.slice()
      Array.prototype.push.apply(partialArgs, args)
      return (partialArgs.length >= arity ? fn : resolver).apply(
        null,
        partialArgs
      )
    }
  })()
}

export { ready, curry }
