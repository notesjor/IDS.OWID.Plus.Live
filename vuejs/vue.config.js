module.exports = {
  transpileDependencies: ["vuetify", "vue-echarts", "resize-detector"],

  configureWebpack: {
    devtool: "source-map",
  },

  publicPath: process.env.NODE_ENV === 'production'
    ? '/plus/live-2021/'
    : '/',

  pluginOptions: {
    i18n: {
      locale: 'de',
      fallbackLocale: 'de',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
};
