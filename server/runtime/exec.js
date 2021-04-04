const pidusage = require('pidusage')
const child_process = require('child_process')

var proc_list = [];
module.exports = {
    kill: function() {

    },
    run : function(command, args, options, read_stream, write_stream, err_stream) {
        return new Promise((resolve, reject) => {
            const child = child_process.spawn(command, args, options);
            if(write_stream) child.stdout.pipe(write_stream);
            if(err_stream) child.stderr.pipe(err_stream);
            

            if(read_stream) read_stream.pipe(child.stdin)

            function pipe_error () {
                console.log('child pipe bomb!!!')
                proc_list.splice(proc_list.indexOf(child.pid), 1)
                child.kill();
            }

            require('epipebomb')(child.stdin, pipe_error)

            require('epipebomb')(child.stdout, pipe_error)

            require('epipebomb')(child.stderr, pipe_error)

            proc_list.push(child.pid)

            child.on('exit', function(code) {
                proc_list.splice(proc_list.indexOf(child.pid), 1)
                resolve(code);
            }).on('error', function(err) {
                proc_list.splice(proc_list.indexOf(child.pid), 1)
                child.kill();
                reject(err)
            })
        })
    }
}
