<template>
  <div style="width: 100%; height: 100%">
    <v-app id="app-main">
      <!-- Header Area -->
      <menu-bar class="header-area"></menu-bar>

      <!-- Body Area -->
      <div class="body-area">
        <!-- Content Area -->
        <v-main>
          <golden-layout class="hscreen" :hasHeaders="false" :showPopoutIcon="false" @activeContentItemChanged="handleContentChange" @tabCreated="handleTabCreated" @stackCreated="handleStackCreated">
            <gl-col>
              <gl-row :height="70">
                <gl-component :closable="false" :reorderEnabled="false">
                  <golden-layout class="hscreen" :showPopoutIcon="false" @activeContentItemChanged="handleContentChange" @tabCreated="handleTabCreated" @stackCreated="handleStackCreated">
                    <gl-stack>
                      <gl-component :closable="false" :reorderEnabled="false" title="Chart">
                        <chart-viewer />
                      </gl-component>
                      <gl-component title="Map">
                        <map-viewer />
                      </gl-component>
                    </gl-stack>
                  </golden-layout>
                </gl-component>
              </gl-row>
              <gl-component :closable="false" :reorderEnabled="false">
                <golden-layout class="hscreen" :showPopoutIcon="false" @activeContentItemChanged="handleContentChange" @tabCreated="handleTabCreated" @stackCreated="handleStackCreated">
                  <gl-stack>
                    <gl-component :closable="false" :reorderEnabled="false" title="Code">
                      <code-viewer />
                    </gl-component>
                  </gl-stack>
                </golden-layout>
              </gl-component>
            </gl-col>
          </golden-layout>
        </v-main>
      </div>

      <!-- Footer Area -->
      <div class="footer-area">
        <div style="flex:1;width:100%;display:flex;align-items:center;overflow: hidden;text-overflow: ellipsis; white-space:nowrap;">{{message}}</div>
      </div>

      <!-- Dialog Area -->
      <v-dialog v-model="store.app.dialog.show" max-width="450px" :persistent="store.app.dialog.persistent">
        <component :is="store.app.dialog.compName" :params="store.app.dialog.params"></component>
      </v-dialog>
    </v-app>

    <!-- Window Popup -->
    <window-popup />
    <input type="file" id="importFile"  style="display:none"/>
  </div>
</template>

<script>
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
    },
    handleContentChange(a,b,c) {
      //console.log(a,b,c);
    },
    handleTabCreated(tab) {
      tab.element.on('dblclick', function(e) {
        alert('tab : ' + tab.element.text())
      })
    },
    handleStackCreated(stack) {
      console.log(stack.header.controlsContainer);
      stack.header.controlsContainer.prepend('<li title="Setting"><span class="mdi mdi-cog"></span></li>');
      stack.header.controlsContainer.prepend('<li title="New Tab"><span class="mdi mdi-plus-box-outline"></span></li>');
    }
  },
  beforeCreate() {
    
  },
  created() {
    
  },
  mounted() {
    
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
  min-height: 32px;
  height: 32px;
  width: 100%;
  background: rgb(60, 60, 60);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.body-area {
  display: flex;
  height: calc(100% - 64px);
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
  margin-top: 1px;
  height: 31px;
  display:flex;
  width: 100%;
  padding:.5em;
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
