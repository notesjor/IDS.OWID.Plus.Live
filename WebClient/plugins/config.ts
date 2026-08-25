export default defineNuxtPlugin(async (nuxtApp) => {
  const response = await fetch('/config.json')
  const config = await response.json()

  nuxtApp.config.globalProperties.$config = config
  nuxtApp.provide('config', config)
})
