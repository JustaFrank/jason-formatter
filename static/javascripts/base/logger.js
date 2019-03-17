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
