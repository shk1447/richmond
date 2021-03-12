const { Writable } = require('stream');
const child_process = require('child_process')

module.exports = function(options) {
  var pool = [];
  var procs = [];
  this.processLimit = options.processLimit;

  this.prepare = function(process_args, process_opts) {
    procs.push({
      process_args : process_args,
      process_opts : process_opts
    })
  }
  
  setInterval(function() {
    if(pool.length < this.processLimit && procs.length > 0) {
      var proc = procs.shift();
      const child = child_process.spawn('node', proc.process_args, proc.process_opts)
      child.unref();
      pool.push(child);
      child['process_opts'] = proc.process_opts;
      child.on('exit', function(code) {
          pool.splice(pool.indexOf(child), 1);
          child.kill();
      })
      console.log('remain process : ', procs.length);
    }

    if(procs.length == 0 && pool.length > 0) {
      while(pool.length) {
        var proc = pool.pop();
        proc.kill();
        this.prepare(proc.spawnargs, proc.process_opts);
      }
      
      console.log('remain...pool : ',pool.length)
    }
  }.bind(this),0)
}