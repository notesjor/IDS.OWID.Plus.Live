import { createVuetify } from "vuetify";
import { de, en, th } from "vuetify/locale";

export default createVuetify({
  locale: {
    locale: "de",
    fallback: "en",
    messages: { de, en, th },
  },
  // Vuetify 4: Standard ist "system" und neue Breakpoints -> Verhalten von Vuetify 3 beibehalten
  theme: { defaultTheme: "light" },
  display: {
    thresholds: { md: 960, lg: 1280, xl: 1920, xxl: 2560 },
  },
  icons: {
    defaultSet: "mdi",
  },
  defaults: {
    VBtn: { class: "text-uppercase" },
    VTextField: { variant: "underlined" },
    VSelect: { variant: "underlined" },
  },
});
