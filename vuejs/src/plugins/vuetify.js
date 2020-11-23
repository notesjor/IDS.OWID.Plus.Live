import Vue from "vue";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vuetify from "vuetify/lib";
import de from "vuetify/es5/locale/de";
import { preset } from "vue-cli-plugin-vuetify-preset-rally/preset";

Vue.use(Vuetify);

export default new Vuetify({
  preset,
  lang: {
    locales: { de },
    current: "de",
  },
  theme: { dark: false },
  icons: {
    iconfont: "md",
  },
});
