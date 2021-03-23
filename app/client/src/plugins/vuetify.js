// Vuetify 플러그인 로드 코드

import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

const opts = {
  icons: {
    iconfont: "mdi",
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: "#3f51b5",
        secondary: "#2196f3",
        accent: "#03a9f4",
        error: "#00bcd4",
        warning: "#009688",
        info: "#4caf50",
        success: "#8bc34a",
      },
      light: {
        primary: "#3f51b5",
        secondary: "#2196f3",
        accent: "#03a9f4",
        error: "#00bcd4",
        warning: "#009688",
        info: "#4caf50",
        success: "#8bc34a",
      },
    },
  },
};

export default new Vuetify(opts);
