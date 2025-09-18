import Vue from "vue";
import Vuex from "vuex";
import { OwidLiveStorage } from "./OwidLiveStorage";
import { Normalize, Prefill } from "./DataHelper";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    years: [],
    yearMin: 0,
    yearMax: 0,
    yearInc: 0,
    yearFocus: 2024,

    owid: null,
    version: 0,
    searches: 0,

    vizNoCommit: 0,
    vizOptionRelative: true,
    vizOptionGranulation: 0,
    vizOptionSmoothing: 16,

    vizData: null,
  },
  mutations: {
    years(state, years) {
      state.years = years;
      state.yearMin = Math.min(...years);
      state.yearMax = Math.max(...years);
      state.yearInc = -1;
    },

    focusYear(state, year) {
      state.yearFocus = year;
    },

    init(state, payload) {
      state.owid = new OwidLiveStorage(payload);
    },

    clearAll(state) {
      state.owid.clearAll();
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
      state.owid = OwidLiveStorage.load(o.Norm, o.OwidLiveSearches, o.N, o.Dates, o.Total, o.NormTotal);
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
      // relativ Frquency      
      if (state.vizOptionRelative) {
        Object.keys(res).forEach((key) => {
          res[key] = Normalize(res[key], normData);
          if (res[key].items != null) {            
            Object.keys(res[key].items).forEach((subKey) => {
              res[key].items[subKey] = Normalize(res[key].items[subKey], normData);
            });
          }
        });
      }
      // absolute Frequenz (auffüllen von Leerdaten)
      else {
        Object.keys(res).forEach((key) => {
          res[key] = Prefill(res[key], normData);
          if (res[key].items != null) {
            Object.keys(res[key].items).forEach((subKey) => {
              res[key].items[subKey] = Prefill(res[key].items[subKey], normData);
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

        var halfVOS = state.vizOptionSmoothing * 2.0;

        var warnings = new Set();
        Object.keys(res).forEach((key) => {
          const item = res[key].data;
          const keys = state.owid.Dates;
          const nval = {};
          const keysLength = keys.length; 

          for (let i = carret; i < keysLength - carret; i++) {
            const dates = new Set();
            let sum = 0.0;

            for (let j = -carret; j <= carret; j++) {
              const currentKey = keys[i + j];
              if (!item[currentKey]) continue;

              item[currentKey].dates.forEach((d) => dates.add(d));

                if (odd || (j !== -carret && j !== carret)) {
                sum += item[currentKey].value * (1.0 / state.vizOptionSmoothing);
                } else {
                sum += item[currentKey].value * (1.0 / halfVOS);
                }
            }

            nval[keys[i]] = {
              dates: dates,
              value: parseFloat(sum.toFixed(5)),
            };
          }

          res[key].data = nval;
        });

        if(warnings.size > 0)
          {
            console.log(">>> WARN: missing norm-data:"); 
            warnings.forEach(w => {
              console.log(w);
            });
            console.log("<<< WARN: missing norm-data (END)");
          }
      }

      state.vizData = res;
      state.version++;
    },
  },
  actions: {},
  modules: {},
});
