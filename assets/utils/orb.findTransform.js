const jsfeat = require('../js/jsfeat.min.js');

function findTransform(matches, count, patternCorners, screenCorners, homo3x3, matchMask) {
  const mmKernel = new jsfeat.motion_model.homography2d();
  const numModelPoints = 4;
  const reprojThreshold = 3;
  const ransacParam = new jsfeat.ransacParamsT(numModelPoints,
      reprojThreshold, 0.5, 0.99);
  const patternXY = [];
  const screenXY = [];
  for (let i = 0; i < count; ++i) {
    const m = matches[i];
    const sKp = screenCorners[m.screenIdx];
    const pKp = patternCorners[m.patternLev][m.patternIdx];
    patternXY[i] = {
      'x': pKp.x,
      'y': pKp.y,
    };
    screenXY[i] = {
      'x': sKp.x,
      'y': sKp.y,
    };
  }
  let ok = false;
  ok = jsfeat.motion_estimator.ransac(ransacParam, mmKernel,
      patternXY, screenXY, count, homo3x3, matchMask, 1000);
  let goodCnt = 0;
  if (ok) {
    for (let i = 0; i < count; ++i) {
      if (matchMask.data[i]) {
        patternXY[goodCnt].x = patternXY[i].x;
        patternXY[goodCnt].y = patternXY[i].y;
        screenXY[goodCnt].x = screenXY[i].x;
        screenXY[goodCnt].y = screenXY[i].y;
        goodCnt++;
      }
    }
    mmKernel.run(patternXY, screenXY, homo3x3, goodCnt);
  } else {
    jsfeat.matmath.identity_3x3(homo3x3, 1.0);
  }
  return goodCnt;
}

exports.findTransform = findTransform;

