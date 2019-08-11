const chromeLauncher = require('chrome-launcher');
const CRI = require('chrome-remote-interface');
const liveServer = require('live-server');
const ejs = require('ejs');
const fs = require('fs');

(async function () {
  await chromeLauncher.launch({
    port: 9222,
    chromeFlags: ['--remote-debugging-port=9222', '--headless'],
  });
})();

const XY = ['../assets/resources/small.jpg', '../assets/resources/big.jpg'];

liveServer.start({
  open: false,
  port: 9097
});


ejs.renderFile('./demo/template.html.ejs', {X:XY[0], Y:XY[1]}, function(err, str) {
  if(err) console.error(err);
  fs.writeFile('./demo/index.html', str, function(err){
    if(err) console.error(err);
  })
});

CRI((client) => {

  const {Page, Runtime} = client;

  Promise.all([
    Page.enable()
  ]).then(() => {
    return Page.navigate({url: 'http://localhost:9097/demo/index.html'});
  });

  Page.loadEventFired(() => {
      Runtime.evaluate({expression: 'document.getElementById("res").innerHTML'})
      .then((result) => {
        client.close();
        liveServer.shutdown();
        console.log(result.result.value);
        process.exit();
      });
  });

})
.on('error', (err) => {
  console.error('Cannot connect to browser:', err);
});
