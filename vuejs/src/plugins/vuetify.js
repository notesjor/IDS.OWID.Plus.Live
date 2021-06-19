import Vue from "vue";
import Vuetify from "vuetify/lib";
import de from "vuetify/es5/locale/de";
import en from "vuetify/es5/locale/en";
import { preset } from "vue-cli-plugin-vuetify-preset-rally/preset";

Vue.use(Vuetify);

export default new Vuetify({
  preset,
  lang: {
    locales: { de, en },
    current: "de",
  },
  theme: { dark: false },
  icons: {
    iconfont: "mdi",
  },
});
