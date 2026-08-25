export default defineNuxtPlugin(async (nuxtApp) => {
  const config = await $fetch('/config.json')

  nuxtApp.config.globalProperties.$config = config
  nuxtApp.vueApp.config.globalProperties.$config = config
  nuxtApp.provide('config', config)
})
