'use strict';

require('./prototypes');

const path = require('path'),
    mozjpeg = require('mozjpeg'),
    util = require('util'),
    execFile = util.promisify(require('child_process').execFile);

let jpgHandler = {

    /**
     * 
     * @param {!object} args parameter to use for compression
     * @param {string[]} args.files files to compress
     * @param {object} args.parameters parameters to apply for compression
     * @param {number} args.parameters.quality parameters to apply for compression
     * @param {boolean} args.parameters.grayscale parameters to apply for compression
     * @param {boolean} args.parameters.rgb parameters to apply for compression
     * @param {boolean} args.parameters.optimize parameters to apply for compression
     * @param {boolean} args.parameters.progressive parameters to apply for compression
     * @param {boolean} args.parameters.isTarga parameters to apply for compression
     * @param {string} args.output output path
     * @returns {Promise} promise returned
    */
    compress: function (args) {
        return compressFiles(args);
    }
};

async function compressFiles(args) {
    for (let i = 0; i < args.files.length; i++) {

        let parameters = ['-outfile', path.join(args.output, path.basename(args.files[i])), '-quality', args.parameters.quality];

        if (typeof args.parameters.grayscale !== 'undefined' && args.parameters.grayscale) {
            parameters.push('-grayscale');
        }

        if (typeof args.parameters.optimize !== 'undefined' && args.parameters.optimize) {
            parameters.push('-optimize');
        }

        if (typeof args.parameters.progressive !== 'undefined' && args.parameters.progressive) {
            parameters.push('-progressive');
        }

        if (typeof args.parameters.isTarga !== 'undefined' && args.parameters.isTarga) {
            parameters.push('-targa');
        }

        parameters.push(args.files[i]);

        await compressFile(parameters);
    }
}

async function compressFile(_parameters) {
    await execFile(mozjpeg, _parameters)
        .catch((err) => {
            console.log('\n** Error rose:\t' + err.stderr);
        });
}

module.exports = jpgHandler;
