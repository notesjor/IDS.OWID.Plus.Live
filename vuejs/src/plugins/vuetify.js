import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import de from 'vuetify/es5/locale/de';
import { preset } from 'vue-cli-plugin-vuetify-preset-rally/preset'

Vue.use(Vuetify);

export default new Vuetify({
  preset,
    lang: {
      locales: { de },
      current: 'de',
    },
});
