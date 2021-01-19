import Vue from "vue";
import Vuex from "vuex";
import { OwidLiveStorage } from "./OwidLiveStorage";
import { Normalize } from "./DataHelper";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    baseUrl: "https://owidnext.jan-oliver-ruediger.de",
    status: "init",
    sessionKey: null,

    owid: null,
    version: 0,
    searches: 0,

    vizOptionRelative: true,
    vizOptionGranulation: 0,
    vizOptionSmoothing: 7,

    vizViewportWidth: 1200,
    vizViewportHeight: 500,
    vizVizportId: "",

    vizData: null,
  },
  mutations: {
    id(state, id) {
      state.sessionKey = id;
    },

    init(state, payload) {
      state.owid = new OwidLiveStorage(payload);
    },

    updateViewport(state, { w, h }) {
      state.vizViewportWidth = (w / 110) * 100;
      state.vizViewportHeight = h;
    },

    updateViewportId(state, id) {
      state.vizVizportId = id;
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

    selectSearchChange(state, payload){
      state.owid.selectSearchItems(payload);
    },

    selectSearchHistoryItemsChange(state, payload){
      state.owid.selectSearchHistoryItem(payload);
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

          subItems[item.Label] = { name: item.Name, label: item.Label, data: sitem, items: null };
        }
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
          res[search.Name] = { name: search.Name, label: search.Label, data: sgrp, items: subItems };
        } else {
          // if you had not selected a 'search' all subItems will be root items
          Object.keys(subItems).forEach((x) => {
            res[x] = {
              name: subItems[x].name,
              label: subItems[x].Label,
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
      res["ALLE"] = { name: "ALLE", label: "ALLE", data: sumAll, items: null };

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
          res[key] = Normalize(res[key], normData);
          if (res[key].items != null) {
            Object.keys(res[key].items).forEach((subKey) => {
              res[key].items[subKey] = Normalize(res[key].items[subKey], normData);
            });
          }
        });
      }

      // smoothing
      if (state.vizOptionSmoothing > 1) {
        var labelSelector, carret, odd;

        if (state.vizOptionSmoothing % 2 === 0) {
          carret = state.vizOptionSmoothing / 2;
          labelSelector = carret;
          odd = false;
        } else {
          carret = (state.vizOptionSmoothing - 1) / 2;
          labelSelector = carret;
          odd = true;
        }

        Object.keys(res).forEach((key) => {
          var item = res[key].data;
          var keys = Object.keys(item);
          var nval = {};
          for (var i = 0; i < keys.length - state.vizOptionSmoothing; i++) {
            var dates = new Set();
            var sum = 0.0;
            for (var j = 0; j < state.vizOptionSmoothing; j++) {
              item[keys[i + j]].dates.forEach((d) => dates.add(d));

              if (!odd && (j === 0 || j + 1 === state.vizOptionSmoothing))
                sum += item[keys[i + j]].value * 0.5;
              else sum += item[keys[i + j]].value;
            }
            sum /= odd
              ? state.vizOptionSmoothing
              : state.vizOptionSmoothing - 1;
            nval[keys[i + labelSelector]] = {
              dates: dates,
              value: sum.toFixed(3),
            };
          }

          res[key].data = nval;
        });
      }
console.log(state.owid);console.log(res);
      state.vizData = res;
      state.version++;
    },
  },
  actions: {},
  modules: {},
});
