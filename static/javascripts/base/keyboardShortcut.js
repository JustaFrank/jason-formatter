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
