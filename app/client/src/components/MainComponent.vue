<template>
  <div style="width: 100%; height: 100%">
    <v-app id="app-main">
      <!-- Header Area -->
      <menu-bar :style="progress.current < progress.total ? 'pointer-events:none; opacity:.5;' : ''"></menu-bar>
      
      <v-tooltip bottom v-if="progress.current < progress.total">
        <template v-slot:activator="{ on }">
          <v-progress-linear
            v-on="on"
            :active="progress.current < progress.total"
            :value="(progress.current / progress.total) * 100"
            bottom
            color="deep-purple accent-4"
          ></v-progress-linear>
        </template>
        <span>{{ (progress.current / progress.total) * 100 }} %</span>
      </v-tooltip>

      <!-- Body Area -->
      <div class="body-area">
        <!-- Content Area -->
        <v-content id="bottom_content">
          <golden-layout class="hscreen" :showPopoutIcon="false">
            <gl-col>
              <gl-dstack>
                <gl-component :closable="false" :reorderEnabled="false" title="Visualize 01">
                  <data-viewer />
                </gl-component>
              </gl-dstack>
              <gl-dstack>
                <gl-component :closable="false" :reorderEnabled="false" title="Configure 01">
                  <predict-setting-dialog></predict-setting-dialog>
                </gl-component>
                <gl-component title="Configure 02">
                  <h1>Component 3</h1>
                </gl-component>
              </gl-dstack>
            </gl-col>
          </golden-layout>
          <!-- <golden-layout class="hscreen">
            <gl-col>
              
            </gl-col>
          </golden-layout> -->
          <!-- <div style="width:100%;height:40%; background: rgb(37, 37, 37);border-bottom: 1px solid rgb(51, 51, 51);">
            <v-carousel v-if="predict_list.length > 0" height="100%" hide-delimiter-background show-arrows-on-hover @change="onChangePredict">
              <v-carousel-item
                v-for="(item,i) in predict_list"
                :key="i"
                reverse-transition="fade-transition"
                transition="fade-transition"
              >
                <predict-viewer :title="title[i]" :params="item" :subtitle="title.toString()"/>
              </v-carousel-item>
            </v-carousel>
            <div v-else style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;">예측된 데이터가 없습니다.</div>
          </div>
          <div style="width:100%;height:20%; background: rgb(37, 37, 37);border-bottom: 1px solid rgb(51, 51, 51);" ref="sample_table">
            
          </div>
          <div style="width:100%;height:40%; background: rgb(37, 37, 37);">
            <data-viewer />
          </div> -->
        </v-content>
      </div>

      <!-- Footer Area -->
      <div class="footer-area" :style="progress.current < progress.total ? 'pointer-events:none; opacity:.5;' : ''">
        <div style="flex:1;width:100%;display:flex;align-items:center;overflow: hidden;text-overflow: ellipsis; white-space:nowrap;">{{message}}</div>
        <div style="flex:2; width:100%; display: flex; align-items: center;">
          <div style="display:flex; justify-content:center; align-items:center;margin-right:1em;">
            <v-btn color="#5252ff" v-for="(setting, i) in mrx_store.app.setting_list" :key="i" small class="ma-1" tile @click="changeSetting(setting)"> {{setting.name}}</v-btn>
          </div>
          <v-select style="margin-right:1em;" hide-details dense :items="mrx_store.app.excludes" label="시작" placeholder=" " v-model="train.start"></v-select>
          <v-select style="margin-right:1em;" hide-details dense @change="onChangeEndTime" :items="mrx_store.app.excludes" label="종료" placeholder=" " v-model="train.end"></v-select>
          <v-text-field style="margin-right:1em;" dense v-model.number="train.forecast_horizon" type="number" hide-details placeholder=" " label="예측기간(월)"></v-text-field>
          <v-text-field style="margin-right:1em;" dense v-model.number="train.n_epoch" type="number" hide-details placeholder=" " label="N_EPOCH"></v-text-field>
          <v-select style="margin-right:1em;" dense hide-details multiple :items="mrx_store.app.excludes" label="제외할 기간" placeholder=" " v-model="train.excludes">
            <template v-slot:selection="{ index }">
              <span
                v-if="index === 0"
                class="grey--text caption"
              >
                (+{{ train.excludes.length }} selected month )
              </span>
            </template>
          </v-select>
          <v-btn :disabled="!mrx_store.app.steps.includes('data_load')" small class="ma-1" color="#ff5252" text @click="onOptimize">OPTIMIZE</v-btn>
        </div>
      </div>
      <v-dialog v-model="mrx_store.app.dialog.show" max-width="450px" :persistent="mrx_store.app.dialog.persistent">
        <component :is="mrx_store.app.dialog.compName" :params="mrx_store.app.dialog.params"></component>
      </v-dialog>
    </v-app>
    <window-popup />
    <input type="file" id="importFile"  style="display:none"/>
  </div>
</template>

<script>
import Vue from "vue";

import MenuBar from "./layouts/MenuBar";

export default {
  components: {
    "menu-bar": MenuBar
  },
  data() {
    return {
      message:'',
      config: {
        wrap: false,
        enableTime: false,
        dateFormat: "Y-m-d",
        minuteIncrement: 1,
        allowInput: false,
      },
      train: {
        name:null,
        start:null,
        end:null,
        excludes:[],
        forecast_horizon:0,
        n_epoch:100
      },
      items:[],
      progress: {
        current: 0,
        total: 0,
      },
      action_items:[],
      panels: [],
      windows: [],
      dialog: {
        name: "",
        show: false,
        persistent: false,
        params: {},
      },
      valid: true,
      user_info: null,
      predict_list:[],
      title:[]
    };
  },
  watch: {
    'mrx_store.app.file_info.input_data' : function(new_val, old_val) {
      this.predict_list = [];
      this.title = [];

      this.train = this.mrx_store.app.default_setting;
    }
  },
  computed: {
  },
  methods: {
    onChangePredict(idx) {
      var item = this.predict_list[idx];
      var wrapper = document.createElement('div');
      wrapper.style.width = "100%"
      wrapper.style.height = "100%"
      wrapper.style.overflowX = 'auto';
      wrapper.style.overflowY = 'hidden';
      var table = document.createElement('table');
      var thead = document.createElement('thead');
      var tbody = document.createElement('tbody');
      table.classList.add('dashboard-table')
      var empty_th = document.createElement('th');
      empty_th.innerText = '';
      thead.appendChild(empty_th);
      item.datetime.data.forEach(function(d){
        var th = document.createElement('th');
        th.innerText = d;
        thead.appendChild(th);
      })

      var args = [];
      Object.keys(item).filter(function(d) { return !item[d].xAxis } ).forEach(function(title) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.innerText = title
        tr.appendChild(td);

        item[title].data.forEach(function(d) {
          let td = document.createElement('td');
          td.innerText = Math.floor(d*100)/100
          tr.appendChild(td);
        })
        tbody.appendChild(tr);
        args.push(item[title].data);
      })

      const subtractArr = function(arr1, arr2) {
        return arr1.map(function(d,i) {
          if(!d) {
            return null;
          }
          return d - arr2[i]
        })
      }
      var gap_data = subtractArr.apply(null, args);
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.innerText = 'Gap'
      tr.appendChild(td);

      gap_data.forEach(function(d) {
        let td = document.createElement('td');
        td.innerText = Math.floor(d*100)/100
        tr.appendChild(td);
      })
      tbody.appendChild(tr);

      table.appendChild(thead);
      table.appendChild(tbody);
      wrapper.appendChild(table);
      this.$refs.sample_table.innerHTML = '';
      this.$refs.sample_table.appendChild(wrapper)
    },
    changeSetting(setting) {
      this.train = setting;
    },
    onChangeEndTime(val) {
      var end_idx = this.mrx_store.app.excludes.findIndex(function(d) { return d.value == val})
      this.train.forecast_horizon = (this.mrx_store.app.excludes.length - 1) - end_idx;
    },
    notifications() {
      /*
        ex] 아래와 같이 사용
        [{path:'app.loading', callback : function() { }}]
        */
      return [{
        path:'app.clear',
        callback:this.onClear
      },{
        path:'socket.progress',
        callback:this.onProgress
      },{
        path:'socket.data_load',
        callback:this.onRender
      },{
        path:'socket.optimize',
        callback:this.onRender
      },{
        path:'socket.export',
        callback:this.onExport
      }];
    },
    onExport(val) {
      if(val.save_check[0]) {
        this.$message({type:'success', message:'SUCCESS EXPORT.'})
      } else {
        this.$message({type:'error', message:'FAIL EXPORT.'})
      }
    },
    onProgress(val) {
      this.progress.total = val.total[0];
      this.progress.current = val.progress[0];
    },
    onOptimize() {
      this.predict_list = [];
      this.title = [];
      //delete this.train.name;
      var item = JSON.parse(JSON.stringify(this.train));
      delete item.name;
      window.socket.send(JSON.stringify({ name:'optimize', params:item}))
      this.mrx_store.app.steps.push('optimize')
    },
    onClear(){
      this.predict_list = [];
      this.title = [];
      this.train = {
        start:null,
        end:null,
        excludes:[],
        forecast_horizon:0,
        n_epoch:100
      }
      this.mrx_store.app.excludes = [];
      this.$refs.sample_table.innerHTML = '';
    },
    onRender(val) {
      var title = [];
      this.predict_list = Object.keys(val).map(function(d) { title.push(d); return val[d]} );
      this.title = title;
    },
    onMessage(event, arg) {
      this.message = arg;
    }
  },
  beforeCreate() {
    
  },
  created() {
    window.onIPC(this.onMessage)
  },
  mounted() {
    console.log(this.$refs.gl)
  },
  updated() {
    
  },
  destroyed() {},
};
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}

#app-main {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app-main > .v-application--wrap {
  z-index: 0 !important;
}
.header-area {
  min-height: 30px;
  height: 36px;
  width: 100%;
  background: rgb(60, 60, 60);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.body-area {
  display: flex;
  height: calc(100% - 88px);
  z-index: 8;
}

#top_content {
  width: 100%;
  height: 50%;
}

#top_content.report {
  height: 100%;
  overflow: scroll;
}
.footer-area {
  min-height: 30px;
  display:flex;
  width: 100%;
  padding:1em;
  background: #222933;
}
.navigation-area {
  width: 55px;
  min-width: 55px;
  height: 100%;
  background: rgb(51, 51, 51);
  z-index: 10;
}
.panel-area {
  height: 100%;
  width: 20%;
  min-width: 300px;
  background: rgb(37, 37, 37);
  border-right: 1px solid rgb(51, 51, 51);
  overflow-y: auto;
  overflow-x: hidden;
}

.hscreen {
  width: 100%;
  height: 100%;
}
</style>
