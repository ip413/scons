"use strict"
/**
 *  Signed console will trace time, function name and file name.
 *  Useful for faster debugging.
 *  Use it like standard console, for example: scons.log().
 *  Right now supported methods: log, warn, error.
 *
 * @example
 * scons.log("abc", {a: "a"})
 * will print
 * -21:11:33.315------------------------------------/file.js:6:11  someFunction()
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
            logLine = new Error().stack.split("\n")[4],
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

    SignedConsole.prototype.log = function() {
        try {
            console.log.bind(console).apply(this, _getFinalString.apply(this, arguments));
        } catch (error) {
            console.error(error);
        }
    }

    SignedConsole.prototype.warn = function() {
        console.warn(_getFinalString.apply(this, arguments).join(""));
    }

    SignedConsole.prototype.error = function() {
        console.error(_getFinalString.apply(this, arguments).join(""));
    }
}

/* TESTS */
/*
scons.log();
scons.log("data");
(function xxx() {
    scons.log("data", {"e": 34}, [3, 5, 8])
})();
*/