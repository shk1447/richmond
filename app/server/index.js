const cmd = require('commander');
cmd.option('-a, --script [script]', 'set script name', 'collect')
    .option('-d, --days [days]', 'set days', '0')
    .parse(process.argv)

const os = require('os');
const path = require('path');
const runtime = require('./runtime');
const { Writable } = require('stream');
const child_process = require('child_process');

const collector = require('./process/collector.js.js');

const ProcessPool = require('./runtime/ProcessPool.js');

const db = require('./db')

db().then(function (d) {
    console.log(d);
});

const cpus = os.cpus();

var pool = new ProcessPool({ processLimit: cpus.length });

collector.getStockList().then((d) => {
    d.forEach((item) => {
        var process_args = ['./stock_' + cmd.script + '.js', '--code', item.stock_code, '--stock_total', item.stock_total, '--stock_name', item.stock_name, '--days', cmd.days];
        var process_opts = { cwd: path.resolve(__dirname, './process'), detached: true, stdio: 'ignore' };
        pool.prepare(process_args, process_opts)
    })
})


// setInterval(function() {
//     console.log(pool.remain() + ' process');
// },1000)


