#!/usr/bin/env node
'use strict';
const spawn = require('child_process').spawn,
    path = require('path'),
    fs = require('fs'),
    image4web = require('./');

let input = process.argv.slice(2);
if (input.indexOf('--help') !== -1) {
    showHelp();
} else {
    let input_path = path.resolve(input[0]) || __dirname,
        output_path = path.join(__dirname, input.indexOf('-o') !== -1 ? input[input.indexOf('-o') + 1] : 'output');

    createFolderIfNotExists(output_path);

    (async () => {
        await image4web.compress({ input: input_path, output: output_path });
        showResult(input.indexOf('-v') !== -1, input_path, output_path);
    })();
}

function showResult(verbose, input_path, output_path) {
    let compressedFiles = fs.readdirSync(output_path),
        originalsFiles = fs.readdirSync(input_path);

    console.log('=> ' + compressedFiles.length + ' files compressed over ' + originalsFiles.length);
    if (verbose) {
        console.log(''.padEnd(100, '-'));
        resultFolder(input_path, output_path);
    }
}


function resultFiles(file, output) {
    //Is file output generated
    let outputFile = path.resolve(output, path.basename(file));
    if (fs.existsSync(outputFile)) {
        //Is compressed file size is lower than original file
        let statIn = fs.lstatSync(file);
        let statOut = fs.lstatSync(outputFile);
        console.log(path.basename(file).padEnd(30, ' ') + '\t' + (statIn.size / 1000 + 'ko').padEnd(10, ' ') + '\t=>\t' + statOut.size / 1000 + 'ko');
    }
}

function resultFolder(input, output) {
    let files = fs.readdirSync(input);
    for (let i = 0; i < files.length; i++) {
        let absolutePath = path.join(input, files[i]);
        if (fs.lstatSync(absolutePath).isDirectory()) {
            resultFolder(absolutePath, output);
        } else {
            resultFiles(absolutePath, output);
        }
    }
}

function showHelp() {
    console.log('\n\n========\tImage4Web CLI USAGE\t========\n');
    console.log('=> image4web [INPUT_FOLDER] [-o OUTPUT_PATH] [-v]\n|');
    console.log('|_ INPUT_FOLDER: input folder where to get files to compress');
    console.log('|_ OUTPUT_PATH: output path where to put compressed files');
    console.log('|_ -v: Verbose mode');
}

function createFolderIfNotExists(folderPath) {
    let _err;
    let folderPathSplit = folderPath.split('\\');
    let tempFolderPath = folderPathSplit[0];
    for (let i = 1; i < folderPathSplit.length; i++) {
        tempFolderPath = path.join(tempFolderPath, folderPathSplit[i]);
        if (!fs.existsSync(tempFolderPath)) {
            _err = fs.mkdirSync(tempFolderPath);
            if (_err) return _err;
        }
    }
    return _err;
}