'use strict';
require('./prototypes');

const path = require('path'),
    util = require('util'),
    exec = util.promisify(require('child_process').exec);

let svgHandler = {
    /**
      * 
     * @param {!object} args parameter to use for compression
     * @param {string[]} args.files files to compress
     * @param {string} args.output output path
     * @returns {Promise} promise returned
     */
    compress: function (args) {
        return compressFiles(args);
    }
};

async function compressFiles(args) {
    for (let i = 0; i < args.files.length; i++) {

        let parameters = '--multipass -i "{0}" -o "{1}"'.format(
            args.files[i],
            path.join(args.output, path.basename(args.files[i]))
        );

        let cmd = 'node "{0}" {1}'.format(
            path.join(path.resolve('node_modules'), 'svgo', 'bin', 'svgo'),
            parameters
        );
        await compressFile(cmd);
    }
}

async function compressFile(_cmd) {
    await exec(_cmd, null)
        .catch((err) => {
            if (err.stderr) {
                console.log('\n** Error rose:\t' + err.stderr);
            } else {
                console.log('\n** Error rose:\t' + err);
            }
        });
}
module.exports = svgHandler;
