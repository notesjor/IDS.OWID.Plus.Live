import { useCookie } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const cookieCompat = {
    get(name) {
      return useCookie(name).value ?? null
    },
    set(name, value) {
      const cookie = useCookie(name)
      cookie.value = value
    },
    remove(name) {
      const cookie = useCookie(name)
      cookie.value = null
    }
  }

  nuxtApp.config.globalProperties.$cookie = cookieCompat
  nuxtApp.provide('cookie', cookieCompat)
})
