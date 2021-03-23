<template>
  <div style="height: 100%; width: 100%">
    <div v-if="tabs.length > 0" style="height: 100%; width: 100%">
      <v-tabs v-model="tab" height="42px">
        <v-tab v-for="item in tabs" :key="item.name" style="font-size: 1em">
          {{ item.name }}
        </v-tab>
      </v-tabs>
      <div :class="'tab-wrapper ' + theme" >
        <v-tabs-items class="tab-item-container" v-model="tab">
          <v-tab-item v-for="item in tabs" :key="item.name" style="height: 100%; width: 100%; padding:0px 2em">
            <v-data-table :headers="item.headers" :items="item.items" dense hide-default-footer :items-per-page="-1">
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
    <div v-else style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;">로드된 데이터가 없습니다.</div>
  </div>
</template>

<script>
export default {
  props: ["theme"],
  data() {
    return {
      tab: 0,
      tabs: [],
    };
  },
  watch: {
    tab(new_val, old_val) {
      this.onFocusTab(this.tabs[new_val].name);
    },
    'mrx_store.app.file_info.input_data' : function(new_val, old_val) {
      this.onRenderData(new_val)
    }
  },
  methods: {
    notifications() {
      /*
        ex] 아래와 같이 사용
        [{path:'app.loading', callback : function() { }}]
        */
      return [
        { path: "app.tab_info", callback: this.onTabs },
        { path: "app.tab_info.active_tab", callback: this.onFocusTab },
      ];
    },
    onDragStart(e, tab) {
      // 데이터를 이벤트에 저장하는 함수 입니다.( dragstart라는 이벤트에서 담아주시면 되요^^ )
      // e.dataTransfer.setData("tab_info", JSON.stringify(tab));
    },
    onDragover(e) {
      e.preventDefault();
      // 언제든 물어보세요^^ㅎ
    },
    onDropTab(e) {
      e.preventDefault();
      // 데이터 전달받는 함수 입니다.!
      var transfer_data = e.dataTransfer.getData("tab_info");
    },
    onFocusTab(active_tab) {
      var tab_idx = 0;
      this.tabs.forEach(function (v, k) {
        if (active_tab == v.name) {
          tab_idx = k;
          v.activate = true;
        } else {
          v.activate = false;
        }
      });
      this.tab = tab_idx;
    },
    onTabs(tab_info) {
      this.tabs = Object.keys(tab_info.tabs).map(function (v, k) {
        tab_info.tabs[v]["name"] = v;
        return tab_info.tabs[v];
      });
    },
    onRenderData(input_data) {
      this.tabs = Object.keys(input_data).map(function (v, k) {
        input_data[v]["name"] = v;
        return input_data[v];
      });
    }
  },
  created() {
    console.log("created");

  },
  mounted() {
    console.log("mounted");
  },
  destroyed() {
    console.log("destroyed");
  },
};
</script>

<style scoped>
.tab-wrapper {
  width: 100%;
  height: calc(100% - 42px);
}
.tab-wrapper.dark {
  border-top: 1px solid rgb(51, 51, 51);
}
.tab-wrapper.light {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.tab-item-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>


