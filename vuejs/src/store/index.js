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
    init(state) {
      norm = [];

      // N1
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
          state.norm.push(JSON.parse(this.responseText));
        }
      });

      xhr.open("GET", state.baseUrl + "/norm?n=1");
      xhr.send();

      // N2
      xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
          state.norm.push(JSON.parse(this.responseText));
        }
      });

      xhr.open("GET", state.baseUrl + "/norm?n=2");
      xhr.send();

      // N3
      xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
          state.norm.push(JSON.parse(this.responseText));
        }
      });

      xhr.open("GET", state.baseUrl + "/norm?n=3");
      xhr.send();
    },

    search(state, { n, queryItems }) {
      state.currentN = n;

      var data = JSON.stringify({
        N: n,
        Items: queryItems,
      });

      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
          var xhr2 = new XMLHttpRequest();
          xhr2.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
              state.current = JSON.parse(this.responseText);
            }
          });

          xhr2.open("POST", state.baseUrl + "/pull");
          xhr2.setRequestHeader("Content-Type", "application/json");

          xhr2.send(this.responseText);
        }
      });

      xhr.open("POST", state.baseUrl + "/find");
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.send(data);
    },

    store(state) {
      if (state.stored == null) state.stored = [state.current];
      else state.stored.push(state.current);
    },

    calculate(state) {
      state.result = state.current; // TODO: Merge mit stored

      state.resultGrid = [];
      Object.keys(state.result).forEach(function(key) {
        var tokens = key.split("µ");
        var dates = state.result[key];

        state.resultGrid.push({
          w: tokens[0],
          l: tokens[1],
          p: tokens[2],

          d: dates.length,
          
        });
      });
    },
  },
  actions: {},
  modules: {},
});
