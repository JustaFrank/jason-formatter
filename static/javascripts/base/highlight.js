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
