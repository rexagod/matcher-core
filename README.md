# [`matcher-core`](/): ORB-focused pattern-miner for PublicLab

![LICENSE](https://img.shields.io/badge/license-GNU--General--Public--License--v3.0-green.svg)

## Description

`matcher-core` essentially employs the ORB[(Oriented FAST and Rotated BRIEF)](http://www.willowgarage.com/sites/default/files/orb_final.pdf) algorithm to mine patterns using the well-known [FAST(Features from Accelerated Segment Test)](http://homepages.inf.ed.ac.uk/rbf/CVonline/LOCAL_COPIES/AV1011/AV1FeaturefromAcceleratedSegmentTest.pdf) keypoint detector and the [BRIEF(Binary Robust Independent Elementary Features)](https://www.cs.ubc.ca/~lowe/525/papers/calonder_eccv10.pdf) descriptor technologies, which provide appreciable performance boosts on low computational costs. The main advantages, without going in too deep into details, of building this module around [ORB](http://www.willowgarage.com/sites/default/files/orb_final.pdf) were as follows.

- About 10^2 times faster than [SURF(Speeded-Up Robust Features)](https://www.vision.ee.ethz.ch/~surf/eccv06.pdf), a close alternative before [ORB](http://www.willowgarage.com/sites/default/files/orb_final.pdf) till 2011.
- Addition of a fast and accurate orientation component to [FAST](http://homepages.inf.ed.ac.uk/rbf/CVonline/LOCAL_COPIES/AV1011/AV1FeaturefromAcceleratedSegmentTest.pdf).
- Efficient in-built computational support for analysis of variance and correlation.
- Decorrelates [BRIEF](https://www.cs.ubc.ca/~lowe/525/papers/calonder_eccv10.pdf) features under rotational invariance, leading to better performance in nearest-neighbor applications.
- Unlike [SURF](https://www.vision.ee.ethz.ch/~surf/eccv06.pdf) and [SIFT(Scale-Invariant Feature Transform)](http://weitz.de/sift/), which are patented algorithms, [ORB](http://www.willowgarage.com/sites/default/files/orb_final.pdf) is free to use.

## Overview

The process of generating matches takes two phases; `finding` and `matching`. `finding`,
or identifying interest points in an image, is done using the [`findPoints`](/src/orb.core.js#L205) method. It passes a `cornersArray` to the global `utils` object's `points` object property, which can be stored for later use. `finding` will take a few hundred milliseconds for images of standard sizes (~720p).

Please note that the "global `utils` object" mentioned above is returned as a parameter to the callback function from where it can be accessed. See this example:

```js
  new Matcher('path/to/image1.png', 'path/to/image2.png',
    async function (r) { // r here is the passed utils object
      res = await r;
      console.log(res.points);
      console.log(res.matched_points);
    });
```
The output (`res.points`) is in the following format:
```
[{"x":37,"y":261},
 {"x":482,"y":402},
 {"x":84,"y":331}, ...]
```

`matching` is done with the [`findMatchedPoints`](/src/orb.core.js#L241) function, which passes a `matchesArray` to the global `utils` object's `matched_points` object property with the following format (`res.matched_points`):
```
[{"confidence":{"c1":63,"c2":187},"x1":359,"y1":48,"x2":65,"y2":309,"population":9},
 {"confidence":{"c1":124,"c2":169},"x1":260,"y1":333,"x2":546,"y2":295,"population":9}, ...]
```
It runs slower than the point `finding` step due to the added computational overhead of comparing both of the images for matches.

The [`findMatchedPoints`](/src/orb.core.js#L241) function depends upon the values served back into its lexical scope by the [`findPoints`](/src/orb.core.js#) function, which in turn depends upon the `params` argument (see below) supplied by the user, and is solely responsible for the generation of the [`cornersArray`](/src/orb.core.js#233), which is used to instantiate the [`matchesArray`](/src/orb.core.js#L269). The [`findMatchedPoints`](/src/orb.core.js#L241), is [called here](/src/orb.core.js#L302) and the appropriate values are set [in the cache](/src/orb.core.js#L316).

## Arguments

This library takes a set of different options whose expanded map is provided below. For more information about these options, checkout the `codeflow` section of this documentation below.
```
  new Matcher(<Image>, <Image>,
    <Object(callback)>, {
      query: <String>,
      caching: <Bool>,
      leniency: <Integer>,
      dimensions: <Object(array)>,
      params: {
        blur_size: <Integer>
        matchThreshold: <Integer>
        lap_thres: <Integer>,
        eigen_thres: <Integer>
      }
    });
```
All arguments other than the ones mentioned below (images and callback function) are required to be initialized.
- `query`: Set to 'corners' in order for the matcher to **only** run the `findPoints` method and output the detected points thus avoiding overhead of filtering the matched points (i.e., running the `findMatchedPoints` method) among them.
- `caching`: Enables cache mechanism for repetitive point detections. Defaults to `true`.
- `leniency`: Minimum threshold value for which a point qualifies as a "match". Defaults to `30`% (percentage).
- `dimensions`: Minimum [`pyrdown`ing](https://docs.opencv.org/2.4/doc/tutorials/imgproc/pyramids/pyramids.html) dimensions for image overlays supplied to matcher. Defaults to `[640, 480]`. For more details, [see here](https://github.com/publiclab/matcher-core/issues/2#issuecomment-513613350). **Also, if you aren't sure about this, we recommend you stick to the defaults.**
- `params`: Other parameters as indicated in the "codeflow" section of this README.

## Setup

### Node

* As done in [example.js]('/example.js'), in order to run this library and get results in a node environment, you need to resolve the promise sent back from the library.

```js
Promise.resolve(require('matcher-core')).then(fetchPoints);
```

* After that, just pass in your custom function (`fetchPoints`) inside the next thenable which will have a `results` object available inside its scope.

```js
function fetchPoints(results) { /* ... */ }
```

### Browser

* Include the browerified [`orb.core.com.js`](/orb.core.com.js) file inside your [`index.html`](/demo/index.html) using `<script>` tags.
```html
<script src="orb.core.com.js"></script>
```
* The matcher-core library's [entry point file](/src/orb.core.js) will return a promise back into the callback's scope.
```js

  new Matcher(
    // required fields
    'imageX.jpg',
    'imageY.jpg',
    async function (r) {
      res = await r;
      console.log(res);
    }, {
      // optional fields
      // 'corners' will only run `findPoints` and NOT `findMatchedPoints` thus
      // fetching only detected points and NOT the final filtered matches
      query: 'corners',
      caching: true,
      leniency: 30,
      dimensions: [640, 480],
      params: {
        blur_size: 5,
        matchThreshold: 30,
        lap_thres: 30,
        eigen_thres: 35
      }
    }
  );
```

### Extra

* `matcher-core`'s internal `orbify` will accept the following format of input parameters.

```js
const instance = new orbify(<Image>, <Image>, <Object>, <Object>);
                        /*  ImageX^  ImageY^  callback^   args^ */
```
* Similarly, `matcher-core`'s `orbify` will (collectively, i.e., when `query` is not `corners`) output the following data.

```js
/*
* returns a set of detected corners
* and the set of 'rich' matches that
* are evaluated from it
*/
> {points: Array(9), matched_points: Array(500)}
/* which are formatted as depicted below */
{
  "matches": [
    {
      "confidence": {
        "c1": 63,
        "c2": 187
      },
      "x1": 359,
      "y1": 48,
      "x2": 65,
      "y2": 309,
      "population": 9
		},
		...
	],
	"corners": [
    {
      "x": 37,
      "y": 261
		},
		...
	]
}
```
**Note:** The coordinates returned above are respective of the **image-pixel space**, hence are independent of their surrounding canvas spaces. In simpler terms, these coordinates actually represent the pixel numbers (*of images in their own x-y spaces*) on both axes in an image, wherever a point of interest is found.

## Demonstration

The live-demonstration of library can be found on the `gh-pages` branch deployed [here](https://publiclab.github.io/matcher-core/).

## Building from source

- Build using `npm run build`.
- Use the newly browserified and minified [`orb.com.min.js`](/orb.com.min.js) file as the entry point.

## Codeflow

Below is a summary of each component of the [`orbify`](/orb.core.com.js#L14) function, which is the at the core of this library and returns a promise, which should be kept in mind while extending the repository into one's own.

* [`canvas Mock`](/orb.core.com.js#L15-L28): Sets up two mock canvases for image comparison, which are never really appended to the DOM tree, along with some global variables.

* [`core IIFE`](/orb.core.com.js#L29-L191): Initializes `matchT` structure, `demoOpt` trainer, `demoApp` scraper, and the `tick` filters. These methods are detailed below.

* [`matchT structure`](/orb.core.com.js#L35-L55): An IIFE that initializes four basic parameters, namely, `screenIdx`, `patternLev`, `patternIdx`, and `distance` for the comparision structure. These are used later on in the `orbify` function to store the array of corners in the first image, number of discernable levels in the second image, array of corners in the second image, and the distance between the two indices, respectively. The default values for all of these, is set to 0.

* [`demoOpt trainer`](/orb.core.com.js#L57-L119): Initializes four adjustable filters namely, `blur_size`, `lap_thres`, `eigen_thres`, and `matchThreshold`, along with the `train_pattern` trainer function. The functions of these parameters *respectively* are as follows.

	* Adjusting the blur on images to incorporate more corners for better detection or reducing them to focus on the dominant matches only.
	* Defining the rate of change of intensity of the pixels for them to be perceived as "noisy".
	* Specifying how similar two pixels should be in order to be perceived as "lying in the same cluster".
	* Specifying matching standards (measure of depth that the match instensity should be in order for it to be a good match).

* [`demoApp scraper`](/orb.core.com.js#L121-L142): Initializes `blurred U8` matrices, descriptors for both of the images, and a homographic matrix for 2D distance conversions, along with the [corners and matches (set of matchT structs, not to be confused with matches global variable)](/orb.core.com.js#L139-L140) non-primitive structure arrays.

* [`tick filters`](/orb.core.com.js#L144-L176): Draws out the images (from the canvas data), applies a set of filters, and calculates the number of `goodMatches`, which will be exported out as matches array, and will consist of all the rich matches from both of the pixel arrays (images). The set of filters mentioned above are as follows.

	* [`grayscale`](/orb.core.com.js#L154): Reduces noise (outliers) by blurring the modified input `img_u8` via 8-bit conversions.
	* [`gaussian_blur`](/orb.core.com.js#L156):Converting every pixel to a 0 (black) or 1 (white) value for increased performace and evaluation processes.
	* [`laplacian_threshold`](/orb.core.com.js#L158): (as above) Defines the rate of change of intensity of the pixels that should be perceived as "noisy".
	* [`eigen_value_threshold`](/orb.core.com.js#L159): (as above) Specify how similar two pixels should be in order for them to be perceived as "lying in the same cluster".

All this being said, if you still have any questions regarding `matcher-core`'s implementations, feel free to [open an issue](/issues) clearly specifying your doubts, and pinging me ([@rexagod](https://github.com/rexagod)) in the issue discription.

## LICENSE

[GNU-General-Public-License-v3.0](/LICENSE)
