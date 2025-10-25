import { createI18n } from 'vue-i18n'

const localeModules = import.meta.glob('../locales/*.json', { eager: true, as: 'json' })

function loadLocaleMessages() {
  const messages = {}
  Object.entries(localeModules).forEach(([path, module]) => {
    const matched = path.match(/\/([A-Za-z0-9-_]+)\.json$/i)
    if (matched && matched[1]) {
      messages[matched[1]] = module.default ?? module
    }
  })
  return messages
}

export default defineNuxtPlugin(({ vueApp }) => {
  const config = useRuntimeConfig()
  const defaultLocale = config.public?.VUE_APP_I18N_LOCALE || process.env.VUE_APP_I18N_LOCALE || 'de'
  const fallbackLocale = config.public?.VUE_APP_I18N_FALLBACK_LOCALE || process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'de'

  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: defaultLocale,
    fallbackLocale,
    messages: loadLocaleMessages()
  })

  vueApp.use(i18n)
})