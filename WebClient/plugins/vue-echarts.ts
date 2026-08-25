import VueECharts from 'vue-echarts'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('v-chart', VueECharts)
})
