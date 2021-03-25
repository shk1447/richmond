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


