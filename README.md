# Image 4 Web

The purpose of this package is to provide a way to compress images for web usage.

## Features

Compress images with **`jpg`**, **`png`**, **`gif`**, **`svg`** format.

Use it as NPM package or by CLI.

## Prerequisites

* Software
	* [Node](https://nodejs.org/en/)
    * [NPM](https://www.npmjs.com/)

## Getting Started

```
npm install image4-web
```


## Code sample
### as library
```javascript
const image4Web = require('image4-web');

let params = {
    input: INPUT_PATH,
    output: OUTPUT_PATH,
    engines: ['jpg', 'svg', 'png', 'gif'],
    parameters: {
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
    }
};

(async () => {
    await image4Web.compress(params);
})();
```


### with CLI
```
> image4Web --help


image4web [INPUT_FOLDER] [-o OUTPUT_PATH] [-v]
|
|_ INPUT_FOLDER: input folder where to get files to compress
|_ OUTPUT_PATH: output path where to put compressed files
|_ -v: Verbose mode
```

```
> image4Web test/imgs -o output -v

=> 5 files compressed over 5
----------------------------------------------------------------------------------------------------
JCVDSPlit.jpg                   79.525ko        =>      49.448ko
Disabled-Meme.jpg               40.677ko        =>      15.746ko
Simple_Colors.gif               1005.767ko      =>      858.798ko
stop.png                        31.963ko        =>      7.726ko
Vector-based_example.svg        6.518ko         =>      4.647ko
```

## External tools

This aggregate software is using the following *npm* packages:

* [mozjpeg](https://github.com/mozilla/mozjpeg)
* [gifsicle](https://www.npmjs.com/package/gifsicle)
* [svgo](https://github.com/svg/svgo)
* [pngquant](https://pngquant.org/)


## Next to come

* technical docs
* new feature: images to webp
* more parameters for each engine

---

### ENJOY !
