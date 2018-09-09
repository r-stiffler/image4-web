'use strict';

const path = require('path'),
    gifsicle = require('gifsicle'),
    util = require('util'),
    execFile = util.promisify(require('child_process').execFile);

let gifHandler = {

    /**
     * 
     * @param {!object} args parameter to use for compression
     * @param {string[]} args.files files to compress
     * @param {object} args.parameters parameters to apply for compression
     * @param {number} args.parameters.quality parameters to apply for compression
     * @param {number} args.parameters.colorCount parameters to apply for compression , between 16 and 64
     * @param {string} args.output output path
     * @returns {Promise} promise returned
    */
    compress: function (args) {
        return compressFiles(args);
    }
};

async function compressFiles(args) {
    for (let i = 0; i < args.files.length; i++) {

        let parameters = ['--optimize', args.parameters.quality, '--output', path.join(args.output, path.basename(args.files[i]))];

        if (typeof args.parameters.colorCount !== 'undefined' && args.parameters.colorCount) {
            parameters.push('--colors');
            parameters.push(args.parameters.colorCount);
        }

        parameters.push(args.files[i]);

        await execution(parameters);
    }
}

async function execution(_parameters) {
    await execFile(gifsicle, _parameters)
        .catch((e) => {
            if (e.stderr.indexOf('gifsicle.exe') !== -1) {
                //error rised but file still compressed properly => gifsicle issue, skipping
            } else {
                console.log('\n** Error rose:\t' + e.stderr);
            }
        });
}

module.exports = gifHandler;
