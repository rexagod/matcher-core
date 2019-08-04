const {Chromeless} = require('chromeless');
const liveServer = require('live-server');
const params = {
  port: 9090,
  host: '127.0.0.1',
  root: '.',
  open: false,
  mount: [['./node_modules', './node_modules']],
  logLevel: 0,
};

console.log('Getting results...');
liveServer.start(params);

async function deploy() {
  const chromeless = new Chromeless({
    debug: true,
    launchChrome: false,
  });
  response = await chromeless
      .goto('http://localhost:9090/demo/node.html')
      .wait(1000)
      .wait('h3')
      .evaluate(async function() {
        return await window.data; // try console?
      });
  chromeless.end();
  liveServer.shutdown();
  return response;
}

module.exports = deploy();
