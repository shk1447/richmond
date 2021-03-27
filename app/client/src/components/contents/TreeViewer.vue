<template>

<div style="height:100%;overflow:auto;">
  <v-treeview v-model="tree" :items="search_items" item-key="id" item-text="name" class="process-tree-view"
      activatable return-object dense open-all hoverable >
    <template v-slot:label="{ item }">
      <div tabindex="0" style="outline: none; width: 100%; height: 100%; cursor:pointer;" @dblclick="onLoadProcess(item)">
        {{ item.name == '' ? '-' : item.name }}
      </div>
    </template>
    <!-- <template v-slot:append="{ item }">
      <v-tooltip bottom v-if="item.type == 'Process'">
        <template v-slot:activator="{ on }">
          <v-icon @click="addChildren(item)" v-on="on" small>mdi-plus</v-icon>
        </template>
        <span>Add ChildNode</span>
      </v-tooltip>
      <v-tooltip bottom v-if="item.id != 'root'">
        <template v-slot:activator="{ on }">
          <v-icon @click="removeChildren(item)" v-on="on" small>mdi-delete</v-icon>
        </template>
        <span>Delete Node</span>
      </v-tooltip>
    </template> -->
  </v-treeview>
</div>

</template>

<script>

export default {
  components: {
    // 외부 컴포넌트 등록
  },
  methods: {
    search (tree, value, key = 'id', reverse = false) {
      const stack = [ tree[0] ]
      while (stack.length) {
        const node = stack[reverse ? 'pop' : 'shift']()
        if (node[key] === value) return node
        node.children && stack.push(...node.children)
      }
      return null
    },
    searchNode (tree, value, key = 'name', reverse = false) {
      let search_result = [];
      const stack = [ tree[0] ]
      while (stack.length) {
        const node = stack[reverse ? 'pop' : 'shift']()
        if (node[key].includes(value)) search_result.push(node)
        node.children && stack.push(...node.children)
      }
      return search_result;
    },
    // 해당 view에서 사용하는 함수 등록
    addChildren(item) {
      var uuid = this.$common.utils.uuid()
      item.children.push({
        parent:item.id,
        id:uuid,
        name:'untitled',
        type:'Process',
        desc:'',
        children:[],
        classes: ['flow'],
        position:{
          x:null,y:null
        }
      })
    },
    removeChildren(item) {
      var parent_node = this.search(this.store.flow.node_list, item.parent);
      var rm_idx = parent_node.children.indexOf(item);
      parent_node.children.splice(rm_idx, 1);
    },
    onLoadProcess(item) {
      if(item.type == 'Process') {
        this.store.flow.selected_proc = item;
      } else {
        this.$message({type:'warning', message:'프로세스만 로드 가능합니다.'})
      }
    }
  },
  watch: {
    // 해당 view에서 사용되는 변수에 대한 event listen 등록
  },
  computed : {
    search_items() {
      if(this.search_text) {
        return this.searchNode(this.store.flow.node_list, this.search_text)
      } else {
        return this.store.flow.node_list
      }
    }
  },
  data () {
    // 해당 view에서 사용되는 변수 등록(<temaplte></template>연동)
    return {
      tree:[],
      search_text:'',
    }
  },
  created() {
    // vue lifecycle01 : dom이 생성되기 전 instance 생성시 발생
    console.log('created')
  },
  mounted() {
    // vue lifecycle02 : dom객체가 browser에 생성시 발생
    console.log('mounted')
  },
  updated() {
    // vue lifecycle03 : data 변경으로 인해 dom update시 발생
  },
  destroyed() {
    // vue lifecycle04 : view destroy시 발생
    console.log('destroyed')
  }
}
</script>

<style scoped>
.process-tree-view {
  height:100%;
}
</style>
