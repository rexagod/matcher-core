const res = require('../index');
async function run() {
  const r = await res;
  return r;
}
run().then(function(r) {
  console.log('response from "demo/example.js": ', r);
}).catch(function(e) {
  console.error(e);
});

