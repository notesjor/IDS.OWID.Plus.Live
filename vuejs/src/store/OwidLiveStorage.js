import { OwidLiveSearch } from "./OwidLiveSearch";
require("./DateHelper.js");

export class OwidLiveStorage {
  #OwidLiveSearches;
  #Norm;
  #Dates;
  #Total;

  constructor(norm) {
    this.#Norm = norm;
    this.#Dates = [];
    var sum = 0.0;
    Object.keys(norm[0]).forEach(function(key) {
      this.#Dates.push({ key });
      sum += norm[0][key];
    });
    this.#Total = sum;
    this.#OwidLiveSearches = {};
  }

  get OwidLiveSearches() {
    return this.#OwidLiveSearches;
  }

  addOwidLiveSearchItem(n, request, items) {
    var x = new OwidLiveSearch(n, request, items);
    this.#OwidLiveSearches[n.Key] = x;
    this.DetailKey(n.Key);
  }

  get Norm() {
    return this.#Norm;
  }

  get Dates() {
    return this.#Dates;
  }

  get Total() {
    return this.#Total;
  }

  get NormTotal() {
    return this.#Total / 1000000.0;
  }

  GetSearchHistory(n) {
    var res = [];
    this.#OwidLiveSearches.forEach((key) => {
      var current = this.#OwidLiveSearches[key];
      if (current.N === n) res.push(current);
    });
    return res;
  }

  GetSearchHistoryItem(key){
    var data = this.#OwidLiveSearches[key];

    var res = [];
    Object.keys(data.OwidLiveStorageItems).forEach(function(key) {
      var tokens = key.split("µ");

      var dates = this.#OwidLiveSearches[key];
      var norm = this.NormDates;

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

      res.push({
        key: key,

        w: tokens[0],
        l: tokens[1],
        p: tokens[2],

        d: d,
        dRel: ((d / this.Dates.length) * 100.0).toFixed(2),
        s: s,
        sRel: (s / this.NormTotal).toFixed(2),
        spark: spark,
        sparkNorm: sparkNorm,
      });
    });

    return res;
  }

  NormDates(n) {
    return this.#Norm[n];
  }

  NormWeeks(n) {
    return this.calculateGranulation(n, function(x) {
      return x.getYearWeek();
    });
  }

  NormMonth(n) {
    return this.calculateGranulation(n, function(x) {
      return x.getMonth();
    });
  }

  NormQuarter(n) {
    return this.calculateGranulation(n, function(x) {
      return x.getYearQuarter();
    });
  }

  NormYear(n) {
    return this.calculateGranulation(n, function(x) {
      return x.getFullYear();
    });
  }

  calculateGranulation(n, func) {
    var dates = this.#Norm[n];
    var res = {};
    dates.forEach((d) => {
      var key = func(d);
      if (key in res) res[key] += dates[d];
      else res[key] = dates[d];
    });
    return res;
  }
}
