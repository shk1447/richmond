

/*
1. max / min 가져오기
2. segmentation 실행
  - upward || downward
  - trend 분석을 통해 지지 또는 저항 포인트 구하기
3. 저항선, 지지선 만들기

*/
const fs = require('fs');
const path = require('path');

const fsPath = require('fs-path');
const cmd = require('commander');

const moment = require('moment');
const {
    performance
  } = require('perf_hooks');

cmd.option('-c, --code [code]', 'set stock code', '')
  .option('-t, --stock_total [stock_total]', 'set stock total', '')
  .option('-n, --stock_name [stock_name]', 'set stock name', '')
  .parse(process.argv)

var t0 = performance.now()
var d = JSON.parse(fs.readFileSync(path.resolve(__dirname, './data/' + cmd.code +'.json')));

var trend_result = {
  upward:[],
  downward:[]
}

var up_cnt = 0;
var up_avg_volume = 0;
var up_avg_degree = 0;
var down_cnt = 0;
var down_avg_volume = 0;
var down_avg_degree = 0;

var prev_price = 0;
var curr_price = d[d.length-1].close;

for(var i = 15; i >= 8; i--) {
  var date = moment();
  var result = {
    name:cmd.stock_name,
    total:cmd.stock_total,
    curr_trend:null,
    prev_point:[],
    curr_point:[]
  };
  var test = date.add('days', -i);
  if(test.day() == 6 || test.day() == 0) {
    continue;
  }
  console.log(test);
  var valid_arr = [...d.filter(function(d) { return d.date <= (test.unix()*1000)})];
  segmentation(valid_arr, result);
  prev_price = valid_arr[valid_arr.length - 1].close

  result.curr_point.forEach(function(d) {
    if(result.curr_trend == 'downward') {
      var point_idx = trend_result.downward.findIndex(function(k) { return k.date == d.date});
      if(point_idx >= 0) {
        trend_result.downward[point_idx].avg_volume = (trend_result.downward[point_idx].avg_volume + d.avg_volume) /2
        trend_result.downward[point_idx].degree = (trend_result.downward[point_idx].degree + d.degree) /2
      } else {
        trend_result.downward.push(d)
      }
      down_avg_volume += d.avg_volume;
      down_avg_degree += d.degree;
      down_cnt++;
    } else {
      var point_idx = trend_result.upward.findIndex(function(k) { return k.date == d.date});
      if(point_idx >= 0) {
        trend_result.upward[point_idx].avg_volume = (trend_result.upward[point_idx].avg_volume + d.avg_volume) /2
        trend_result.upward[point_idx].degree = (trend_result.upward[point_idx].degree + d.degree) /2
      } else {
        trend_result.upward.push(d)
      }
      up_avg_volume += d.avg_volume;
      up_avg_degree += d.degree;
      up_cnt++;
    }
  })

  result.prev_point.forEach(function(d) {
    if(result.curr_trend == 'upward') {
      var point_idx = trend_result.downward.findIndex(function(k) { return k.date == d.date});
      if(point_idx >= 0) {
        trend_result.downward[point_idx].avg_volume = (trend_result.downward[point_idx].avg_volume + d.avg_volume) /2
        trend_result.downward[point_idx].degree = (trend_result.downward[point_idx].degree + d.degree) /2
      } else {
        trend_result.downward.push(d)
      }
      down_avg_volume += d.avg_volume;
      down_avg_degree += d.degree;
      down_cnt++;
    } else {
      var point_idx = trend_result.upward.findIndex(function(k) { return k.date == d.date});
      if(point_idx >= 0) {
        trend_result.upward[point_idx].avg_volume = (trend_result.upward[point_idx].avg_volume + d.avg_volume) /2
        trend_result.upward[point_idx].degree = (trend_result.upward[point_idx].degree + d.degree) /2
      } else {
        trend_result.upward.push(d)
      }
      up_avg_volume += d.avg_volume;
      up_avg_degree += d.degree;
      up_cnt++;
    }
  })
}
up_avg_volume = up_avg_volume / up_cnt;
up_avg_degree = up_avg_degree / up_cnt;
down_avg_volume = down_avg_volume / down_cnt;
down_avg_degree = down_avg_degree / down_cnt;

trend_result.upward.sort((a,b) => moment(a.date)-moment(b.date));
trend_result.downward.sort((a,b) => moment(a.date)-moment(b.date));

if(up_avg_volume > down_avg_volume) {
  if(trend_result.upward.length > 0 && trend_result.downward.length > 0) {
    if(trend_result.upward[trend_result.upward.length - 1].degree > trend_result.downward[trend_result.downward.length - 1].degree) {
      if(trend_result.upward[trend_result.upward.length - 1].avg_volume > trend_result.downward[trend_result.downward.length - 1].avg_volume) {
        if(curr_price > prev_price) {
          fsPath.writeFileSync(path.resolve(__dirname, './analysis_success/' +cmd.stock_name+'_' +cmd.code +'.json'), JSON.stringify(trend_result,null,2))
        } else {
          fsPath.writeFileSync(path.resolve(__dirname, './analysis_fail/' +cmd.stock_name+'_' +cmd.code +'.json'), JSON.stringify(trend_result,null,2))
        }
      }
    }
  }
}

// console.log(trend_result)

// console.log('up summary : ', up_avg_volume, up_avg_degree)
// console.log('down summary : ', down_avg_volume, down_avg_degree)
// if(trend_result.upward.length >= trend_result.downward.length) {
//   fsPath.writeFileSync(path.resolve(__dirname, './analysis/' +cmd.stock_name+'_' +cmd.code +'.json'), JSON.stringify(trend_result,null,2))
// }
/*
var result = {
  name:cmd.stock_name,
  total:cmd.stock_total,
  curr_trend:null,
  prev_point:[],
  curr_point:[]
};
segmentation([...d.filter(function(d) { return d.date <= (moment().add('days', '-4').unix()*1000)})], result);

if(result.curr_trend == 'upward') {
  var curr_avg_volume = 0;
  var curr_avg_degree = 0;
  var prev_avg_volume = 0;
  var prev_avg_degree = 0;

  result.curr_point.forEach(function(d) {
    curr_avg_volume += d.avg_volume;
    curr_avg_degree += d.degree;
  })
  curr_avg_volume = curr_avg_volume / result.curr_point.length;
  curr_avg_degree = curr_avg_degree / result.curr_point.length;

  result.prev_point.forEach(function(d) {
    prev_avg_volume += d.avg_volume;
    prev_avg_degree += d.degree;
  })
  prev_avg_volume = prev_avg_volume / result.prev_point.length;
  prev_avg_degree = prev_avg_degree / result.prev_point.length;

  result['curr_avg_volume'] = curr_avg_volume;
  result['curr_avg_degree'] = curr_avg_degree;
  result['prev_avg_volume'] = prev_avg_volume;
  result['prev_avg_degree'] = prev_avg_degree;
  if(isNaN(curr_avg_volume) && isNaN(prev_avg_volume)) {
    fsPath.writeFileSync(path.resolve(__dirname, './analysis/' +cmd.stock_name+'_' +cmd.code +'.json'), JSON.stringify(result,null,2))
  }
}
*/

var t1 = performance.now();

console.log(t1 - t0);


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

