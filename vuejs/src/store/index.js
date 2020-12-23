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
    vizOptionGranulation: 1,
    vizOptionSmoothing: 7,

    vizData: {},
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
      state.vizOptionGranulation = payload.g;
      state.vizOptionSmoothing = payload.s;
    },

    calculate(state) {
      state.vizData = {};
      var res = {};
console.log(state.owid);
      Object.keys(state.owid.OwidLiveSearches).forEach((s) => {
        var search = state.owid.OwidLiveSearches[s];

        var subItems = {};
        Object.keys(search.OwidLiveStorageItems).forEach((i) => {
          var item = search.OwidLiveStorageItems[i];
          var sitem;
          if (state.vizOptionGranulation === 1) sitem = item.Weeks;
          else if (state.vizOptionGranulation === 2) sitem = item.Month;
          else if (state.vizOptionGranulation === 3) sitem = item.Quarter;
          else if (state.vizOptionGranulation === 4) sitem = item.Year;
          else sitem = item.Dates;

          subItems[item.Name] = { name: item.Name, data: sitem, items: null };
        });

        if (search.IsSelected) {
          var sgrp;
          if (state.vizOptionGranulation === 1) sgrp = search.Weeks;
          else if (state.vizOptionGranulation === 2) sgrp = search.Month;
          else if (state.vizOptionGranulation === 3) sgrp = search.Quarter;
          else if (state.vizOptionGranulation === 4) sgrp = search.Year;
          else sgrp = search.Dates;

          res[search.Name] = { name: search.Name, data: sgrp, items: subItems };
        }else{
          subItems.forEach(x => {
            res[x] = subItems[x];
          });
        }
      });

      state.vizData = res;
    },
  },
  actions: {},
  modules: {},
});
