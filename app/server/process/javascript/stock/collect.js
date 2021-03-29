const fs = require('fs');
const path = require('path');
const fsPath = require('fs-path');
const cmd = require('commander');
const moment = require('moment');
const collector = require('./common/NaverFinance.js')

cmd.option('-c, --code [code]', 'set stock code', '')
  .option('-t, --stock_total [stock_total]', 'set stock total', '')
  .option('-n, --stock_name [stock_name]', 'set stock name', '')
  .option('-d, --days [days]', 'set days', '1')
  .parse(process.argv)

const days = parseInt(cmd.days);
collector.getSise(cmd.code, days).then((d) => {
  var collect_path = path.resolve(__dirname, './data/' + cmd.code + '.json');
  var exists = fs.existsSync(collect_path)
  if (exists) {
    var test = JSON.parse(fs.readFileSync(collect_path));
    d.forEach(function (a) {
      var aa = test.findIndex(function (k) {
        return a.date == k.date
      })
      if (aa >= 0) {
        test[aa] = a;
      } else {
        test.push(a);
      }
    })
    test.sort((a, b) => moment(a.date) - moment(b.date))
    fsPath.writeFileSync(collect_path, JSON.stringify(test))
  } else {
    fsPath.writeFileSync(collect_path, JSON.stringify(d))
  }
}).catch((err) => {
  console.log(err)
  fsPath.writeFileSync(path.resolve(__dirname, './data/' + cmd.code + '_fail.json'), JSON.stringify(err))
})