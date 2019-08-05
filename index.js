const chromeLauncher = require('chrome-launcher');
const {Chromeless} = require('chromeless');
const liveServer = require('live-server');
const express = require('express');
const cors = require('cors');

const app = express();

const XY = global.XY;

app.use(cors());

app.get('/', function(req, res) {
  res.send(`{"X": "${XY[0]}", "Y": "${XY[1]}"}`); // append to "global" object
});

app.listen(9992);

liveServer.start({
  open: false,
});

async function deploy() {
  await chromeLauncher.launch({
    port: 9222,
    chromeFlags: ['--remote-debugging-port=9222', '--headless'],
  });
  const chromeless = new Chromeless({
    debug: true,
    launchChrome: false,
  });
  response = await chromeless
      .goto('http://localhost:8080/demo/index.html')
      .wait('h3')
      .wait(1000)
      .evaluate(function() {
        return document.querySelector('#res').textContent;
      });
  chromeless.end();
  liveServer.shutdown();
  return response;
}

module.exports = deploy().catch(function(e) {
  console.error(e);
});
