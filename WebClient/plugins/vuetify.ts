import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { de, en, th } from 'vuetify/locale'
import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light'
    },
    locale: {
      locale: 'de',
      messages: { de, en, th }
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)

  const vuetifyCompat = {
    get lang() {
      return {
        get current() {
          return vuetify.locale.current.value
        },
        set current(value) {
          vuetify.locale.current.value = value
        }
      }
    }
  }

  nuxtApp.config.globalProperties.$vuetify = vuetifyCompat
  nuxtApp.provide('vuetify', vuetifyCompat)
})
