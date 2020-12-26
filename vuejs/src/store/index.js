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
    vizOptionGranulation: 0,
    vizOptionSmoothing: 7,

    vizViewportWidth: 1200,
    vizViewportHeight: 500,

    vizData: null,
  },
  mutations: {
    init(state, payload) {
      state.owid = new OwidLiveStorage(payload);
    },

    updateViewport(state, {w, h}){
      state.vizViewportWidth = w / 110 * 100;
      state.vizViewportHeight = h;
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
      state.vizOptionGranulation = payload.g;
      state.vizOptionSmoothing = payload.s;
    },

    calculate(state) {
      state.vizData = {};
      var res = {};

      Object.keys(state.owid.OwidLiveSearches).forEach((s) => {
        var search = state.owid.OwidLiveSearches[s];

        var subItems = {};
        search.OwidLiveStorageTimeItems.forEach((item) => {
          var sitem;
          if (state.vizOptionGranulation === 1) sitem = item.Week;
          else if (state.vizOptionGranulation === 2) sitem = item.Month;
          else if (state.vizOptionGranulation === 3) sitem = item.Quarter;
          else if (state.vizOptionGranulation === 4) sitem = item.Year;
          else sitem = item.Date;

          subItems[item.Name] = { name: item.Name, data: sitem, items: null };
        });

        if (search.IsSelected) {
          var sgrp;
          if (state.vizOptionGranulation === 1) sgrp = search.Week;
          else if (state.vizOptionGranulation === 2) sgrp = search.Month;
          else if (state.vizOptionGranulation === 3) sgrp = search.Quarter;
          else if (state.vizOptionGranulation === 4) sgrp = search.Year;
          else sgrp = search.Date;

          res[search.Name] = { name: search.Name, data: sgrp, items: subItems };
        } else {
          subItems.forEach((x) => {
            res[x] = {name: subItems[x].name, data: subItems[x].data, items: [subItems[x]]};
          });
        }
      });

      var sumAll = {};
      Object.keys(res).forEach((key) => {
        var item = res[key];
        Object.keys(item.data).forEach((subKey) => {
          if (subKey in sumAll) {
            sumAll[subKey].value += item.data[subKey].value;
            sumAll[subKey].dates = new Set([...sumAll[subKey].dates, ...item.data[subKey].dates]);
          }
          else sumAll[subKey] = item.data[subKey];
        });
      });
      res["ALLE"] = sumAll;

      state.vizData = res;
    },
  },
  actions: {},
  modules: {},
});
