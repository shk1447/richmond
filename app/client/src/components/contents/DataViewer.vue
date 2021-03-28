<template>
  <v-data-table height="100%" fixed-header class="data-table" :headers="headers" :items="items" dense hide-default-footer :items-per-page="-1">
    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="(item, idx) in items" :key="idx" >
          <td>{{item.id}}</td>
          <td>{{item.name}}</td>
          <td>{{item.type}}</td>
          <td>{{item.desc}}</td>
          <td>
            <v-btn
              x-small
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td colspan="5" style="text-align:center; cursor:pointer;">
            <v-icon x-small>
              mdi-plus
            </v-icon>
            <label style="cursor:pointer;font-size:12px">노드 추가하기</label>
          </td>
        </tr>
      </tbody>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id', width: "15%" },
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Description', value: 'desc' },
        { text: 'Actions', value: '', width: "10%" },
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


