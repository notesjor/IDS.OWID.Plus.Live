import vuetify from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/plus/live-2021/' : '/',
    head: {
      htmlAttrs: { lang: 'de' },
      link: [{ rel: 'icon', type: 'image/x-icon', href: './favicon.ico' }]
    }
  },

  css: ['@mdi/font/css/materialdesignicons.css'],

  modules: [
    '@pinia/nuxt',
    (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
  ],

  build: {
    transpile: ['vuetify', 'vue-echarts', 'resize-detector']
  },

  devtools: { enabled: false },

  compatibilityDate: '2025-01-01'
})
