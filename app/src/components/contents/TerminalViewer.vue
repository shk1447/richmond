
<template>
    <vue-terminal :task-list="taskList" :command-list="commandList" style="width:100%;margin:0 auto"></vue-terminal>
</template>
 
<script>
  import VueTerminal from 'vue-terminal';
  export default {
    components: { VueTerminal },
    data () {
      return {
        taskList: {
            // your tasks
        },
        commandList: {
            // your commands
        }
      }
    }
  }
</script>