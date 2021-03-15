const fs = require('fs');
const path = require('path');
const fsPath = require('fs-path');
const cmd = require('commander');
const collector = require('./collector.js')

cmd.option('-c, --code [code]', 'set stock code', '')
  .option('-t, --stock_total [stock_total]', 'set stock total', '')
  .option('-n, --stock_name [stock_name]', 'set stock name', '')
  .parse(process.argv)

collector.getSise(cmd.code, 1).then((d) => {
  var collect_path = path.resolve(__dirname, './data/' +cmd.code +'.json');
  var exists = fs.existsSync(collect_path)
  if(exists) {
    var test = JSON.parse(fs.readFileSync(collect_path));
    d.forEach(function(a) {
      var aa = test.findIndex(function(k) {
        return a.date == k.date
      })
      if(aa >= 0) {
        test[aa] = a;
      } else {
        test.push(a);
      }
    })
    fsPath.writeFileSync(collect_path, JSON.stringify(test))
  } else {
    fsPath.writeFileSync(collect_path, JSON.stringify(d))
  }
}).catch((err) => {
  console.log(err)
  fsPath.writeFileSync(path.resolve(__dirname, './data/' +cmd.code +'_fail.json'), JSON.stringify(err))
})