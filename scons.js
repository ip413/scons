"use strict"
var scons = new SignedConsole();
module.exports = scons;

// Signed console will trace time, function name and file name.
// Useful for faster debugging.
// Use it like standard console, for example:
// scons.log(), scons.log("value", value);
//
// scons.log("abc", {a: "a"}) will print
// -21:11:33.315------------------------------------/file.js:6:11  someFunction()
// abc
// { a: 'a' }

function SignedConsole() {
    "use strict"
    var self = this;

    function getPrefix() {
        var TEMP_SPACE_TAKER = 'XYZ';
        var dashes = '---';
        var prefixLine = '';
        var logLine = new Error().stack.split("\n")[4];
        var lineNumber = logLine.match(/(\d+:\d+)\)?$/);
        var filename = logLine.slice(logLine.lastIndexOf('/')).split(":")[0];
        lineNumber = lineNumber && lineNumber[1];
        var functionName = logLine.match(/at ([^\s]*?)\s*\(/);
        functionName = (functionName && functionName[1]) || '<no name>';
        functionName += '()';
        var date = new Date();
        var time = date.toTimeString().match(/[\d:]+/) + '.' + ((date.getMilliseconds()) / 1000).toFixed(3).slice(2);
        prefixLine = '-' + time + TEMP_SPACE_TAKER + filename + ':' + lineNumber + '  ' + functionName + '-';
        // Length of first line
        var finalLogLineLength = prefixLine.length;
        var REQUESTED_PREFIX_LENGTH = 80 + TEMP_SPACE_TAKER.length;
        if (finalLogLineLength < REQUESTED_PREFIX_LENGTH) {
            dashes = new Array(REQUESTED_PREFIX_LENGTH - finalLogLineLength).join("-");
        }
        return prefixLine.replace(TEMP_SPACE_TAKER, dashes);
    }

    function getFinalMessage() {
        var messageArray = [getPrefix(), '\r\n\t'];
        var oneLineLog = '';
        for (var i in arguments) {
            messageArray.push(arguments[i]);
            oneLineLog += arguments[i];
            if(i < arguments.length - 1){
                oneLineLog += ', ';
            }
            messageArray.push('\r\n\t');
        }
        messageArray.pop();
        return messageArray;
    }

    SignedConsole.prototype.log = function() {
        try {
            console.log.bind(console).apply(this, getFinalMessage.apply(this, arguments));
        } catch (error) {
            console.error(error);
        }
    }

    SignedConsole.prototype.warn = function() {
        console.warn(getFinalMessage.apply(this, arguments).join(""));
    }

    SignedConsole.prototype.error = function() {
        console.error(getFinalMessage.apply(this, arguments).join(""));
    }
}
