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
