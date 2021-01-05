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
    searches: 0,

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

    updateViewport(state, { w, h }) {
      state.vizViewportWidth = (w / 110) * 100;
      state.vizViewportHeight = h;
    },

    updateN(state, N) {
      state.owid.N = N;
    },

    updateStatus(state, status) {
      Vue.set(state, "status", status);
    },

    search(state, { n, queryItems, items }) {
      state.owid.addOwidLiveSearchItem(n, queryItems, items);
      state.searches = Object.keys(state.owid.OwidLiveSearches).length;
    },

    vizOption(state, payload) {
      state.vizOptionRelative = payload.r;
      state.vizOptionGranulation = payload.g;
      state.vizOptionSmoothing = payload.s;
    },

    calculate(state) {
      if (state.owid === null || state.owid.OwidLiveSearches === null) {
        state.vizData = null;
        return;
      }

      state.vizData = {};
      var res = {};

      for (var s in state.owid.OwidLiveSearches) {
        var search = state.owid.OwidLiveSearches[s];
        if (search.N != state.owid.N) continue;

        // Build a serie for any selected StorageTimeItem
        var subItems = {};
        for (var i in search.OwidLiveStorageTimeItems) {
          var item = search.OwidLiveStorageTimeItems[i];
          console.log(item);
          if (!item.IsSelected) continue;

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
        }console.log(subItems);
        if (Object.keys(subItems).length === 0) continue;

        // Build a serie for any selected search
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

          // if you had selected a 'search' all subItems will be appended
          res[search.Name] = { name: search.Name, data: sgrp, items: subItems };
        } else {
          // if you had not selected a 'search' all subItems will be root items
          subItems.forEach((x) => {
            res[x] = {
              name: subItems[x].name,
              data: subItems[x].data,
              items: [subItems[x]],
            };
          });
        }
      }

      // Build a sum series called "ALLE"

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
      res["ALLE"] = { name: "ALLE", data: sumAll, items: null };

      // relativ Frquency
      if (state.vizOptionRelative) {
        var normData;
        switch (state.vizOptionGranulation) {
          case 1:
            normData = state.owid.NormWeek;
            break;
          case 2:
            normData = state.owid.NormMonth;
            break;
          case 3:
            normData = state.owid.NormQuarter;
            break;
          case 4:
            normData = state.owid.NormYear;
            break;
          default:
            normData = state.owid.NormDate;
            break;
        }

        Object.keys(res).forEach((key) => {
          var item = res[key];
          Object.keys(normData).forEach((date) => {
            if (date in item.data)
              item.data[date].value = parseFloat(
                ((item.data[date].value / normData[date]) * 1000000.0).toFixed(
                  2
                )
              );
            else item.data[date] = { dates: new Set(), value: 0.0 };
          });
        });
      }
console.log(res);
      state.vizData = res;
      state.version++;
    },
  },
  actions: {},
  modules: {},
});
