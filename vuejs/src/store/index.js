import * as echarts from "echarts"; // TODO: REMOVE
import Vue from "vue";
import Vuex from "vuex";
import { OwidLiveStorage } from "./OwidLiveStorage";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    baseUrl: "http://81.30.156.64:9731",
    status: "init",

    owid: null,

    vizOptionRelative: true,
    vizOptionGranulatioon: 1,
    vizOptionSmoothing: 7,
  },
  mutations: {
    init(state, payload) {
      state.owid = new OwidLiveStorage(payload);
    },

    updateStatus(state, status) {
      Vue.set(state, "status", status);
    },

    search(state, { n, queryItems, items }) {
      state.owid.addOwidLiveSearchItem(n, queryItems, items);
    },

    store(state) {
      if (state.stored == null) state.stored = [state.current];
      else state.stored.push(state.current);
    },

    vizOption(state, payload) {
      state.vizOptionRelative = payload.r;
      state.vizOptionGranulatioon = payload.g;
      state.vizOptionSmoothing = payload.s;
    },

    calculate(state) {
      // nice
      state.result = state.current; // TODO: Merge mit stored

      if (state.merge) {
        var sumSerieTmp = {};
        state.dates.forEach((x) => (sumSerieTmp[x] = 0.0));
        state.resultSeries = [sumSerieTmp];
      } else {
        state.resultSeries = [];
      }

      Object.keys(state.result).forEach(function(key) {
        var dates = state.result[key];

        var norm = state.norm[state.currentN];
        var spark = [];
        var sparkNorm = [];

        // easyCal
        var easyCal = [];

        for (var i in norm) {
          var n = norm[i];
          var v = i in dates ? dates[i] : 0;
          spark.push(v);
          sparkNorm.push(Math.round((v / n) * 1000000.0));

          // easyCal >>>
          easyCal.push([
            i.replace("T00:00:00", ""),
            Math.round((v / n) * 1000000.0),
          ]);
          // <<<
        }

        // easyFreq >>>
        state.resultSeries = [
          {
            type: "line",
            data: sparkNorm,
            symbolSize: 10,
            line: { marker: { enable: false } },
            lineStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(247, 32, 71)",
                },
                {
                  offset: 0.5,
                  color: "rgba(255, 210, 0)",
                },
                {
                  offset: 1,
                  color: "rgba(31, 234, 234)",
                },
              ]),
            },
          },
        ];
        // <<<
        state.resultCalendar = easyCal; // easyCal
      });
    },
  },
  actions: {},
  modules: {},
});
