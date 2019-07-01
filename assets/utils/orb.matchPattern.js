const {popcnt32} = require('./orb.popcnt32.js');

function matchPattern(matches, screenDescriptors, patternDescriptors, numTrainLevels, options) {
  const qCnt = screenDescriptors.rows;
  const queryU32 = screenDescriptors.buffer.i32;
  let qdOff = 0;
  let qidx = 0;
  let lev = 0;
  let pidx = 0;
  let k = 0;
  let numMatches = 0;
  for (qidx = 0; qidx < qCnt; ++qidx) {
    let bestDist = 256;
    let bestDist2 = 256;
    let bestIdx = -1;
    let bestLev = -1;

    for (lev = 0; lev < numTrainLevels; ++lev) {
      const levDescriptors = patternDescriptors[lev];
      const ldCnt = levDescriptors.rows;
      const ldI32 = levDescriptors.buffer.i32;
      let ldOff = 0;

      for (pidx = 0; pidx < ldCnt; ++pidx) {
        let currD = 0;
        for (k = 0; k < 8; ++k) {
          currD += popcnt32(queryU32[qdOff + k] ^ ldI32[ldOff + k]);
        }

        if (currD < bestDist) {
          bestDist2 = bestDist;
          bestDist = currD;
          bestLev = lev;
          bestIdx = pidx;
        } else if (currD < bestDist2) {
          bestDist2 = currD;
        }

        ldOff += 8;
      }
    }
    if (bestDist < options.matchThreshold) {
      matches[numMatches].screenIdx = qidx;
      matches[numMatches].patternLev = bestLev;
      matches[numMatches].patternIdx = bestIdx;
      numMatches++;
    }
    qdOff += 8;
  }
  return numMatches;
}

exports.matchPattern = matchPattern;

