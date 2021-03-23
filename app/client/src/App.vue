<template>
  <router-view ref="app" />
</template>

<script>
export default {
  data() {
    return {
      loaders: [],
    };
  },
  watch: {
  },
  methods: {
    notifications() {
      return [
        {
          path: "app.loading",
          callback: this.onLoading,
        },
        {
          path: "app.notify",
          callback: this.onNotify,
        },
        {
          path:"app.message",
          callback:this.onMessage
        }
      ];
    },
    onMessage(val) {
      this.$message({
        type:'info',
        message:val
      })
    },
    onNotify(val) {
      this.$notify(val);
    },
    onLoading(val) {
      if (val.show) {
        var targetValid = false;
        if (typeof val.target == "string") {
          if (document.querySelector(val.target)) targetValid = true;
        } else {
          if (val.target) {
            targetValid = true;
          }
        }
        if (targetValid) {
          var loader = this.$loading.service({
            lock: false,
            target: val.target ? val.target : this.$refs.app.$el,
            text: "Loading...",
            spinner: "el-icon-loading",
            background: "rgba(0, 22, 55, 0.12)",
          });
          var temp = {
            target: val.target ? val.target : this.$refs.app.$el,
            loader: loader,
            uuid:val.uuid
          };
          this.loaders.push(temp);
        }
      } else {
        var uuid = val.uuid;
        var delIdx = this.loaders.findIndex(function (item) {
          return item.uuid === uuid;
        });
        if (delIdx > -1) {
          this.loaders[delIdx].loader.close();
          this.loaders.splice(delIdx, 1);
        }
      }
    },
  },
  created() {
    
  },
  mounted() {
    
  },
  beforeDestroy() {},
  destroyed() {
    
  },
};
</script>

<style lang="css">
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden !important;
}

body {
  font-family: Poppins-Regular, sans-serif;
  margin: 0px;
  font-size: 12px;
}

.window {
  z-index: 9999 !important;
}

.v-list {
  padding:0px !important;
}

.menu-item-wrapper .fixed .menu {
  border-radius: 0pt !important;
  padding: 0pt !important;
}

.menu-item-wrapper .fixed .menu .menuitem {
  padding: 4px 8pt 4px 4pt;
  cursor:pointer;
}

.dashboard-table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
  height: 100%;
  padding:1em;
}

.dashboard-table td, .dashboard-table th {
  border: 1px solid #616161;
  padding: 8px;
  color: white;
}

.dashboard-table tr:nth-child(odd){
  background-color: #252525;
}
.dashboard-table tr:nth-child(even){
  background-color: #252525;
}

.dashboard-table th {
  text-align: left;
  background-color: #1e1e1e;
  color: #b3b3b3;
  white-space:pre;
}

td {
  white-space:pre;
}

::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

::-webkit-scrollbar-corner {
}

::-webkit-scrollbar-thumb {
  transition: 0.3s ease all;
  border-color: transparent;
  background-color: rgba(151, 151, 151, 0.12);
  z-index: 40;
}
</style>
