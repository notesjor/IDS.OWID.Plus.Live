import { createI18n } from "vue-i18n";

function loadLocaleMessages() {
  const modules = import.meta.glob("./locales/*.json", { eager: true, import: "default" });
  const messages = {};
  Object.keys(modules).forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\.json$/i);
    if (matched) messages[matched[1]] = modules[key];
  });
  return messages;
}

export default createI18n({
  legacy: true,
  globalInjection: true,
  locale: "de",
  fallbackLocale: "de",
  messages: loadLocaleMessages(),
});
