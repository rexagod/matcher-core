const res = require("path").resolve;
const exec = require("child_process").exec;

const execute = new Promise(function(resolve, reject) {
    exec(`node ${res("./index.js")}`, function(err, out, code) {
      resolve(err ? err : out);
    });
});

module.exports = execute;
