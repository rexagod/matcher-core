var matcher = require('./runner')

describe('matcher', function() {

  var raw_data, corners_data, matches_data;

  matcher(async function(err, out, code) {
    raw_data = await out;
    corners_data = await JSON.parse(raw_data).points;
    matches_data = await JSON.parse(raw_data).matched_points;
  });

  test('instantiated raw data', function(done) {
    expect(raw_data).not.toBeNull();
    done();
  });

  test('detected corners', function(done) {
    expect(corners_data).not.toBeNull();
    done();
  });

  test('detected matches', function(done) {
    expect(matches_data).not.toBeNull();
    done();
  });
});
