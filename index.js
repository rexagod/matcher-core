const liveServer = require('live-server');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

let response = null;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.get('/', function(req, res) {
  res.send('{"X":"../assets/resources/small.jpg", "Y":"../assets/resources/big.jpg"}');
});

app.use(function(req, res, next) {
  response = req.body;
  console.log(response);
  next();
});

app.listen(9993);

const params = {
  port: 9991,
  host: '127.0.0.1',
  root: '.',
  open: false, // user's intervention
  mount: [['./node_modules', './node_modules']],
  logLevel: 2,
};
liveServer.start(params);

module.exports = response;
