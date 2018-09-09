'use strict';
const assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    image4Web = require('../index');

const OUTPUT_PATH = path.normalize(path.join(__dirname, 'output')),
    INPUT_PATH = path.normalize(path.join(__dirname, 'imgs')),
    TEST_ENGINES = ['jpg', 'png', 'gif', 'svg'],
    TEST_PARAMETERS = {
        jpg: {
            quality: 75,
            grayscale: false,
            rgb: false,
            optimize: false,
            progressive: false,
            isTarga: false
        },
        png: {
            quality: 75
        },
        gif: {
            quality: 50,
            colorCount: 32
        }
    };


describe('------\tImage4Web\t------\n----------------------------------------', function () {
    removeAllFileInOutput();
    for (let i = 0; i < TEST_ENGINES.length; i++) {
        describe('\n ======= Compress ' + TEST_ENGINES[i] + ' files =======\n', function () {
            it('Should generate new compressed ' + TEST_ENGINES[i] + ' file', async () => {
                let params = {
                    input: INPUT_PATH,
                    output: OUTPUT_PATH,
                    engines: [TEST_ENGINES[i]],
                    parameters: TEST_PARAMETERS
                };

                await image4Web.compress(params);
                checkFolder(TEST_ENGINES[i], INPUT_PATH);
            });
        });
    }
});

function checkFiles(engines, file) {
    let ext = path.extname(file).substring(1).toLowerCase(); // file ext without the dot in lower case
    if (engines.indexOf(ext) !== -1) {
        //Is file output generated
        let outputFile = path.resolve(OUTPUT_PATH, path.basename(file));
        assert.equal(fs.existsSync(outputFile), true);

        //Is compressed file size is lower than original file
        let statIn = fs.lstatSync(file);
        let statOut = fs.lstatSync(outputFile);
        assert.equal(statIn.size > statOut.size, true);
        console.log('\t' + path.basename(file) + '\t' + statIn.size/1000 + 'ko\t=>\t' + statOut.size/1000 + 'ko');
    }
}

function checkFolder(engines, folder) {
    let files = fs.readdirSync(folder);
    for (let i = 0; i < files.length; i++) {
        let absolutePath = path.join(folder, files[i]);
        if (fs.lstatSync(absolutePath).isDirectory()) {
            checkFolder(engines, absolutePath);
        } else {
            checkFiles(engines, absolutePath);
        }
    }
}

function removeAllFileInOutput() {
    let err;
    let files = fs.readdirSync(OUTPUT_PATH);
    for (let i = 0; i < files.length; i++) {
        err = fs.unlinkSync(path.join(OUTPUT_PATH, files[i]));
        if (err) {
            console.log(err);
        }
    }
}
