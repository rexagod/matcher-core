// bind image inputs for a global node reference
global.XY = ['../assets/resources/small.jpg', '../assets/resources/big.jpg'];

const res = require('../index');
async function run() {
  const r = await res;
  return r;
}
run().then(function(r) {
  console.log(r);
  process.exit();
}).catch(function(e) {
  console.error(e);
});
