<template>
<div style="width:100%;height:100%;padding:.5em;">
  <v-chart v-if="init_options.series.length > 0" theme="dark" autoresize style="width:100%;height:100%;" ref="chart" :options="init_options"></v-chart>
</div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  components: {
    // 외부 컴포넌트 등록
  },
  methods: {
    notifications() {
      return []
    },
  },
  watch: {
    // 해당 view에서 사용되는 변수에 대한 event listen 등록
  },
  data () {
    // 해당 view에서 사용되는 변수 등록(<temaplte></template>연동)
    return {
      init_options: {
        backgroundColor:'transparent',
        title: {
            text: '',
            left: 'left',
            align: 'right'
        },
        grid: {
            top:80,
            bottom: 80,
            right:'5%'
        },
        toolbox: {
            feature: {
                myTool: {
                    show: true,
                    title: 'Save as Image',
                    icon: 'path://M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0',
                    onclick: function() {}
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
            }
        },
        dataZoom: [
            {
                show: true,
                realtime: true
            },
            {
                type: 'inside',
                realtime: true
            }
        ],
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                axisLine: {onZero: false},
                data: []
            }
        ],
        legend: {
            data: [],
        },
        yAxis: [],
        series: []
      },
    }
  },
  created() {
    // vue lifecycle01 : dom이 생성되기 전 instance 생성시 발생
    console.log('created')
  },
  mounted() {
    // vue lifecycle02 : dom객체가 browser에 생성시 발생
    var app = {
      config : {
        xAxisLeft: 'carbohydrate',
        yAxisTop: 'calcium',
        xAxisRight: 'potassium',
        yAxisBottom: 'fiber',
      }
    }

    var indices = {
        name: 0,
        group: 1,
        id: 16
    };
    var schema = [
        {name: 'name', index: 0},
        {name: 'group', index: 1},
        {name: 'protein', index: 2},
        {name: 'calcium', index: 3},
        {name: 'sodium', index: 4},
        {name: 'fiber', index: 5},
        {name: 'vitaminc', index: 6},
        {name: 'potassium', index: 7},
        {name: 'carbohydrate', index: 8},
        {name: 'sugars', index: 9},
        {name: 'fat', index: 10},
        {name: 'water', index: 11},
        {name: 'calories', index: 12},
        {name: 'saturated', index: 13},
        {name: 'monounsat', index: 14},
        {name: 'polyunsat', index: 15},
        {name: 'id', index: 16}
    ];

    var axisColors = {
        'xAxisLeft': '#2A8339',
        'xAxisRight': '#367DA6',
        'yAxisTop': '#A68B36',
        'yAxisBottom': '#BD5692'
    };
    var colorBySchema = {};

    var fieldIndices = schema.reduce(function (obj, item) {
        obj[item.name] = item.index;
        return obj;
    }, {});

    var groupCategories = [];
    var groupColors = [];
    var data;


    function normalizeData(originData) {
        var groupMap = {};
        originData.forEach(function (row) {
            var groupName = row[indices.group];
            if (!groupMap.hasOwnProperty(groupName)) {
                groupMap[groupName] = 1;
            }
        });

        originData.forEach(function (row) {
            row.forEach(function (item, index) {
                if (index !== indices.name
                    && index !== indices.group
                    && index !== indices.id
                ) {
                    // Convert null to zero, as all of them under unit "g".
                    row[index] = parseFloat(item) || 0;
                }
            });
        });

        for (var groupName in groupMap) {
            if (groupMap.hasOwnProperty(groupName)) {
                groupCategories.push(groupName);
            }
        }
        var hStep = Math.round(300 / (groupCategories.length - 1));
        for (var i = 0; i < groupCategories.length; i++) {
            groupColors.push(echarts.color.modifyHSL('#5A94DF', hStep * i));
        }

        return originData;
    }

    function makeAxis(dimIndex, id, name, nameLocation) {
        var axisColor = axisColors[id.split('-')[dimIndex]];
        colorBySchema[name] = axisColor;
        return {
            id: id,
            name: name,
            nameLocation: nameLocation,
            nameGap: nameLocation === 'middle' ? 30 : 10,
            gridId: id,
            splitLine: {show: false},
            axisLine: {
                lineStyle: {
                    color: axisColor
                }
            },
            axisLabel: {
                textStyle: {
                    color: axisColor
                }
            },
            axisTick: {
                lineStyle: {
                    color: axisColor
                }
            }
        };
    }

    function makeSeriesData(xLeftOrRight, yTopOrBottom) {
      return data.map(function (item, idx) {
        var schemaX = app.config[xLeftOrRight];
        var schemaY = app.config[yTopOrBottom];
        return [
            item[fieldIndices[schemaX]], // 0: xValue
            item[fieldIndices[schemaY]], // 1: yValue
            item[1],                     // 2: group
            item[0],                     // 3: name
            schemaX,                     // 4: schemaX
            schemaY,                     // 5: schemaY
            idx                          // 6
        ];
      });
    }

    function makeSeries(xLeftOrRight, yTopOrBottom) {
      var id = xLeftOrRight + '-' + yTopOrBottom;
      return {
        zlevel: 1,
        type: 'scatter',
        name: 'nutrients',
        xAxisId: id,
        yAxisId: id,
        symbolSize: 8,
        itemStyle: {
            emphasis: {
                color: '#fff'
            }
        },
        animationThreshold: 5000,
        progressiveThreshold: 5000,
        data: makeSeriesData(xLeftOrRight, yTopOrBottom)
      };
    }

    function makeDataZoom(opt) {
        return Object.assign({
            type: 'slider',
            filterMode: 'empty',
            realtime: false
        }, opt);
    }

    function tooltipFormatter(params) {
        // Remove duplicate by data name.
        var mapByDataName = {};
        var mapOnDim = {x: {}, y: {}, xy: {}};
        params.forEach(function (item) {
            var data = item.data;
            var dataName = data[3];
            var mapItem = mapByDataName[dataName] || (mapByDataName[dataName] = {});
            mapItem[data[4]] = data[0];
            mapItem[data[5]] = data[1];
            mapOnDim[item.axisDim][dataName] = mapItem;
        });
        Object.keys(mapByDataName).forEach(function (dataName) {
            if (mapOnDim.x[dataName] && mapOnDim.y[dataName]) {
                mapOnDim.xy[dataName] = mapByDataName[dataName];
                delete mapOnDim.x[dataName];
                delete mapOnDim.y[dataName];
            }
        });
        var resultHTML = [];
        [['xy', 'CROSS'], ['x', 'V LINE'], ['y', 'H LINE']].forEach(function (dimDefine) {
            var html = [];
            Object.keys(mapOnDim[dimDefine[0]]).forEach(function (dataName) {
                var mapItem = mapOnDim[dimDefine[0]][dataName];
                var valuesHTML = [];
                Object.keys(mapItem).forEach(function (dataName) {
                    valuesHTML.push(
                        '<span style="color:' + colorBySchema[dataName] + '">'
                            + dataName
                        + '</span>: ' + mapItem[dataName]
                    );
                });
                html.push('<div style="margin: 10px 0">' + dataName + '<br/>' + valuesHTML.join('<br/>') + '</div>');
            });
            html.length && resultHTML.push(
                '<div style="margin: 10px 0">'
                + '<div style="font-size: 16px; color: #aaa">POINTS ON ' + dimDefine[1] + '</div>'
                + html.join('')
                + '</div>'
            );
        });
        return resultHTML.join('');
    }

    function getOption(data) {
        var gridWidth = '35%';
        var gridHeight = '35%';
        var gridLeft = 80;
        var gridRight = 50;
        var gridTop = 50;
        var gridBottom = 80;

        return {
            tooltip: {
                trigger: 'none',
                padding: [10, 20, 10, 20],
                backgroundColor: 'rgba(0,0,0,0.7)',
                transitionDuration: 0,
                extraCssText: 'width: 300px; white-space: normal',
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                position: function (pos, params, el, elRect, size) {
                    var obj = {};
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 60;
                    obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 20;
                    return obj;
                },
                formatter: tooltipFormatter
            },
            axisPointer: {
                show: true,
                snap: true,
                lineStyle: {
                    type: 'dashed'
                },
                label: {
                    show: true,
                    margin: 6,
                    backgroundColor: '#556',
                    textStyle: {
                        color: '#fff'
                    }
                },
                link: [{
                    xAxisId: ['xAxisLeft-yAxisTop', 'xAxisLeft-yAxisBottom']
                }, {
                    xAxisId: ['xAxisRight-yAxisTop', 'xAxisRight-yAxisBottom']
                }, {
                    yAxisId: ['xAxisLeft-yAxisTop', 'xAxisRight-yAxisTop']
                }, {
                    yAxisId: ['xAxisLeft-yAxisBottom', 'xAxisRight-yAxisBottom']
                }]
            },
            xAxis: [
                makeAxis(0, 'xAxisLeft-yAxisTop', 'carbohydrate', 'middle'),
                makeAxis(0, 'xAxisLeft-yAxisBottom', 'carbohydrate', 'middle'),
                makeAxis(0, 'xAxisRight-yAxisTop', 'potassium', 'middle'),
                makeAxis(0, 'xAxisRight-yAxisBottom', 'potassium', 'middle')
            ],
            yAxis: [
                makeAxis(1, 'xAxisLeft-yAxisTop', 'calcium', 'end'),
                makeAxis(1, 'xAxisLeft-yAxisBottom', 'fiber', 'end'),
                makeAxis(1, 'xAxisRight-yAxisTop', 'calcium', 'end'),
                makeAxis(1, 'xAxisRight-yAxisBottom', 'fiber', 'end')
            ],
            grid: [{
                id: 'xAxisLeft-yAxisTop',
                left: gridLeft,
                top: gridTop,
                width: gridWidth,
                height: gridHeight
            }, {
                id: 'xAxisLeft-yAxisBottom',
                left: gridLeft,
                bottom: gridBottom,
                width: gridWidth,
                height: gridHeight
            }, {
                id: 'xAxisRight-yAxisTop',
                right: gridRight,
                top: gridTop,
                width: gridWidth,
                height: gridHeight
            }, {
                id: 'xAxisRight-yAxisBottom',
                right: gridRight,
                bottom: gridBottom,
                width: gridWidth,
                height: gridHeight
            }],
            dataZoom: [
                makeDataZoom({
                    width: gridWidth,
                    height: 20,
                    left: gridLeft,
                    bottom: 10,
                    xAxisIndex: [0, 1]
                }),
                makeDataZoom({
                    width: gridWidth,
                    height: 20,
                    right: gridRight,
                    bottom: 10,
                    xAxisIndex: [2, 3]
                }),
                makeDataZoom({
                    orient: 'vertical',
                    width: 20,
                    height: gridHeight,
                    left: 10,
                    top: gridTop,
                    yAxisIndex: [0, 2]
                }),
                makeDataZoom({
                    orient: 'vertical',
                    width: 20,
                    height: gridHeight,
                    left: 10,
                    bottom: gridBottom,
                    yAxisIndex: [1, 3]
                })
            ],
            visualMap: [{
                show: false,
                type: 'piecewise',
                categories: groupCategories,
                dimension: 2,
                inRange: {
                    color: groupColors //['#d94e5d','#eac736','#50a3ba']
                },
                outOfRange: {
                    color: ['#ccc'] //['#d94e5d','#eac736','#50a3ba']
                },
                top: 20,
                textStyle: {
                    color: '#fff'
                },
                realtime: false
            }],
            series: [
                makeSeries('xAxisLeft', 'yAxisTop'),
                makeSeries('xAxisLeft', 'yAxisBottom'),
                makeSeries('xAxisRight', 'yAxisTop'),
                makeSeries('xAxisRight', 'yAxisBottom')
            ],
            animationEasingUpdate: 'cubicInOut',
            animationDurationUpdate: 2000
        };
    }
    this.$common.utils.Http.get('./static/sample/nutrients.json').then(function(res) {
      data = normalizeData(res).slice(0, 500);
      this.init_options = getOption(data)
      this.init_options['backgroundColor'] = 'transparent';
    }.bind(this))
  },
  updated() {
    // vue lifecycle03 : data 변경으로 인해 dom update시 발생
  },
  destroyed() {
    // vue lifecycle04 : view destroy시 발생
    console.log('destroyed')
  }
}
</script>

<style scoped>

</style>
