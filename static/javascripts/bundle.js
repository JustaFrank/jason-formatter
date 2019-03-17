(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
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

},{"./lib/is_arguments.js":3,"./lib/keys.js":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
function copyToClipboard(navigator, text) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            //@ts-ignore
            return [2 /*return*/, navigator.clipboard.writeText(text)];
        });
    });
}
exports.copyToClipboard = copyToClipboard;
function readFromClipboard(navigator) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            //@ts-ignore
            return [2 /*return*/, navigator.clipboard.readText()];
        });
    });
}
exports.readFromClipboard = readFromClipboard;
function pasteIntoHtml(element) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = element;
                    _b = _a.innerHTML;
                    return [4 /*yield*/, readFromClipboard(navigator)];
                case 1:
                    _a.innerHTML = _b + _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.pasteIntoHtml = pasteIntoHtml;

},{}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function highlighter(primaryClasses) {
    return function (secondaryClasses) {
        return function (value) {
            return "<span class=\"" + primaryClasses + " " + secondaryClasses + "\">" + value + "</span>";
        };
    };
}
exports.highlighter = highlighter;

},{}],8:[function(require,module,exports){
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

},{"deep-equal":2}],9:[function(require,module,exports){
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
    info: '#000',
    success: '#58D68D',
    error: '#E74C3C',
    event: '#3498DB'
};
function getLogger(production) {
    if (production === void 0) { production = false; }
    if (production) {
        return {
            info: function (_) { },
            success: function (_) { },
            error: function (_) { },
            event: function (_) { },
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
        event: function (message) {
            console.log.apply(console, logCss([
                { message: 'event', css: labelCssBase + color(colors.event) },
                { message: message, css: '' }
            ]));
        },
        log: console.log
    };
}
exports.getLogger = getLogger;

},{"./base":5}],10:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var base_js_1 = require("../base/base.js");
function formatJson(jsonString, highlighter, timer) {
    if (timer === void 0) { timer = null; }
    var printElapsedTime = timer ? timer() : null;
    var formattedString = '';
    var currentIndent = 0;
    var stringIsProperty = true;
    var findStringUntilQuote = base_js_1.curry(findStringUntil)(['"']);
    var findStringUntilComma = base_js_1.curry(findStringUntil)([',', '}', ']']);
    var hpunc = highlighter('punctuation');
    var hprop = highlighter('property');
    var hoper = highlighter('operator');
    var hstr = highlighter('string');
    var hnum = highlighter('number');
    var hnull = highlighter('null keyword');
    var hbool = highlighter('boolean');
    var comma = hpunc(',');
    var colon = hoper(':');
    for (var i = 0; i < jsonString.length; i++) {
        var currentChar = jsonString[i];
        switch (currentChar) {
            case '{':
            case '[':
                currentIndent += 2;
                formattedString += hpunc(currentChar) + '\n' + spaces(currentIndent);
                stringIsProperty = true;
                break;
            case '}':
            case ']':
                currentIndent -= 2;
                formattedString += '\n' + spaces(currentIndent) + hpunc(currentChar);
                stringIsProperty = true;
                break;
            case '"':
                var stringUntilQuote = findStringUntilQuote(jsonString, i + 1, ['\\']);
                if (stringIsProperty) {
                    formattedString += hprop("\"" + stringUntilQuote + "\"");
                }
                else {
                    formattedString += hstr("\"" + stringUntilQuote + "\"");
                }
                i += stringUntilQuote.length + 1;
                break;
            case ':':
                formattedString += colon + ' ';
                stringIsProperty = false;
                break;
            case ' ':
            case '\n':
                break;
            default:
                var stringUntilComma = findStringUntilComma(jsonString, i, []);
                var stringHighlighter = !isNaN(Number(stringUntilComma))
                    ? hnum
                    : stringUntilComma === 'true' || stringUntilComma === 'false'
                        ? hbool
                        : hnull;
                i += stringUntilComma.length;
                var stopChar = jsonString[i];
                switch (stopChar) {
                    case ',':
                        formattedString +=
                            "" + stringHighlighter(stringUntilComma) +
                                comma +
                                '\n' +
                                spaces(currentIndent);
                        break;
                    case '}':
                    case ']':
                        formattedString += "" + stringHighlighter(stringUntilComma);
                        i -= 1;
                        break;
                }
                stringIsProperty = true;
        }
    }
    if (timer) {
        printElapsedTime();
    }
    return formattedString;
}
exports.formatJson = formatJson;
function findStringUntil(chars, string, start, ignore) {
    var resultString = '';
    var ignoreNext = false;
    for (var i = start; i < string.length; i++) {
        var currentChar = string[i];
        if (ignoreNext) {
            resultString += currentChar;
            ignoreNext = false;
        }
        else if (ignore.includes(currentChar)) {
            resultString += currentChar;
            ignoreNext = true;
        }
        else if (!chars.includes(currentChar)) {
            resultString += currentChar;
        }
        else {
            return resultString;
        }
    }
    return resultString;
}
function spaces(numSpaces) {
    return Array(numSpaces + 1).join(' ');
}

},{"../base/base.js":5}],11:[function(require,module,exports){
'use strict';
exports.__esModule = true;
var fs = require('fs');
var base_1 = require("./base/base");
var logger_1 = require("./base/logger");
var clipboard_1 = require("./base/clipboard");
var keyboardShortcut_1 = require("./base/keyboardShortcut");
var highlight_1 = require("./base/highlight");
var formatJson_1 = require("./formatters/formatJson");
var getLoadTime = base_1.timer()();
base_1.ready(function () {
    logger.event("document loaded in " + getLoadTime() + " ms");
    pasteInputDiv.spellcheck = false;
    formatButton.addEventListener('click', formatButtonClick, false);
    copyButton.addEventListener('click', copyButtonClick, false);
    resetButton.addEventListener('click', resetButtonClick, false);
    document.addEventListener('keydown', keyDown, false);
    window.onunload = function () {
        logger.event('exiting page');
        formatButton.removeEventListener('click', formatButtonClick, false);
        copyButton.removeEventListener('click', copyButtonClick, false);
        resetButton.removeEventListener('click', resetButtonClick, false);
        document.removeEventListener('keydown', keyDown, false);
    };
});
// START OF LISTENERS
function formatButtonClick() {
    logger.event('format button clicked');
    var formattedJson = formatJson_1.formatJson(pasteInputDiv.innerText, highlight_1.highlighter('token'), base_1.timer(timeLogger(logger, 'formatting')));
    pasteInputDiv.innerHTML = formattedJson;
    lineNumbersDiv.innerHTML = Array(formattedJson.split('\n').length)
        .fill(0)
        .map(function (_, idx) { return idx + 1; })
        .join('<br/>');
}
function copyButtonClick() {
    logger.event('copy button clicked');
    clipboard_1.copyToClipboard(navigator, pasteInputDiv.innerText)
        .then(function () {
        logger.success('copied div text to clipboard');
    })["catch"](handleError);
}
function resetButtonClick() {
    logger.event('reset button clicked');
    base_1.promisify(function () { return (pasteInputDiv.innerHTML = ''); }, function () { return (lineNumbersDiv.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&gt;'); })
        .then(function () {
        logger.success('all elements reset');
    })["catch"](handleError);
}
function keyDown(event) {
    keyboardActions.forEach(function (ka) {
        if (keyboardShortcut_1.checkForKeyboardShortcut(event, ka.shortcut)) {
            event.preventDefault();
            logger.event("keyboard shortcut: " + keyboardShortcut_1.ksToString(ka.shortcut));
            ka.action();
        }
    });
}
// END OF LISTENERS
// START OF HELPER FUNCTIONS
function timeLogger(logger, label) {
    return function (time) {
        logger.info(label + ": " + time);
    };
}
function handleError(err) {
    logger.error(err.message);
}
// END OF HELPER FUNCTIONS
// ALL CONSTANTS
var version = 'v0.0.2';
var production = location.hostname !== 'localhost';
console.log((production ? 'Production' : 'Development') + " build: " + version);
var logger = logger_1.getLogger(production);
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
    },
    {
        action: function () {
            return clipboard_1.pasteIntoHtml(pasteInputDiv)
                .then(function () { return logger.success('pasted clipboard text into div'); })["catch"](handleError);
        },
        shortcut: {
            keyCode: 86,
            ctrlKey: true
        }
    }
];

},{"./base/base":5,"./base/clipboard":6,"./base/highlight":7,"./base/keyboardShortcut":8,"./base/logger":9,"./formatters/formatJson":10,"fs":1}]},{},[11]);
