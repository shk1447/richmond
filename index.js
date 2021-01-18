const path = require('path');
const runtime = require('./runtime');
const { Writable } = require('stream');
const child_process = require('child_process');

const collector = require('./process/collector.js');

const ProcessPool = require('./runtime/ProcessPool.js');

const db = require('./db')

db().then(function(d) {
    console.log(d);
});


var pool = new ProcessPool({processLimit:8});

collector.getStockList().then((d) => {
    d.forEach((item) => {
        const debugStream = new Writable({
            write(chunk, encoding, callback) {
                console.log(chunk.toString());
                callback();
            }
        });
        var process_args = ['./stock_analysis.js', '--code', item.stock_code, '--stock_total', item.stock_total, '--stock_name', item.stock_name];
        var process_opts = {cwd :path.resolve(__dirname, './process'), detached:true, stdio:'ignore'};
        pool.prepare(process_args, process_opts)
    })
})


// setInterval(function() {
//     console.log(pool.remain() + ' process');
// },1000)


