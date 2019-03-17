function ready(cb) {
  document.addEventListener('DOMContentLoaded', cb)
}

function timer(cb: (n: number) => void = n => {}): () => () => number {
  return () => {
    const start = Date.now()
    return () => {
      const elapsed = Date.now() - start
      cb(elapsed)
      return elapsed
    }
  }
}

function promisify(...funcs: any[]): Promise<any> {
  return Promise.all(
    funcs.map(
      func =>
        new Promise((resolve, reject) => {
          resolve(func())
        })
    )
  )
}

function curry(func) {
  var arity = func.length

  return (function resolver(...args: any[]) {
    var mem = Array.prototype.slice.call(args)
    return function(...args: any[]) {
      var partialArgs = mem.slice()
      Array.prototype.push.apply(partialArgs, args)
      return (partialArgs.length >= arity ? func : resolver).apply(
        null,
        partialArgs
      )
    }
  })()
}

export { ready, timer, promisify, curry }
