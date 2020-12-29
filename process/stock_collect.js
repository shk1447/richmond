const path = require('path');
const fs = require('fs-path');
const cmd = require('commander');
const collector = require('./collector.js')

// const moment = require('moment');
// const {
//     performance
//   } = require('perf_hooks');

cmd.option('-c, --code [code]', 'set stock code', '')
  .option('-t, --stock_total [stock_total]', 'set stock total', '')
  .option('-n, --stock_name [stock_name]', 'set stock name', '')
  .parse(process.argv)

collector.getSise(cmd.code, 400).then((d) => {
  // var result = {
  //   upward:[],
  //   downward:[]
  // };
  var result = [];
  segmentation([...d], result);
  var save_data = {
    meta: {
      code:cmd.code,
      stock_name:cmd.stock_name,
      stock_total:cmd.stock_total
    },
    data : d,
    result : result
  }
  fs.writeFileSync(path.resolve(__dirname, './data/' +cmd.code +'.json'), JSON.stringify(save_data))
}).catch((err) => {
  fs.writeFileSync(path.resolve(__dirname, './data/' +cmd.code +'_fail.json'), JSON.stringify(err))
})

function trend_analysis(data, result, trend_type) {
  if(data.length > 1) {
    var start_x = data[0].date/1000000;
    var start_y = data[0].close;
    var end_x = data[data.length-1].date/1000000;
    var end_y = data[data.length-1].close;
    var std_degree = Math.atan2(Math.abs(end_y - start_y), Math.abs(end_x - start_x)) * 180 / Math.PI;
    
    var min_idx = null;
    var min_degree = 0;
    data.forEach((d, i) => {
      var dynamic_x = d.date/1000000;
      var dynamic_y = d.close;
      var dynamic_degree = Math.atan2(Math.abs(dynamic_y - start_y), Math.abs(dynamic_x - start_x)) * 180 / Math.PI;
      
      if(std_degree > dynamic_degree && dynamic_degree != 0) {
        if(min_degree > 0) {
          if(dynamic_degree < min_degree) {
            min_degree = dynamic_degree
            min_idx = i;
          }
        } else {
          min_degree = dynamic_degree
          min_idx = i;
        }
      }
    })
    
    if(min_idx) {
      // console.log(min_degree, moment(data[min_idx].date).format('YYYY-MM-DD'))
      result.push({degree:min_degree, date:data[min_idx].date, trend_type:trend_type})
      trend_analysis(data.slice(min_idx, data.length), result, trend_type)
    }
  }
}

function segmentation(data, result) {
  if(data.length > 1) {
    const max = data.reduce(function(prev, curr) {
      return (prev.close > curr.close) ? prev : curr
    })

    const min = data.reduce(function(prev, curr) {
      return (prev.close < curr.close) ? prev : curr
    })

    const trend_type = max.date > min.date ? 'upward' : 'downward';
    var min_idx = data.indexOf(min);
    var max_idx = data.indexOf(max);
    
    switch(trend_type) {
      case 'upward' :
        // if(result['downward'].length > 0) console.log('up test',result['downward'][result['downward'].length-1])
        trend_analysis(data.slice(min_idx,max_idx+1), result, trend_type)
        data.splice(0, max_idx)
        segmentation(data, result)
        break;
      case 'downward':
        // if(result['upward'].length > 0) console.log('down test', result['upward'][result['upward'].length-1])
        trend_analysis(data.slice(max_idx,min_idx+1), result, trend_type)
        data.splice(0, min_idx)
        segmentation(data, result)
        break;
    }
  }
}

