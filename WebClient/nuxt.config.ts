export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  css: ['@mdi/font/css/materialdesignicons.css'],
  experimental: {
    appManifest: false
  },
  app: {
    head: {
      title: 'OWIDplusLIVE',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]
    }
  },
  pinia: {
    storesDirs: ['./stores/**']
  },
  build: {
    transpile: ['vuetify']
  },
  vite: {
    optimizeDeps: {
      exclude: ['vuetify']
    }
  }
})
