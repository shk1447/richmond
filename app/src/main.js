// vue 및 사용되는 ui framework 적용 코드
import Vue from "vue";
import vuetify from "@/plugins/vuetify";

import * as VueMenu from "@hscmap/vue-menu";
Vue.use(VueMenu);

import * as VueWindow from "@hscmap/vue-window";
Vue.use(VueWindow);

import Notification from "element-ui/lib/notification";
import Message from "element-ui/lib/message";
import Loading from "element-ui/lib/loading";
import MessageBox from "element-ui/lib/message-box";

// import 'element-ui/lib/theme-chalk/index.css';
import "element-ui/lib/theme-chalk/icon.css";
import "element-ui/lib/theme-chalk/message.css";
import "element-ui/lib/theme-chalk/notification.css";
import "element-ui/lib/theme-chalk/loading.css";
import "element-ui/lib/theme-chalk/spinner.css";
import "element-ui/lib/theme-chalk/message-box.css";

Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$confirm = MessageBox.confirm;

import "element-theme-dark";

import WindowPopup from "./components/common/WindowPopup.vue";
Vue.component("window-popup", WindowPopup);

import ECharts from "./components/common/ChartComponent.vue";
Vue.component("v-chart", ECharts);

import VueFlatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
Vue.use(VueFlatPickr);

import vgl from 'vue-golden-layout'
Vue.use(vgl);
import 'golden-layout/src/css/goldenlayout-dark-theme.css'

// register component to use
import 'leaflet';
import 'proj4leaflet';
import '@/plugins/leaflet/leaflet.css'
import "@/plugins/leaflet/Leaflet.KoreanTmsProviders.js"
import '@/plugins/leaflet/L.Map.ScrollWheelZoom.js'

// 메인 컴포넌트 및 라우터 적용 코드
import router from "./router";
import App from "./App.vue";

import LightJson from 'light-json';
window.LightJson = LightJson;
// import EventHandler from './utils/EventHandler.js';

import common from "./common";
Vue.prototype.$common = common;

import views from "./views.js";

views.common.forEach(function (v, k) {
  Vue.component(v.compName, v.compPath.default);
})

views.windows.forEach(function (v, k) {
  Vue.component(v.compName + '-window', v.compPath.default);
});

views.panels.forEach(function (v, k) {
  Vue.component(v.compName + '-panel', v.compPath.default);
})

views.dialogs.forEach(function (v, k) {
  Vue.component(v.compName + '-dialog', v.compPath.default);
})

views.viewers.forEach(function (v, k) {
  Vue.component(v.compName + '-viewer', v.compPath.default);
})

Vue.mixin({
  data() {
    return {
      store: this.$common.store.all
    }
  },
  methods: {
    // 컴포넌트가 관심을 가지는 이벤트 리스트 정의
    notifications: function () {
      /*
            ex] 아래와 같이 사용
            [{path:'app.loading', callback : function() { }}]
            */
      return [];
    }
  },
  created: function () {
    var handlers = this.notifications();
    handlers.forEach(function (handle, k) {
      //this.$common.store.onProperty(handle.path, handle.callback);
    }.bind(this));
  },
  destroyed: function () {
    var handlers = this.notifications();
    handlers.forEach(function (handle, k) {
      //this.$common.store.offProperty(handle.path, handle.callback);
    }.bind(this));
  },
});

// vue 인스턴스 생성 코드(vue lifecycle start!)
new Vue({
  el: "#app",
  router,
  vuetify,
  components: { App },
  template: "<App/>",
});
