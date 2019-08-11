const resolve = require('path').resolve;
const exec = require('child_process').exec;

function execute(callback) {
  exec(`node ${resolve('./index.js')}`, callback);
}

module.exports = execute;
