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
