import Vue from "vue";
import Vuex from "vuex";
import * as echarts from "echarts"; // TODO: REMOVE

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

// SOURCE: https://weeknumber.net/how-to/javascript >>>
Date.prototype.getWeek = function() {
  this.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  this.setDate(this.getDate() + 3 - ((this.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(this.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((this.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};
// <<<

Date.prototype.getYearWeek = function() {
  return this.getFullYear() + "-" + this.getWeek().pad(2);
};
Date.prototype.getYearQuarter = function() {
  return this.getFullYear() + "-" + (Math.floor(this.getMonth() / 3) + 1);
};

class OwidLiveStorageTimeItem {
  #Key;
  #Dates;
  #IsSelected;  

  constructor(key, dates) {
    this.#Key = key;
    this.#Dates = dates;
    this.#IsSelected = true;
  }

  get Key() {
    return this.#Key;
  }

  get Dates() {
    return this.#IsSelected ? this.#Dates : null;
  }

  get IsSelected() {
    return this.#IsSelected;
  }

  set IsSelected(bool) {
    if (typeof bool === "boolean") this.#IsSelected = bool;
  }

  get Weeks() {
    return this.#IsSelected
      ? this.calculateGranulation(function(x) {
          return x.getYearWeek();
        })
      : null;
  }

  get Month() {
    return this.#IsSelected
      ? this.calculateGranulation(function(x) {
          return x.getMonth();
        })
      : null;
  }

  get Quarter() {
    return this.#IsSelected
      ? this.calculateGranulation(function(x) {
          return x.getYearQuarter();
        })
      : null;
  }

  get Year() {
    return this.#IsSelected
      ? this.calculateGranulation(function(x) {
          return x.getFullYear();
        })
      : null;
  }

  calculateGranulation(func) {
    var dates = this.Dates();
    var res = {};
    dates.forEach((d) => {
      var key = func(d);
      if (key in res) res[key] += dates[d];
      else res[key] = dates[d];
    });
    return res;
  }
}

class OwidLiveSearchItems {
  #N;
  #Key;
  #Request;
  #OwidLiveStorageTimeItems;
  #IsSelected;

  constructor(n, request, items) {
    this.#N = n;
    this.#Request = request;

    var key = "";
    request.forEach((x) => {
      key += x.toString();
    });
    this.#Key = key.trim();

    this.#Request = request;
    this.#OwidLiveStorageTimeItems = items;
    this.#IsSelected = true;
  }

  get N() {
    return this.#N;
  }

  get Key() {
    return this.#Key;
  }

  get OwidLiveStorageItems() {
    return this.#OwidLiveStorageTimeItems;
  }

  get IsSelected() {
    return this.#IsSelected;
  }

  set IsSelected(bool) {
    if (typeof bool === "boolean") this.#IsSelected = bool;
  }
}

class OwidLiveStorage {
  #OwidLiveSearchItems;

  constructor() {
    this.#OwidLiveSearchItems = {};
  }

  get OwidLiveSearchItems() {
    return this.#OwidLiveSearchItems;
  }

  addOwidLiveSearchItem(item) {}
}

Vue.use(Vuex);

function avgFloat(serie) {
  serie = null;
  if (serie === null) return null;
}

export default new Vuex.Store({
  state: {
    baseUrl: "http://81.30.156.64:9731",
    status: "init",

    norm: null,
    dates: null,

    sumTotal: 0,
    normTotal: 0,

    owidStorage: new OwidLiveStorage(),

    current: null,
    currentN: 0,
    currentGrid: null,
    currentGridSelect: [],

    vizOptionRelative: true,
    vizOptionGranulatioon: 1,
    vizOptionSmoothing: 7,

    stored: null,

    result: null,
    resultSeries: null,
    resultCalendar: null,

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

    updateStatus(state, status) {
      Vue.set(state, "status", status);
    },

    search(state, { n, items }) {
      state.currentN = n;
      state.current = items;

      state.currentGrid = [];
      Object.keys(state.current).forEach(function(key) {
        var tokens = key.split("µ");

        var dates = state.current[key];
        var norm = state.norm[state.currentN];

        var d = Object.keys(dates).length;
        var s = Object.values(dates).reduce((a, b) => a + b);

        var spark = [];
        var sparkNorm = [];
        for (var i in norm) {
          var n = norm[i];
          var v = i in dates ? dates[i] : 0;
          spark.push(v);
          sparkNorm.push(Math.round((v / n) * 1000000.0));
        }

        state.currentGrid.push({
          key: key,

          w: tokens[0],
          l: tokens[1],
          p: tokens[2],

          d: d,
          dRel: ((d / state.dates.length) * 100.0).toFixed(2),
          s: s,
          sRel: (s / state.normTotal).toFixed(2),
          spark: spark,
          sparkNorm: sparkNorm,
        });
      });
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
