"use strict";
exports.__esModule = true;
function ready(cb) {
    document.addEventListener('DOMContentLoaded', cb);
}
exports.ready = ready;
function timer(cb) {
    if (cb === void 0) { cb = function (n) { }; }
    return function () {
        var start = Date.now();
        return function () {
            var elapsed = Date.now() - start;
            cb(elapsed);
            return elapsed;
        };
    };
}
exports.timer = timer;
function promisify() {
    var funcs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        funcs[_i] = arguments[_i];
    }
    return Promise.all(funcs.map(function (func) {
        return new Promise(function (resolve, reject) {
            resolve(func());
        });
    }));
}
exports.promisify = promisify;
function curry(func) {
    var arity = func.length;
    return (function resolver() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var mem = Array.prototype.slice.call(args);
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var partialArgs = mem.slice();
            Array.prototype.push.apply(partialArgs, args);
            return (partialArgs.length >= arity ? func : resolver).apply(null, partialArgs);
        };
    })();
}
exports.curry = curry;
