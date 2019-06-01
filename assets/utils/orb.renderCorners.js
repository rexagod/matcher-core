function renderCorners(args, cornersArray, corners, count) {
  for (let i = 0; i < count; ++i) {
    const x = corners[i].x;
    const y = corners[i].y;
    // GET CORNERS
    const cornersOut = {x: x, y: y};
    if (!args.browser) {
      console.log(`Corners: ${(JSON.stringify(cornersOut)).toString()}`);
    }
    if (cornersArray.indexOf(cornersOut) === -1 && cornersArray.length < count) {
      cornersArray.push(cornersOut);
    }
  }
  return cornersArray;
}

exports.renderCorners = renderCorners;

