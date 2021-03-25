<template>
<div style="width:100%;height:100%;padding:1em;z-index:99999">
  <v-chart v-if="init_options.series.length > 0" theme="dark" autoresize style="width:100%;height:100%;z-index:9999;" ref="chart" :options="init_options"></v-chart>
</div>
</template>

<script>

export default {
  props:['title', 'params', 'subtitle'],
  components: {
    // 외부 컴포넌트 등록
  },
  methods: {
    notifications() {
      return []
    },
    onRender(data) {
      console.log(data);
      Object.keys()
    },
    toggleData() {
      this.data_toggle = !this.data_toggle;
      if(this.data_toggle) {
        this.init_options.series.forEach(function(d, i) {
          d['label'] = {
            normal: {
              show: true,
              position: i % 2 == 0 ?'top' : 'bottom',
              formatter:function(params) {
                return Math.floor(params.value * 100) /100;
              }
            }
          }
        })
      } else {
        this.init_options.series.forEach(function(d) {
          delete d.label;
        })
      }
      this.$refs.chart.refresh()
    }
  },
  watch: {
    // 해당 view에서 사용되는 변수에 대한 event listen 등록
    'params': function(new_val, old_val) {

    }
  },
  data () {
    // 해당 view에서 사용되는 변수 등록(<temaplte></template>연동)
    return {
      data_toggle:true,
      origin_data:{},
      init_options:{
        title: {
          text:'',
          subtext:'',
          left: 'center'
        },
        backgroundColor:'transparent',
        legend:{
          data:[],
          left: 10
        },
        grid: {
          top: 80,
          bottom: 60,
          left:'5%',
          right: "5%"
        },
        toolbox: {
          feature: {
            myTool: {
              show:true,
              title:'Visible/Hide Toggle',
              icon: 'path://M23.5,17L18.5,22L15,18.5L16.5,17L18.5,19L22,15.5L23.5,17M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.75,12.65 22.44,13.26 22.08,13.85C21.5,13.5 20.86,13.25 20.18,13.12L20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12C4.83,15.36 8.24,17.5 12,17.5L13.21,17.43C13.07,17.93 13,18.46 13,19V19.46L12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5Z',
              onclick: this.toggleData
            }
          }
        },
        tooltip: {
          trigger:'axis'
        },
        dataZoom: [
          {
            type: "inside",
            realtime: true,
          },
        ],
        yAxis: {
          type: 'value'
        },
        xAxis:{},
        series:[]
      }
    }
  },
  created() {
    // vue lifecycle01 : dom이 생성되기 전 instance 생성시 발생
    console.log('created')
  },
  mounted() {
    // vue lifecycle02 : dom객체가 browser에 생성시 발생
    console.log('mounted')
    //window.onIPC(this.onRenderData);
    console.log(this.params);
    this.init_options.title.text = this.title;
    this.init_options.title.subtext = this.subtitle.replace(/\,/g,' > ');
    delete this.params.title;
    this.init_options.legend.data = Object.keys(this.params).filter(function(d) { return !this.params[d].xAxis }.bind(this) );
    
    var xAxisKey = Object.keys(this.params).find(function(d) { return this.params[d].xAxis }.bind(this) )
    if(xAxisKey) this.init_options.xAxis.data = this.params[xAxisKey].data;
    var gap_series = {
      name: 'Gap',
      data: [],
      type: 'bar',
      animation: false,
      sampling: 'average',
      smooth: true,
      large: true,
      connectNulls:true,
      symbolSize: 6,
      areaStyle: {},
      label: {
        normal: {
          show: true,
          position: 'top',
          formatter:function(params) {
            return Math.floor(params.value * 100) /100;
          }
        }
      },
    }
    this.init_options.legend.data.forEach(function(name, i) {
      var series = {
        name: name,
        data: [],
        type: 'line',
        animation: false,
        sampling: 'average',
        smooth: true,
        large: true,
        connectNulls:true,
        symbolSize: 6,
        areaStyle: {},
        label: {
          normal: {
            show: true,
            position: i == 0 ?'top' : 'bottom',
            formatter:function(params) {
              return Math.floor(params.value * 100) /100;
            }
          }
        },
      };
      series.data = this.params[name].data;
      this.init_options.series.push(series);
    }.bind(this))
    const subtractArr = function(arr1, arr2) {
      return arr1.map(function(d,i) {
        if(!d) {
          return null;
        }
        return d - arr2[i]
      })
    }
    var gap_data = subtractArr(this.init_options.series[0].data, this.init_options.series[1].data);
    gap_series.data = gap_data;
    this.init_options.series.push(gap_series);
    this.init_options.legend.data.push('Gap')
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
