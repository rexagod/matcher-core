var x = require('./runner')

x(function(err, out, code){
  console.log(out.trim());
});
