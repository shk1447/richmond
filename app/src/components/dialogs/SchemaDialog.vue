<template>
  <v-card tile outlined ref="ref_new_project">
    <v-data-table class="model-list-table" dense :headers="schema_header" :items="schema_list" calculate-widths no-data-text="No Data Table" hide-default-footer :items-per-page="-1">
      <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="(item, idx) in items" :key="idx" >
              <td>
                <v-simple-checkbox x-small></v-simple-checkbox>
              </td>
              <td>{{item.key}}</td>
              <td>{{item.name}}</td>
              <td>{{item.type}}</td>
            </tr>
            <tr>
              <td colspan="4" style="text-align:center; cursor:pointer;">
                <v-icon>
                  mdi-plus
                </v-icon>
                <label style="cursor:pointer;">필드 추가하기</label>
              </td>
            </tr>
          </tbody>
      </template>
    </v-data-table>
  </v-card>
  
</template>

<script>
export default {
  props: ["params"],
  data() {
    return {
      dialogProject: false,
      schema_header:[
        {text:'',value:'', sortable:false},
        {text:'KEY',value:'key'},
        {text:'NAME',value:'name'},
        {text:'TYPE',value:'type'}
      ],
      schema_list:[{
        key:'id',
        name:'ID',
        type:'string'
      },{
        key:'name',
        name:'Name',
        type:'string'
      },{
        key:'type',
        name:'NodeType',
        type:'string'
      },{
        key:'desc',
        name:'Description',
        type:'string'
      }]
    };
  },
  methods: {
    loadSpace(item) {
      this.store.flow.node_list = [{
        parent: null,
        id: 'project01',
        name: 'ABC 회사 2021 V1.0',
        space_name: 'ABC 회사',
        type: 'Process',
        desc: '',
        children: []
      }, {
        parent: null,
        id: 'project02',
        name: 'ABC 회사 2021 V2.0',
        space_name: 'ABC 회사',
        type: 'Process',
        desc: '',
        children: []
      }, {
        parent: null,
        id: 'project03',
        name: 'WOORI 회사 2021 V1.0',
        space_name: 'WOORI 회사',
        type: 'Process',
        desc: '',
        children: []
      }].filter(function(d) { return d.space_name == item.space_name})

      this.store.app.dialog = {
        show:false,
        compName : '',
        params: {}
      }
    }
  },
  created() {
    
  },
  mounted() {

  },
  destroyed() {

  },
};
</script>

<style scoped></style>
