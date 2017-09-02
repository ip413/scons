"use strict"
/**
 *  Signed console will trace time, function name and file name.
 *  Useful for faster debugging.
 *  Use it like standard console, for example: scons.log().
 *  Right now supported methods: log, warn, error.
 *
 * @example
 * scons.log("abc", {a: "a"}) in function "someFunction()"
 * will print
 * -21:11:33.315------------------------------------/file.js:6:11  someFunction()-
 *         abc
 *         { a: 'a' }
 *
 */
var scons = new SignedConsole();
module.exports = scons;

function SignedConsole() {
    "use strict"
    var TEMP_SPACE_TAKER = 'XYZ',
        REQUESTED_PREFIX_LENGTH = 80;

    function _trimPrefixLine(prefixLine) {
        var finalLogLineLength = prefixLine.length;

        if (finalLogLineLength < REQUESTED_PREFIX_LENGTH) {
            var dashes = new Array(REQUESTED_PREFIX_LENGTH - finalLogLineLength).join("-");
        }
        return prefixLine.replace(TEMP_SPACE_TAKER, dashes);
    }

    function _getPrefixLine() {
        var prefixLine = '',
            logLine = new Error().stack.split("\n")[5],
            lineNumber = logLine.match(/(\d+:\d+)\)?$/),
            filename = logLine.slice(logLine.lastIndexOf('/')).split(":")[0],
            date = new Date(),
            functionName, date, time, finalLogLineLength, dashes;
        lineNumber = lineNumber && lineNumber[1];
        functionName = logLine.match(/at ([^\s]*?)\s*\(/);
        functionName = ((functionName && functionName[1]) || "<anonymous>" ) + '()';
        time = date.toTimeString().match(/[\d:]+/) + '.' + ((date.getMilliseconds()) / 1000).toFixed(3).slice(2);
        prefixLine = '-' + time + TEMP_SPACE_TAKER + filename + ':' + lineNumber + '  ' + functionName + '-';
        return _trimPrefixLine(prefixLine);
    }

    function _getFinalString() {
        var stringArray = [_getPrefixLine(), '\r\n\t'];
        for (var i in arguments) {
            stringArray.push(arguments[i]);
            stringArray.push('\r\n\t');
        }
        return stringArray;
    }

    function _applyConsoleFunction(functionName, _arguments) {
        try {
            // This construction allows to see constructor name of complex objects - or browse them in browsers.
            // (insead of seeing [object Object] in: console.log(_getFinalString.apply(this, _arguments).join(""));)
            console[functionName].bind(console).apply(this, _getFinalString.apply(this, _arguments));
        } catch (error) {
            console.error(error);
        }
    }

    SignedConsole.prototype.log = function() {
        return _applyConsoleFunction('log', arguments);
    }

    SignedConsole.prototype.warn = function() {
        return _applyConsoleFunction('warn', arguments);
    }

    SignedConsole.prototype.error = function() {
        return _applyConsoleFunction('error', arguments);
    }
}