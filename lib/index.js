const jpgHandler = require('./jpg-handler');
const pngHandler = require('./png-handler');
const gifHandler = require('./gif-handler');
const svgHandler = require('./svg-handler');

module.exports = {
    jpgHandler: jpgHandler,
    pngHandler: pngHandler,
    gifHandler: gifHandler,
    svgHandler: svgHandler
};
