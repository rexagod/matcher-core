function renderMatches(args, ctx, matches, count, screenCorners, patternCorners, matchesArray, matchMask) {
  for (let i = 0; i < count; ++i) {
    const m = matches[i];
    const sKp = screenCorners[m.screenIdx];
    const pKp = patternCorners[m.patternLev][m.patternIdx];
    const matchedPair = {confidence: {c1: pKp.score, c2: sKp.score}, x1: pKp.x, y1: pKp.y, x2: sKp.x, y2: sKp.y, population: count};
    if (!args.browser) {
      console.log(`Pairs: ${(JSON.stringify(matchedPair)).toString()}`);
    }
    if (matchesArray.indexOf(matchedPair) === -1 && matchesArray.length < count) {
      matchesArray.push(matchedPair);
    }
  }
  return matchesArray;
}

exports.renderMatches = renderMatches;
