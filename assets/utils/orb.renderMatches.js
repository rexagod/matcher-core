async function renderMatches(args, ctx, matches, count, screenCorners, patternCorners, matchesArray, matchMask) {
  for (let i = 0; i < count; ++i) {
    const m = await matches[i];
    const sKp = await screenCorners[m.screenIdx];
    const pKp = await patternCorners[m.patternLev][m.patternIdx];
    const matchedPair = await {confidence: {c1: pKp.score, c2: sKp.score}, x1: pKp.x, y1: pKp.y, x2: sKp.x, y2: sKp.y, population: count};
    if (!args.browser) {
      console.log(`Pairs: ${await (JSON.stringify(matchedPair)).toString()}`);
    }
    if (matchesArray.indexOf(matchedPair) === -1 && matchesArray.length < count) {
      await matchesArray.push(matchedPair);
    }
  }
  return await matchesArray;
}

exports.renderMatches = renderMatches;
