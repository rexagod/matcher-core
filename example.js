const promise = require('./runner');

function fetchPoints(results) { console.log(results); }

Promise.resolve(promise).then(fetchPoints);
