import { createVuetify } from "vuetify";
import { de, en, th } from "vuetify/locale";

export default createVuetify({
  locale: {
    locale: "de",
    fallback: "en",
    messages: { de, en, th },
  },
  theme: { defaultTheme: "light" },
  icons: {
    defaultSet: "mdi",
  },
  defaults: {
    VTextField: { variant: "underlined" },
    VSelect: { variant: "underlined" },
  },
});
