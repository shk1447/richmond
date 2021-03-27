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
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Description', value: 'desc' },
      ],
      items: [],
    };
  },
  watch: {
    "store.flow.selected_proc": {
      deep: true,
      handler(newVal, oldVal) {
        this.items = newVal.children;
      }
    }
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
.data-table {
  height: 100%;
}
</style>


