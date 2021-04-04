<template>
  <my-theme>
    <hsc-window
      v-for="(window, idx) in windows"
      :key="idx"
      :positionHint="window.positionHint"
      :isOpen.sync="window.isOpen"
    >
      <template v-slot:title>
        <div style="display:flex">
          <span>{{ window.title }}</span>
          <v-spacer />
          <!-- <v-icon v-if="param.action" style="cursor:pointer;margin:0em 0.5em 0em 0em" small color="rgb(200,200,200)" @click="emitExpand">mdi-arrow-expand-all</v-icon> -->
          <v-icon
            v-if="window.action"
            style="cursor:pointer;"
            @click="onClosePopup(window)"
            small
            color="rgb(255,255,255)"
            >mdi-close</v-icon
          >
        </div>
      </template>
      <component :is="window.compName" :meta="window.meta"></component>
    </hsc-window>
  </my-theme>
</template>

<script>
import { StyleFactory } from "@hscmap/vue-window";
const StyleCustom = StyleFactory({
  button: {
    color: "rgba(84, 98, 183, 0.2)",
  },
  buttonActive: {
    color: "white",
  },
  buttonHover: {
    backgroundColor: "rgba(255, 0, 0, 0.8)",
  },
  content: {
    width: "100%",
    backgroundColor: "#f1f4f5",
  },
  titlebar: {
    fontSize: "1rem !important",
    background: "rgb(60,60,60)",
    color: "white",
  },
  window: {
    border: "0px solid #f00",
    color: "rgb(60 60 60)",
    boxShadow: "0 2pt 4pt rgba(0, 0, 0, 0.5)",
  },
});
export default {
  props: ["param", "onExpand"],
  components: {
    "my-theme": StyleCustom,
  },
  methods: {
    notifications() {
      return [{ path: "app.windows", callback: this.onWindows }];
    },
    onWindows(val) {
      this.windows = val;
    },
    emitExpand() {
      this.$emit("onExpand", this.param);
    },
    onClosePopup(window) {
      window.isOpen = false;
      var checkList = this.windows.filter(function(d) {
        return d.isOpen;
      });
      if (checkList.length === 0) {
        this.windows = [];
        this.$common.store.setProperty("app.windows", []);
      }
    },
  },
  data() {
    return {
      windows: [],
    };
  },
  created() {
    console.log("created");
  },
  mounted() {
    console.log("mounted");
    this.windows = this.$common.store.getProperty("app.windows");
  },
  destroyed() {
    console.log("destroyed");
  },
};
</script>

<style></style>
