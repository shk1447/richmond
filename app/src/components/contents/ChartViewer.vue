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
