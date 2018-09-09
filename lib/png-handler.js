'use strict';

require('./prototypes');

const path = require('path'),
    pngquant = require('pngquant-bin'),
    util = require('util'),
    execFile = util.promisify(require('child_process').execFile);

let pngHandler = {

    /**
     * 
     * @param {!object} args parameter to use for compression
     * @param {string[]} args.files files to compress
     * @param {object} args.parameters parameters to apply for compression
     * @param {number} args.parameters.quality parameters to apply for compression
     * @param {string} args.output output path
     * @returns {Promise} promise returned
    */
    compress: function (args) {
        return compressFiles(args);
    }
};

async function compressFiles(args) {
    for (let i = 0; i < args.files.length; i++) {

        let parameters = ['-o', path.join(args.output, path.basename(args.files[i])), '--quality', '0-{0}'.format(args.parameters.quality)];

        parameters.push(args.files[i]);

        await compressFile(parameters);
    }
}

async function compressFile(_parameters) {
    await execFile(pngquant, _parameters)
        .catch((err) => {
            console.log('\n** Error rose:\t' + err.stderr);
        });
}

module.exports = pngHandler;
