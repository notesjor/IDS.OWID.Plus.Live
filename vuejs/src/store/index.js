import Vue from "vue";
import Vuex from "vuex";
import { OwidLiveStorage } from "./OwidLiveStorage";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    baseUrl: "http://81.30.156.64:9731",
    status: "init",

    owid: null,
    version: 0,

    vizOptionRelative: true,
    vizOptionGranulation: 0,
    vizOptionSmoothing: 7,

    vizViewportWidth: 1200,
    vizViewportHeight: 500,

    vizData: null,
  },
  mutations: {
    init(state, payload) {
      state.owid = new OwidLiveStorage(payload);
      state.version++;
    },

    updateViewport(state, { w, h }) {
      state.vizViewportWidth = (w / 110) * 100;
      state.vizViewportHeight = h;
      state.version++;
    },

    updateN(state, N) {
      state.owid.N = N;
      state.version++;
    },

    updateStatus(state, status) {
      Vue.set(state, "status", status);
    },

    search(state, { n, queryItems, items }) {
      state.owid.addOwidLiveSearchItem(n, queryItems, items);
      state.version++;
    },

    vizOption(state, payload) {
      state.vizOptionRelative = payload.r;
      state.vizOptionGranulation = payload.g;
      state.vizOptionSmoothing = payload.s;
      state.version++;
    },

    calculate(state) {
      state.vizData = {};
      var res = {};

      Object.keys(state.owid.OwidLiveSearches).forEach((s) => {
        var search = state.owid.OwidLiveSearches[s];

        var subItems = {};
        search.OwidLiveStorageTimeItems.forEach((item) => {
          var sitem;
          switch (state.vizOptionGranulation) {
            case 1:
              sitem = item.Week;
              break;
            case 2:
              sitem = item.Month;
              break;
            case 3:
              sitem = item.Quarter;
              break;
            case 4:
              sitem = item.Year;
              break;
            default:
              sitem = item.Date;
              break;
          }

          subItems[item.Name] = { name: item.Name, data: sitem, items: null };
        });

        if (search.IsSelected) {
          var sgrp;
          switch (state.vizOptionGranulation) {
            case 1:
              sgrp = search.Week;
              break;
            case 2:
              sgrp = search.Month;
              break;
            case 3:
              sgrp = search.Quarter;
              break;
            case 4:
              sgrp = search.Year;
              break;
            default:
              sgrp = search.Date;
              break;
          }

          res[search.Name] = { name: search.Name, data: sgrp, items: subItems };
        } else {
          subItems.forEach((x) => {
            res[x] = {
              name: subItems[x].name,
              data: subItems[x].data,
              items: [subItems[x]],
            };
          });
        }
      });

      var sumAll = {};
      Object.keys(res).forEach((key) => {
        var item = res[key];
        Object.keys(item.data).forEach((subKey) => {
          if (subKey in sumAll) {
            sumAll[subKey].value += item.data[subKey].value;
            sumAll[subKey].dates = new Set([
              ...sumAll[subKey].dates,
              ...item.data[subKey].dates,
            ]);
          } else sumAll[subKey] = item.data[subKey];
        });
      });
      res["ALLE"] = sumAll;

      state.vizData = res;
      state.version++;
    },
  },
  actions: {},
  modules: {},
});
