import { OwidLiveSearch } from "./OwidLiveSearch";
require("./DateHelper.js");

export class OwidLiveStorage {
  #OwidLiveSearches;
  #Norm;
  #Dates;
  #Total;

  /**
   * @param  {array} norm array from GET: owidAPI/norm
   */
  constructor(norm) {
    this.#Norm = norm;
    var dates = [];
    var sum = 0.0;
    Object.keys(norm[0]).forEach(function(key) {
      dates.push({ key });
      sum += norm[0][key];
    });

    this.#Dates = dates.sort();
    this.#Total = sum;
    this.#OwidLiveSearches = {};
  }

  /**
   * Returns the complete search history
   */
  get OwidLiveSearches() {
    return this.#OwidLiveSearches;
  }

  /**
   * Add a new search to the history storage
   * @param  {number} n of the N-Gram search
   * @param  {array} request the original search request
   * @param  {array} items the search responses
   */
  addOwidLiveSearchItem(n, request, items) {
    var x = new OwidLiveSearch(n, request, items);
    this.#OwidLiveSearches[x.Key] = x;
  }

  /**
   * Return all normalization data
   */
  get Norm() {
    return this.#Norm;
  }

  /**
   * Return all available dates
   */
  get Dates() {
    return this.#Dates;
  }

  /**
   * Return the total (in Token)
   */
  get Total() {
    return this.#Total;
  }

  /**
   * Return the relative total (in pro Mio. Token)
   */
  get NormTotal() {
    return this.#Total / 1000000.0;
  }

  /**
   * @param  {number} n Get the search history for N(-Gram). Used by components/Clipboard
   */
  GetSearchHistory(n) {
    var res = [];
    if (Object.keys(this.#OwidLiveSearches).length == 0) return res;

    Object.keys(this.#OwidLiveSearches).forEach((key) => {
      var current = this.#OwidLiveSearches[key];
      if (current.N === (n + 1)) res.push(key);
    });

    return res;
  }

  /**
   * @param  {string} key Get the specific table of the search (history) entry. Used by components/Clipboard
   */
  GetSearchHistoryItem(key, N) {
    var data = this.#OwidLiveSearches[key];
    var dates = this.Dates;    
    var normd = this.Norm;
    var total = this.Total;

    var res = [];
    data.OwidLiveStorageTimeItems.forEach(function(item) {
      var tokens = item.Key.split("µ");

      var d = Object.keys(item.Date).length;
      var s = 0;
      Object.keys(item.Date).forEach(key=>{
        s += item.Date[key].value;
      });

      var spark = [];
      var sparkNorm = [];
      for (var i in normd[N]) {
        console.log(i);
        var v = i in item.Date ? item.Date[i] : 0;
        spark.push(v);
        sparkNorm.push(Math.round((v / normd[N][i]) * 1000000.0));
      }
console.log(item.Date);
      res.push({
        key: item.Key,

        w: tokens[0],
        l: tokens[1],
        p: tokens[2],

        d: d,
        dRel: ((d / dates.length) * 100.0).toFixed(2),
        s: s,
        sRel: ((s / total) * 1000000.0).toFixed(2),
        spark: spark,
        sparkNorm: sparkNorm,
      });
    });

    return res;
  }

  /**
   * @param  {number} n get the norm date values for N(-Gram)
   */
  NormDate(n) {
    return this.#Norm[n];
  }

  /**
   * @param  {number} n get the norm weeks values for N(-Gram)
   */
  NormWeek(n) {
    return this.calculateGranulation(n, function(x) {
      return x.getYearWeek();
    });
  }

  /**
   * @param  {number} n get the norm month values for N(-Gram)
   */
  NormMonth(n) {
    return this.calculateGranulation(n, function(x) {
      return x.getMonth();
    });
  }

  /**
   * @param  {number} n get the norm quarters values for N(-Gram)
   */
  NormQuarter(n) {
    return this.calculateGranulation(n, function(x) {
      return x.getYearQuarter();
    });
  }

  /**
   * @param  {number} n get the norm years values for N(-Gram)
   */
  NormYear(n) {
    return this.calculateGranulation(n, function(x) {
      return x.getFullYear();
    });
  }

  /**
   * HELPER-Function: Used by NormDate, NormWeek, NormMonth, NormQuarter and NormYear (see above)
   * @param  {number} n N(-Gram)
   * @param  {function} func the functions needs to describe how-to find the dateTime-Key
   */
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
