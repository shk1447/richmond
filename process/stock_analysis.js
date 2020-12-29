

/*
1. max / min 가져오기
2. segmentation 실행
  - upward || downward
  - trend 분석을 통해 지지 또는 저항 포인트 구하기
3. 저항선, 지지선 만들기

*/

const path = require('path');
const fs = require('fs-path');
const cmd = require('commander');
const collector = require('./collector.js')

const moment = require('moment');
const {
    performance
  } = require('perf_hooks');

cmd.option('-c, --code [code]', 'set stock code', '')
  .option('-t, --stock_total [stock_total]', 'set stock total', '')
  .option('-n, --stock_name [stock_name]', 'set stock name', '')
  .parse(process.argv)

collector.getSise(cmd.code, 400).then((d) => {
  var result = {
    name:cmd.stock_name,
    total:cmd.stock_total,
    curr_trend:null,
    prev_point:[],
    curr_point:[]
  };
  //d = d.filter(function(d) { return d.date <= new Date('2020-09-10').getTime()});
  
  segmentation([...d], result);
  
  //console.log(result);
  if(result.curr_trend == 'upward' && result.curr_point.length > 0) {
    fs.writeFileSync(path.resolve(__dirname, './analysis/' +cmd.stock_name+'_' +cmd.code +'.json'), JSON.stringify(result,null,2))
  }
  //fs.writeFileSync(path.resolve(__dirname, './data/' +cmd.code +'.json'), JSON.stringify(save_data))
}).catch((err) => {
  //fs.writeFileSync(path.resolve(__dirname, './data/' +cmd.code +'_fail.json'), JSON.stringify(err))
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
    var _cnt = 0;
    var _volume = 0;
    data.forEach((d, i) => {
      var dynamic_x = d.date/1000000;
      var dynamic_y = d.close;
      var dynamic_degree = Math.atan2(Math.abs(dynamic_y - start_y), Math.abs(dynamic_x - start_x)) * 180 / Math.PI;
      _volume += d.volume;
      _cnt++;
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
      result.curr_point.push({avg_volume:_volume/_cnt, degree:min_degree, date:moment(data[min_idx].date).format('YYYY-MM-DD')})
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
    console.log(trend_type)
    switch(trend_type) {
      case 'upward' :
        if(result.curr_trend == 'downward') {
          result.prev_point = [...result.curr_point]
          result.curr_point = [];
        }
        trend_analysis(data.slice(min_idx,max_idx+1), result, trend_type);
        data.splice(0, max_idx);
        result.curr_trend = trend_type
        segmentation(data, result);
        break;
      case 'downward':
        if(result.curr_trend == 'upward') {
          result.prev_point = [...result.curr_point]
          result.curr_point = [];
        }
        trend_analysis(data.slice(max_idx,min_idx+1), result, trend_type);
        data.splice(0, min_idx);
        result.curr_trend = trend_type;
        segmentation(data, result)
        break;
    }
  }
}

