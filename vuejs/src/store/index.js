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

    sumTotal: 0,
    normTotal: 0,

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
      var sum = 0.0;
      Object.keys(payload[0]).forEach(function(key) {
        state.dates.push({ key });
        sum += payload[0][key];
      });
      state.sumTotal = sum;
      state.normTotal = sum / 1000000.0;
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

      Object.keys(state.result).forEach(function(key) {
        var tokens = key.split("µ");
        var dates = state.result[key];
        var d = Object.keys(dates).length;
        var s = Object.values(dates).reduce((a, b) => a + b);

        var norm = state.norm[state.currentN];
        var spark = [];
        var sparkNorm = [];
        for(var i in norm){
          var n = norm[i];
          var v = (i in dates) ? dates[i] : 0;
          spark.push(v);
          sparkNorm.push(Math.round(v / n * 1000000.0));
        }

        state.resultGrid.push({
          key: key,

          w: tokens[0],
          l: tokens[1],
          p: tokens[2],

          d: d,
          s: s,
          sRel: (s / state.normTotal).toFixed(2),
          spark: spark,
          sparkNorm: sparkNorm
        });
      });
    },
  },
  actions: {},
  modules: {},
});
