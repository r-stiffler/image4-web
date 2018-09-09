'use strict';

/**
 * @param {object} _default default value to return if array length is null
 * @returns {object} return last element of current array
 * @this {Array}
 */
function lastOrDefault(_default) {
    if (this.length !== 0) {
        return this[this.length - 1];
    }
    return _default || null;
}


if (!Array.prototype.lastOrDefault) {
    /**
    * @method
    * @name Array#lastOrDefault
    * @param {object} _default default value to return if array length is null
    * @returns {object} return last element of current array
    * @this {Array}
    */
    Array.prototype.lastOrDefault = lastOrDefault;
}