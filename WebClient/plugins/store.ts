import { useOwidStore } from '~/stores/owid'

export default defineNuxtPlugin((nuxtApp) => {
  const store = useOwidStore()

  const commitMap = {
    years: 'setYears',
    focusYear: 'focusYear',
    init: 'init',
    clearAll: 'clearAll',
    updateN: 'updateN',
    search: 'search',
    vizOption: 'vizOption',
    selectSearchChange: 'selectSearchChange',
    selectSearchHistoryItemsChange: 'selectSearchHistoryItemsChange',
    modelLoad: 'modelLoad',
    calculate: 'calculate'
  }

  const compatStore = {
    get state() {
      return store.$state
    },
    commit(name, payload) {
      const actionName = commitMap[name] ?? name
      const action = store[actionName]
      if (typeof action === 'function') {
        return action(payload)
      }
      return undefined
    },
    dispatch(name, payload) {
      return this.commit(name, payload)
    }
  }

  nuxtApp.config.globalProperties.$store = compatStore
  nuxtApp.vueApp.config.globalProperties.$store = compatStore
  nuxtApp.vueApp.config.globalProperties.$pinia = store
  nuxtApp.provide('store', compatStore)
})
