import { createI18n } from 'vue-i18n'

const localeModules = import.meta.glob('../locales/*.json', { eager: true })
const messages = Object.entries(localeModules).reduce<Record<string, any>>((acc, [filePath, mod]) => {
  const fileName = filePath.split('/').pop() || filePath
  const locale = fileName.replace(/\.json$/, '')
  acc[locale] = (mod as any).default || mod
  return acc
}, {})

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'de',
    fallbackLocale: 'en',
    messages
  })

  nuxtApp.vueApp.use(i18n)

  const i18nCompat = {
    get locale() {
      return i18n.global.locale.value
    },
    set locale(value) {
      i18n.global.locale.value = value
    },
    get messages() {
      return i18n.global.messages.value
    }
  }

  nuxtApp.config.globalProperties.$i18n = i18nCompat
  nuxtApp.config.globalProperties.$t = i18n.global.t
  nuxtApp.provide('i18n', i18n)
  nuxtApp.provide('t', i18n.global.t)
})
