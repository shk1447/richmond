<template>
<div class="header-area">
  <div style="display: inline-flex; height: 100%">
    <div data-v-42c708e7="" class="v-image v-responsive theme--dark" style="height: 100%; width: 40px; margin-left: 1em; padding: 0.5em;"><div class="v-image__image v-image__image--contain custom-logo" ></div><div class="v-responsive__content"></div></div>
    <my-theme style="height: 100%; margin-left: 1em;">
      <hsc-menu-bar style="height: 100%; border-radius: 0 0 4pt 0">
        <hsc-menu-bar-item label="File" class="menu-item-wrapper">
          <hsc-menu-item label="Load" @click="onLoad"/>
          <hsc-menu-item label="Export" :disabled="!mrx_store.app.steps.includes('optimize')" @click="onExport"/>
          <hsc-menu-separator />
          <hsc-menu-item label="Clear" :disabled="!mrx_store.app.steps.length > 0" @click="onClear"/>
        </hsc-menu-bar-item>
        <hsc-menu-bar-item label="Help" class="menu-item-wrapper">
          <hsc-menu-item label="Welcome" />
          <hsc-menu-separator />
          <hsc-menu-item label="About" />
        </hsc-menu-bar-item>
      </hsc-menu-bar>
    </my-theme>
    
  </div>

  <v-spacer style="-webkit-app-region: drag; height:100%;" />
  
  <div class="action-item-wrapper" @click="minimize">
    <v-icon small >mdi-window-minimize</v-icon>
  </div>
  <div class="action-item-wrapper" @click="maximize">
    <v-icon small >mdi-window-maximize</v-icon>
  </div>
  <div class="action-item-wrapper" @click="exit">
    <v-icon small >mdi-window-close</v-icon>
  </div>
</div>
</template>

<script>
import { StyleFactory } from "@hscmap/vue-menu";
import XLSX from 'xlsx';

const active = {
  backgroundColor: "#436f7c",
};
const disabled = {
  opacity: "0.5",
};
const separator = {
  backgroundColor: "rgba(240, 240, 240, 0.25)",
  height:'1pt',
  margin:'0pt',
};
export default {
  components: {
    "my-theme": StyleFactory({
      menu: {
        background: "rgb(60,60,60)",
        color: "white",
        boxShadow: "0 2pt 4pt rgba(0, 0, 0, 0.5)",
        padding:"0px !important"
      },
      menubar: {
        height: "100%",
        background: "linear-gradient(to bottom, rgba(40,40,40,0), rgba(60,60,60,0))",
        color: "white",
        boxShadow: "0 4pt 4pt rgba(0, 0, 0, 0)",
      },
      active,
      disabled,
      separator,
      animation: false,
    }),
  },
  methods: {
    onExport() {
      window.saveFile(function(path){
        if(path) {
          window.socket.send(JSON.stringify({ uuid:this.$common.utils.uuid(), name:'export', params:{
            data_path:path
          }}))
          this.mrx_store.app.steps.push('export')
        }
      }.bind(this))
    },
    onLoad() {
      var importFile = document.getElementById('importFile');
      importFile.value = '';
      importFile.removeEventListener('change', this.onFileChange)
      importFile.addEventListener('change', this.onFileChange)
      importFile.click();
    },
    onFileChange(event) {
      var me = this;
      var file = event.target.files[0];
      var reader = new FileReader();
      var file_path = file.path;
      reader.onload = function(e) {
        try {
          var data = e.target.result;
          var workbook = XLSX.read(data, {type:'array', dateNF:'yyyy-mm-dd', cellDates: true})
          var input_data = {};
          var _date_01 = [];
          var _date_02 = [];
          var _date_03 = [];
          var count = 0;
          workbook.SheetNames.forEach(function(sheet_name, i) {
            if(sheet_name.includes('Volume') || sheet_name.includes('Price Index') || sheet_name.includes('Spot Strip')) {
              var json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name], {raw : false,rawNumbers:true,blankrows:false})
              input_data[sheet_name] = {
                headers:Object.keys(json_data[json_data.length - 1]).map(function(v,k) { return { text:v,value:v}}),
                items:json_data
              }
              
              json_data.forEach(function(d) {
                if(count == 0) {
                  _date_01.push(d.Date)
                } else if(count == 1) {
                  if(_date_01.includes(d.Date)) _date_02.push(d.Date)
                } else if(count == 2) {
                  if(_date_02.includes(d.Date)) _date_03.push(d.Date);
                }
              })
              count++;
            } else if(sheet_name.includes('Optimization Default')) {
              var json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name], {raw : false,rawNumbers:true,blankrows:false});
              if(json_data.length > 0) {
                me.mrx_store.app.setting_list = json_data.map(function(d) {
                  return {
                    name : d['이름'] ? d['이름'] : '이름 없음',
                    start : d['시작'],
                    end : d['종료'],
                    excludes : d['제외할 기간'].split(',').map(function(d) { return d.trim()}),
                    forecast_horizon : d['예측기간(월)'],
                    n_epoch : d['n_epoch']
                  }
                })
                me.mrx_store.app.default_setting.name = json_data[0]['이름'];
                me.mrx_store.app.default_setting.start = json_data[0]['시작'];
                me.mrx_store.app.default_setting.end = json_data[0]['종료'];
                me.mrx_store.app.default_setting.excludes = json_data[0]['제외할 기간'].split(',').map(function(d) { return d.trim()});
                me.mrx_store.app.default_setting.forecast_horizon = json_data[0]['예측기간(월)'];
                me.mrx_store.app.default_setting.n_epoch = json_data[0]['n_epoch'];
              }
            }
          })
          me.mrx_store.app.excludes = _date_03.map(function(d) { return { text:d, value:d }});
          me.mrx_store.app.file_info['input_data'] = input_data;
          console.log(file.path)
          window.socket.send(JSON.stringify({ name:'data_load', params:{ data_path:file_path } }))
          this.mrx_store.app.steps.push('data_load')
        } catch(err) {
          console.log(err);
        }
      }.bind(this)
      
      reader.readAsArrayBuffer(file);
    },
    onClear() {
      this.$common.store.setProperty('app.clear', true);
      this.mrx_store.app.steps = [];
      this.mrx_store.app.file_info['input_data'] = {};
    },
    minimize() {
      window.minimize()
    },
    maximize() {
      window.maximize()
    },
    exit() {
      window.exit()
    }
  },
  data() {
    return {
      predict:{}
    };
  },
  created() {

  },
  mounted() {

  },
  destroyed() {

  },
};
</script>

<style scoped>
.menu-item-wrapper {
  vertical-align: middle;
  padding: 0em 1em 0em 1em !important;
  cursor:pointer;
}
.action-item-wrapper {
  margin-left:.5em; width:4em; height:100%; display:flex; justify-content:center; align-items:center; cursor: pointer;
}

.action-item-wrapper:hover {
  background: rgba(0,0,0,0.2);
}
</style>
