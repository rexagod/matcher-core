async function renderCorners(args, cornersArray, corners, count) {
  for (let i = 0; i < count; ++i) {
    const x = await corners[i].x;
    const y = await corners[i].y;
    // GET CORNERS
    const cornersOut = {x: x, y: y};
    if (!args.browser) {
      console.log(`Corners: ${await (JSON.stringify(cornersOut)).toString()}`);
    }
    if (cornersArray.indexOf(cornersOut) === -1 && cornersArray.length < count) {
      await cornersArray.push(cornersOut);
    }
  }
  return await cornersArray;
}

exports.renderCorners = renderCorners;

