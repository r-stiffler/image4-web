'use strict';

const path = require('path'),
    fs = require('fs'),
    compressor = require('./lib');


const image4Web = {

    /**
     * 
     * @param {object} args arguments to compress files
     * @param {!string} args.input input path to get the files to be compressed, not null
     * @param {string} args.output output path to generate compressed files
     * @param {string[]} args.engines images engines to involve (default is jpg, svg, png, gif)
     * @param {object} args.parameters parameters for compression
     * @param {object} args.parameters.jpg parameters jpeg compression using mozjpeg
     * @param {number} args.parameters.jpg.quality Scale quantization tables to adjust image quality
     * @param {boolean} args.parameters.jpg.grayscale parameter to create monochrome JPEG file from color input.
     * @param {boolean} args.parameters.jpg.rgb parameter to create RGB JPEG file
     * @param {boolean} args.parameters.jpg.optimize parameter to perform optimization of entropy encoding parameters
     * @param {boolean} args.parameters.jpg.progressive parameter to create progressive JPEG file
     * @param {boolean} args.parameters.jpg.isTarga parameter to treat input file as Targa format
     * @param {object} args.parameters.png parameters png compression using pngquant
     * @param {number} args.parameters.png.quality parameter to apply png quality for compression
     * @param {object} args.parameters.gif parameters gif compression using gifsicle
     * @param {number} args.parameters.gif.quality parameter to apply gif quality for compression
     * @param {number} args.parameters.gif.colorCount parameter to change color count used within the gif (from 16 to 64)
     * @returns {Promise} Promise object represents the images compress action
    */
    compress: function (args) {

        //Validity checks for args
        //
        args = args || {};

        if (typeof args.input === 'undefined') {
            throw new Error('The input target has not been defined');
        }

        args.output = args.output || path.normalize(path.join(__dirname, 'output'));

        args.engines = args.engines || ['jpg', 'svg', 'png', 'gif'];

        args.parameters = args.parameters || {};

        //JPG parameters
        args.parameters.jpg = args.parameters.jpg || {
            quality: 75,
            grayscale: false,
            rgb: false,
            optimize: false,
            progressive: false,
            isTarga: false
        };

        args.parameters.jpg.quality = args.parameters.jpg.quality || 75;

        //PNG parameters
        args.parameters.png = args.parameters.png || {
            quality: 75
        };

        args.parameters.png.quality = args.parameters.png.quality || 75;


        //GIF parameters
        args.parameters.gif = args.parameters.gif || {
            quality: 75,
            colorCount: 64
        };

        args.parameters.gif.quality = args.parameters.gif.quality || 75;
        args.parameters.gif.colorCount = args.parameters.gif.colorCount || 64;
        args.parameters.gif.colorCount = args.parameters.gif.colorCount >= 64 ? 64
            : args.parameters.gif.colorCount <= 16 ? 16
                : args.parameters.gif.colorCount;

        return runCompressors(args);
    }
};

module.exports = image4Web;


/**
    * 
    * @param {any} _args arguments passed to compress images
    * @returns {Promise} promise returned
    */
function runCompressors(_args) {
    return (async (args) => {
        let run = addDirectoryContentToCompress(args.input);

        if (args.engines.indexOf('jpg') !== -1 && run.jpgs.length !== 0) {
            await compressor.jpgHandler.compress({
                files: run.jpgs,
                parameters: args.parameters.jpg,
                output: args.output
            });
        }
        if (args.engines.indexOf('svg') !== -1 && run.svgs.length !== 0) {
            await compressor.svgHandler.compress({
                files: run.svgs,
                parameters: args.parameters.svg,
                output: args.output
            });
        }
        if (args.engines.indexOf('png') !== -1 && run.pngs.length !== 0) {
            await compressor.pngHandler.compress({
                files: run.pngs,
                parameters: args.parameters.png,
                output: args.output
            });
        }
        if (args.engines.indexOf('gif') !== -1 && run.gifs.length !== 0) {
            await compressor.gifHandler.compress({
                files: run.gifs,
                parameters: args.parameters.gif,
                output: args.output
            });
        }
    })(_args);
}

/**
 * Scroll over dir path recursivelly to get all files to compile
 * @param {string} dir path to folder to scroll for files or subfolders
 * @return {object} run out result parameter, to store files absolute path
 * @return {string[]} run.gifs out result parameter, to store gif files absolute path
 * @return {string[]} run.jpgs out result parameter, to store jpeg files absolute path
 * @return {string[]} run.pngs out result parameter, to store png files absolute path
 * @return {string[]} run.svgs out result parameter, to store svg files absolute path
 */
function addDirectoryContentToCompress(dir) {
    let run = {
        jpgs: [],
        svgs: [],
        pngs: [],
        gifs: []
    };

    let sources = fs.readdirSync(dir);
    for (let i = 0; i < sources.length; i++) {
        if (fs.lstatSync(path.resolve(dir, sources[i])).isDirectory()) {
            let subFolderRun = addDirectoryContentToCompress(path.resolve(dir, sources[i]));
            run.gifs = run.gifs.concat(subFolderRun.gifs);
            run.jpgs = run.jpgs.concat(subFolderRun.jpgs);
            run.pngs = run.pngs.concat(subFolderRun.pngs);
            run.svgs = run.svgs.concat(subFolderRun.svgs);
        } else {
            let absolutePath = path.resolve(dir, sources[i]);
            let ext = path.extname(sources[i]).substring(1).toLowerCase(); // file ext without the dot in lower case
            switch (ext) {
                case "gif":
                    run.gifs.push(absolutePath);
                    break;
                case "jpeg":
                case "jpg":
                    run.jpgs.push(absolutePath);
                    break;
                case "png":
                    run.pngs.push(absolutePath);
                    break;
                case "svg":
                    run.svgs.push(absolutePath);
                    break;
                default:
            }
        }
    }

    return run;
}