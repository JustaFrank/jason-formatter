(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var pSlice = Array.prototype.slice;
var objectKeys = require('./lib/keys.js');
var isArguments = require('./lib/is_arguments.js');

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}

},{"./lib/is_arguments.js":2,"./lib/keys.js":3}],2:[function(require,module,exports){
var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
};

},{}],3:[function(require,module,exports){
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var deepEqual = require('deep-equal');
function checkForKeyboardShortcut(event, shortcut) {
    var commonKeys = Object.keys(shortcut).reduce(function (acc, cur) {
        var _a;
        return cur in event ? Object.assign(acc, (_a = {}, _a[cur] = event[cur], _a)) : acc;
    }, {});
    return deepEqual(commonKeys, shortcut);
}
exports.checkForKeyboardShortcut = checkForKeyboardShortcut;
function ksToString(ks) {
    var ksString = '';
    ksString += ks.ctrlKey ? 'Ctrl + ' : '';
    ksString += ks.shiftKey ? 'Shift + ' : '';
    ksString += ks.metaKey ? 'Meta + ' : '';
    ksString += ks.altKey ? 'Alt + ' : '';
    ksString += String.fromCharCode(ks.keyCode);
    return ksString;
}
exports.ksToString = ksToString;

},{"deep-equal":1}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var base_1 = require("./base");
function css(property, value) {
    return property + ":" + value + ";";
}
function logCss(cssMessages) {
    return [cssMessages.map(function (cm) { return "%c" + cm.message; }).join(' ')].concat(cssMessages.map(function (cm) { return cm.css; }));
}
var fontWeight = base_1.curry(css)('font-weight');
var color = base_1.curry(css)('color');
var fontStyle = base_1.curry(css)('font-style');
var bold = fontWeight('bold');
var italic = fontStyle('italic');
var labelCssBase = bold + italic;
var colors = {
    info: '#3498DB',
    success: '#58D68D',
    error: '#E74C3C'
};
function getLogger(production) {
    if (production === void 0) { production = false; }
    if (production) {
        return {
            info: function (_) { },
            success: function (_) { },
            error: function (_) { },
            log: function (_) { }
        };
    }
    return {
        info: function (message) {
            console.log.apply(console, logCss([
                { message: 'info', css: labelCssBase + color(colors.info) },
                { message: message, css: '' }
            ]));
        },
        success: function (message) {
            console.log.apply(console, logCss([
                { message: 'success', css: labelCssBase + color(colors.success) },
                { message: message, css: '' }
            ]));
        },
        error: function (message) {
            console.log.apply(console, logCss([
                { message: 'error', css: labelCssBase + color(colors.error) },
                { message: message, css: '' }
            ]));
        },
        log: console.log
    };
}
exports.getLogger = getLogger;

},{"./base":4}],7:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var base_1 = require("./base/base");
var logger_1 = require("./base/logger");
var keyboardShortcut_1 = require("./base/keyboardShortcut");
base_1.ready(function () {
    pasteInputDiv.spellcheck = false;
    formatButton.addEventListener('click', function () {
        pasteInputDiv.innerHTML = formatInput(pasteInputDiv.innerText);
    });
    copyButton.addEventListener('click', function () {
        copyToClipboard(pasteInputDiv.innerText);
    });
    resetButton.addEventListener('click', function () {
        logger.error('TODO: restart button click');
    });
    document.addEventListener('keydown', function (event) {
        keyboardActions.forEach(function (ka) {
            if (keyboardShortcut_1.checkForKeyboardShortcut(event, ka.shortcut)) {
                event.preventDefault();
                logger.info("keyboard shortcut: " + keyboardShortcut_1.ksToString(ka.shortcut));
                ka.action();
            }
        });
    });
});
function formatInput(input) {
    logger.error('TODO: format input');
    return input;
}
function copyToClipboard(string) {
    logger.error('TODO: clipboard copy');
}
// ALL VARIABLES UNDER HERE
var logger = logger_1.getLogger();
var formatButton = document.getElementById('formatButton');
var pasteInputDiv = document.getElementById('pasteInputDiv');
var lineNumbersDiv = document.getElementById('lineNumbersDiv');
var resetButton = document.getElementById('resetButton');
var copyButton = document.getElementById('copyButton');
var keyboardActions = [
    {
        action: function () { return formatButton.click(); },
        shortcut: {
            keyCode: 70,
            ctrlKey: true,
            shiftKey: true
        }
    },
    {
        action: function () { return copyButton.click(); },
        shortcut: {
            keyCode: 67,
            ctrlKey: true,
            shiftKey: true
        }
    },
    {
        action: function () { return resetButton.click(); },
        shortcut: {
            keyCode: 82,
            ctrlKey: true,
            shiftKey: true
        }
    }
];

},{"./base/base":4,"./base/keyboardShortcut":5,"./base/logger":6}]},{},[7]);
