<template>
  <v-data-table v-if="items.length > 0" height="100%" fixed-header class="data-table" :headers="headers" :items="items" dense hide-default-footer :items-per-page="-1">
  </v-data-table>
  <div v-else style="height:100%; width:100%; display:flex; align-items:center; justify-content:center;">
    No Data Available
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'Process Code', value: 'code' },
        { text: 'No', value: 'no' },
        { text: 'Process Name', value: 'name' },
        { text: 'Process Detail', value: 'detail' },
        { text: 'Control Code', value: 'c_code' },
        { text: '계정과목', value: 'kinds' },
      ],
      items: [],
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
    for(var i = 1; i <= 16; i++) {
      var item = {
        code:'PU-' + i.toString(),
        no:i.toString(),
        name:'구매',
        detail:'',
        c_code:'',
        kinds:''
      }
      this.items.push(item);
    }
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
.data-table {
  height: 100%;
}
</style>


