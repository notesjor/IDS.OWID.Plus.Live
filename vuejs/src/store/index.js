import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

function avgFloat(serie) {
  serie = null;
  if (serie === null) return null;
}

export default new Vuex.Store({
  state: {
    baseUrl: "http://81.30.156.64:9731",

    norm: null,
    dates: null,

    current: null,
    currentN: 0,
    stored: null,

    result: null,
    resultSeries: null,
    resultGrid: null,

    normalize: true,
    merge: true,
    sumRange: 7,
    sumFunction: avgFloat,
  },
  mutations: {
    init(state, payload) {
      state.norm = payload;
      state.dates = [];
      Object.keys(payload[0]).forEach(function(key) {
        state.dates.push({ key });
      });
    },

    search(state, { n, items }) {
      state.currentN = n;
      state.current = items;
    },

    store(state) {
      if (state.stored == null) state.stored = [state.current];
      else state.stored.push(state.current);
    },

    calculate(state) {
      state.result = state.current; // TODO: Merge mit stored

      state.resultGrid = [];
      if (state.merge) {
        var sumSerieTmp = {};
        state.dates.forEach((x) => (sumSerieTmp[x] = 0.0));
        state.resultSeries = [sumSerieTmp];
      } else {
        state.resultSeries = [];
      }

      console.log(state.resultSeries);

      Object.keys(state.result).forEach(function(key) {
        var tokens = key.split("µ");
        var dates = state.result[key];

        state.resultGrid.push({
          w: tokens[0],
          l: tokens[1],
          p: tokens[2],

          d: dates.length,
        });
      });
    },
  },
  actions: {},
  modules: {},
});
