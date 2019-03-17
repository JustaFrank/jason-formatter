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
    base_1.promisify(function () {
        return formatJson_1.formatJson(pasteInputDiv.innerText, highlight_1.highlighter('token'), base_1.timer(timeLogger(logger, 'formatting time')));
    })
        .then(function (_a) {
        var formattedJson = _a[0];
        pasteInputDiv.innerHTML = formattedJson;
        logger.info('formatted json type: ' + typeof formattedJson);
        lineNumbersDiv.innerHTML = Array(formattedJson.split('\n').length)
            .fill(0)
            .map(function (_, idx) { return idx + 1; })
            .join('<br/>');
        pasteInputDiv.setAttribute('contenteditable', 'false');
    })
        .then(function () {
        logger.success('json formatted and rendered');
    })["catch"](handleError);
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
    base_1.promisify(function () { return (pasteInputDiv.innerHTML = ''); }, function () { return (lineNumbersDiv.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&gt;'); }, function () {
        pasteInputDiv.setAttribute('contenteditable', 'true');
    })
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
