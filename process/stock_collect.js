const path = require('path');
const fs = require('fs-path');
const cmd = require('commander');
const collector = require('./collector.js')

cmd.option('-c, --code [code]', 'set stock code', '')
  .option('-t, --stock_total [stock_total]', 'set stock total', '')
  .option('-n, --stock_name [stock_name]', 'set stock name', '')
  .parse(process.argv)

collector.getSise(cmd.code, 400).then((d) => {
  fs.writeFileSync(path.resolve(__dirname, './data/' +cmd.code +'.json'), JSON.stringify(d))
}).catch((err) => {
  fs.writeFileSync(path.resolve(__dirname, './data/' +cmd.code +'_fail.json'), JSON.stringify(err))
})