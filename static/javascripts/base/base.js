"use strict";
exports.__esModule = true;
function ready(func) {
    document.addEventListener('DOMContentLoaded', func);
}
exports.ready = ready;
function curry(fn) {
    var arity = fn.length;
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
            return (partialArgs.length >= arity ? fn : resolver).apply(null, partialArgs);
        };
    })();
}
exports.curry = curry;
