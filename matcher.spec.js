var matcher = require('./runner')


function run(query) {
  return Promise.resolve(matcher).then(function(raw) {
    expect(eval(query)).not.toBeUndefined();
  });
}

// 'raw' being our resolved raw data (see above)
describe('matcher', function() {

  test('raw data fetched', function() {
    run('raw');
  });

  test('corners fetched', function() {
    run('JSON.parse(raw).points');
  });

  test('matches fetched', function() {
    run('JSON.parse(raw).matched_points');
  });

});
