'use strict';

/**
 * Replaces the format item in a specified string with the string representation
 * of a corresponding object in a specified array.
 * @param {string} arguments An object array that contains zero or more objects to format.
 * @returns {string}  A copy of format in which the format items have been replaced by the string representation of the corresponding objects in args.
 * @this {string}
 */
let format = function () {
    if (typeof arguments === 'undefined') {
        throw "Error - arguments must not be null";
    }

    let args = arguments;

    return this.replace(/{(\d+)}/g, function (match, number) {
        let index = parseInt(number, 0);
        return typeof args[index] !== 'undefined' ? args[index] : match;
    });
};


if (!String.prototype.format) {
    /**
    * @method
    * @name String#format
    * @param {string} arguments values to replace current pattern
    * @returns {string} return string pattern with specified values as parameters
    * @this {string}
    */
    String.prototype.format = format;
}