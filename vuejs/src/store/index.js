import Vue from "vue";
import Vuex from "vuex";
import { OwidLiveStorage } from "./OwidLiveStorage";
import { Normalize } from "./DataHelper";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sessionKey: null,
    
    owid: null,
    version: 0,
    searches: 0,

    vizNoCommit: 0,
    vizOptionRelative: true,
    vizOptionGranulation: 0,
    vizOptionSmoothing: 7,    

    vizViewportWidth: 1200,
    vizViewportHeight: 500,

    vizData: null,
  },
  mutations: {
    id(state, id) {
      state.sessionKey = id;
    },

    init(state, payload) {
      state.owid = new OwidLiveStorage(payload);
    },

    clearAll(state) {
      state.owid.clearAll();
    },

    updateViewport(state, { w, h }) {
      state.vizViewportWidth = (w / 110) * 100;
      state.vizViewportHeight = h;
    },

    updateN(state, N) {
      state.owid.N = N;
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

    selectSearchChange(state, payload) {
      state.owid.selectSearchItems(payload);
    },

    selectSearchHistoryItemsChange(state, payload) {
      state.owid.selectSearchHistoryItem(payload);
    },

    modelLoad(state, o) {
      state.owid = OwidLiveStorage.load(
        o.Norm,
        o.OwidLiveSearches,
        o.N,
        o.Dates,
        o.Total,
        o.NormTotal
      );
    },

    calculate(state) {      
      if (state.owid === null || state.owid.OwidLiveSearches === null) {
        state.vizData = null;
        return;
      }

      state.vizData = {};
      var res = {};

      // Set Granulation
      switch (state.vizOptionGranulation) {
        case 1:
          state.owid.Dates = state.owid.DatesWeek;
          break;
        case 2:
          state.owid.Dates = state.owid.DatesMonth;
          break;
        case 3:
          state.owid.Dates = state.owid.DatesQuarter;
          break;
        case 4:
          state.owid.Dates = state.owid.DatesYear;
          break;
        default:
          state.owid.Dates = state.owid.DatesDate;
          break;
      }

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

          subItems[item.Label] = {
            name: item.Name,
            label: item.Label,
            data: sitem,
            items: null,
          };
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
          res[search.Name] = {
            name: search.Name,
            label: search.Label,
            data: sgrp,
            items: subItems,
          };
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
              res[key].items[subKey] = Normalize(
                res[key].items[subKey],
                normData
              );
            });
          }
        });
      }
      
      // smoothing
      if (state.vizOptionSmoothing > 1) {
        var carret, odd;

        if (state.vizOptionSmoothing % 2 === 0) {
          carret = parseInt((state.vizOptionSmoothing / 2).toFixed(0));
          odd = false;
        } else {
          carret = parseInt(((state.vizOptionSmoothing - 1) / 2).toFixed(0));
          odd = true;
        }

        Object.keys(res).forEach((key) => {
          var item = res[key].data;
          var keys = state.owid.Dates;
          var nval = {};
          for (var i = carret; i < keys.length - carret; i++) {
            var dates = new Set();
            var sum = 0.0;
            for (var j = 0 - carret; j <= carret; j++) {
              item[keys[i + j]].dates.forEach((d) => dates.add(d));

              if(!(keys[i + j] in item))
                continue;

              if (!odd && (j === 0 - carret || j === carret))
                sum += item[keys[i + j]].value * (1.0 / state.vizOptionSmoothing / 2.0);
              else sum += item[keys[i + j]].value * (1.0 / state.vizOptionSmoothing);
            }

            nval[keys[i]] = {
              dates: dates,
              value: parseFloat(sum.toFixed(3)),
            };
          }

          res[key].data = nval;
        });
      }
      
      state.vizData = res;
      state.version++;
    },
  },
  actions: {},
  modules: {},
});
