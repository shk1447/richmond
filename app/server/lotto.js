const path = require('path');
const XLSX = require('xlsx');

var workbook = XLSX.readFileSync(path.resolve(__dirname, './excel.xlsx'));
workbook.SheetNames.forEach((sheet_name) => {
  var json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name], { raw: false, rawNumbers: true, blankrows: false })
  var histogram = new Array(45);
  var histogram_list = [];
  json_data.forEach(function (data, i) {
    var repeat = i % 15;
    if (repeat == 0) {
      histogram_list.push(histogram)
      histogram = new Array(45);
      histogram.fill(0);
    }
    Object.values(data).forEach(function (num) {
      histogram[num - 1]++;
    })
  })
  console.log(histogram_list)
})