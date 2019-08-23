const promise = require('./runner');

function fetchPoints(results) { console.log(results.points); }

Promise.resolve(promise).then(fetchPoints);
