var matcher = require('./runner')

function callback(err, out, code){
  console.log(out);
}

matcher(callback);
