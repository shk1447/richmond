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
          <golden-layout class="hscreen">
            <gl-col>
              <gl-row>
                <gl-component :closable="false" :reorderEnabled="false" title="component1">
                  <data-viewer />
                </gl-component>
                <gl-component title="component2">
                  <data-viewer />
                </gl-component>
              </gl-row>
            </gl-col>
          </golden-layout>
          <golden-layout class="hscreen">
            <gl-col>
              <gl-stack>
                <gl-component title="component3">
                  <h1>Component 2</h1>
                </gl-component>
                <gl-component title="component4">
                  <h1>Component 3</h1>
                </gl-component>
              </gl-stack>
            </gl-col>
          </golden-layout>
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
          <div style="width:100%;height:50%; background: rgb(37, 37, 37);">
            <data-viewer />
          </div> -->
        </v-content>
      </div>

      <!-- Footer Area -->
      <div class="footer-area">
        <div style="flex:1;width:100%;display:flex;align-items:center;overflow: hidden;text-overflow: ellipsis; white-space:nowrap;">{{message}}</div>
      </div>

      <!-- Dialog Area -->
      <v-dialog v-model="mrx_store.app.dialog.show" max-width="450px" :persistent="mrx_store.app.dialog.persistent">
        <component :is="mrx_store.app.dialog.compName" :params="mrx_store.app.dialog.params"></component>
      </v-dialog>
    </v-app>

    <!-- Window Popup -->
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
      progress: {
        current: 0,
        total: 0,
      },
      panels: [],
      windows: [],
      dialog: {
        name: "",
        show: false,
        persistent: false,
        params: {},
      }
    };
  },
  watch: {
    
  },
  computed: {
  },
  methods: {
    notifications() {
      /*
        ex] 아래와 같이 사용
        [{path:'app.loading', callback : function() { }}]
        */
      return [];
    }
  },
  beforeCreate() {
    
  },
  created() {
    
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
  height: 50%;
}
</style>
