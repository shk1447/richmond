<template>
<div class="header-area">
  <div style="display: inline-flex; height: 100%">
    <my-theme style="height: 100%;">
      <hsc-menu-bar style="height: 100%; border-radius: 0 0 4pt 0">
        <hsc-menu-bar-item label="Main" class="menu-item-wrapper">
          <hsc-menu-item label="Load" />
          <hsc-menu-item label="Save" />
          <hsc-menu-separator />
          <hsc-menu-item label="Logout" />
        </hsc-menu-bar-item>
        <hsc-menu-bar-item label="View" class="menu-item-wrapper">
          <hsc-menu-item label="Project" />
          <hsc-menu-item label="Flow" />
          <hsc-menu-item label="Table" />
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
    <v-icon small >mdi-bell</v-icon>
  </div>

  <div class="action-item-wrapper" @click="minimize">
    <v-icon small >mdi-account-circle</v-icon>
  </div>
  <!-- <div class="action-item-wrapper" @click="minimize">
    <v-icon x-small >mdi-window-minimize</v-icon>
  </div>
  <div class="action-item-wrapper" @click="maximize">
    <v-icon x-small >mdi-window-maximize</v-icon>
  </div>
  <div class="action-item-wrapper" @click="exit">
    <v-icon x-small >mdi-window-close</v-icon>
  </div> -->
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
  height:'.5pt',
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
    showSpaceDialog() {
      this.store.app.dialog = {
        show:true,
        compName : 'space-dialog',
        params: {}
      }
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
  margin-left:.5em; width:3em; height:100%; display:flex; justify-content:center; align-items:center; cursor: pointer;
}

.action-item-wrapper:hover {
  background: rgba(0,0,0,0.2);
}
</style>
