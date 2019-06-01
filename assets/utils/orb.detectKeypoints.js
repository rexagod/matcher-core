const jsfeat = require('../js/jsfeat.min.js');
const {icAngle} = require('./orb.icAngle.js');

function detectKeypoints(img, corners, maxAllowed) {
  let count = jsfeat.yape06.detect(img, corners, 17);
  const uMax = new Int32Array([15, 15, 15, 15, 14, 14, 14, 13, 13, 12, 11, 10, 9, 8, 6, 3, 0]);

  if (count > maxAllowed) {
    jsfeat.math.qsort(corners, 0, count - 1, function(a, b) {
      return (b.score < a.score);
    });
    count = maxAllowed;
  }

  for (let i = 0; i < count; ++i) {
    corners[i].angle = icAngle(uMax, img, corners[i].x, corners[i].y);
  }

  return count;
}

exports.detectKeypoints = detectKeypoints;

