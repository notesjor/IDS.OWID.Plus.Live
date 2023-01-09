import { OwidLiveSearch } from "./OwidLiveSearch";
require("./DateHelper.js");

export class OwidLiveStorage {
  #OwidLiveSearches;
  #Norm;
  #Dates;
  #LastDate;
  #Total;
  #NormTotal;
  #N;
  #Granulation;
  #AvailableYears;

  toJSON() {
    return {
      Dates: this.#Dates,
      N: this.#N,
      Norm: this.#Norm,
      OwidLiveSearches: this.#OwidLiveSearches,
      Total: this.#Total,
      NormTotal: this.#NormTotal,
    };
  }

  static load(norm, ols, n, dates, total, ntotal) {
    var res = new OwidLiveStorage([]);
    res.#Norm = norm;
    res.#OwidLiveSearches = {};
    Object.keys(ols).forEach((x) => {
      res.#OwidLiveSearches[x] = OwidLiveSearch.load(ols[x]);
    });
    res.#N = n;
    res.#Dates = dates;
    res.#Total = total;
    res.#NormTotal = ntotal;
    return res;
  }

  /**
   * @param  {array} norm array from GET: owidAPI/norm
   */
  constructor(norm) {
    this.#Norm = norm;
    this.#OwidLiveSearches = {};
    this.#N = 1;

    var dates = [];
    var total = [];
    var notal = [];
    for (var n = 0; n < norm.length; n++) {
      if (n === 0)
        Object.keys(norm[0]).forEach(function(key) {
          dates.push(key.substring(0, 10));
        });

      var sum = 0.0;
      Object.keys(norm[n]).forEach(function(key) {
        sum += norm[n][key];
      });
      total.push(sum);
      notal.push(sum / 1000000.0);
    }

    this.#Dates = dates.sort();
    this.#LastDate = this.#Dates[this.#Dates.length - 1];
    this.#Total = total;
    this.#NormTotal = notal;

    var years = new Set();
    Object.keys(norm[0]).forEach(k=> years.add(k.substring(0,4)));
    this.#AvailableYears = Array.from(years);
    this.#AvailableYears.sort();
  }

  /**
   * Returns the complete search history
   */
  get OwidLiveSearches() {
    return this.#OwidLiveSearches;
  }

  /**
   * (Un-)Selects all OwidLiveSearches
   * @param  {arry} selection all listed items will be selected - other: unselected
   */
  selectSearchItems(selection) {
    var set = new Set(selection);
    Object.keys(this.#OwidLiveSearches).forEach((key) => {
      this.#OwidLiveSearches[key].IsSelected = set.has(key);
    });
  }

  /**
   * (Un-)Selects all OwidLiveStorageTimeItems
   * @param  {arry} selection all listed items will be selected - other: unselected
   */
  selectSearchHistoryItem(selection) {
    Object.keys(this.#OwidLiveSearches).forEach((key) => {
      this.#OwidLiveSearches[key].SelectOwidLiveStorageTimeItems(selection);
    });
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
   * Delete all searches
   */
  clearAll(){
    this.#OwidLiveSearches = {};
  }

  /**
   * An array of all available years
   */
  get AvailableYears(){
    return this.#AvailableYears;
  }

  /**
   * Return all normalization data
   */
  get Norm() {
    return this.#Norm;
  }

  /**
   * Return the last date
   */
  get LastDate() {
    return this.#LastDate === null ? "" : this.#LastDate;
  }

  /**
   * Return all available dates
   */
  get Dates() {
    return this.#Granulation;
  }

  /**
   * Set the current granulation
   */
  set Dates(granulation) {
    this.#Granulation = granulation;
  }

  /**
   * Return the current N(-gram)
   */
  get N() {
    return this.#N;
  }

  /**
   * @param  {number} n set the current N(-gram)
   */
  set N(n) {
    this.#N = n;
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
    return this.#NormTotal;
  }

  /**
   * Get the search history for N(-Gram). Used by components/Clipboard
   */
  GetSearchHistory() {
    var tmp = [];
    if (Object.keys(this.#OwidLiveSearches).length == 0) return res;

    Object.keys(this.#OwidLiveSearches).forEach((key) => {
      var current = this.#OwidLiveSearches[key];
      if (current.N === this.#N) tmp.push({key: key, date: current.TimeStamp});
    });

    tmp.sort(function(a,b){
      return b.date - a.date;
    });

    var res = [];
    tmp.forEach(x=>{
      res.push(x.key);
    });
  
    return res;
  }

  /**
   * @param  {string} key Get the request of the HistoryItem
   */
  GetSearchHistoryItemRequest(key) {
    return this.#OwidLiveSearches[key].Request;
  }

  /**
   * @param  {string} key Get the raw the HistoryItem (for export only)
   */
  GetSearchHistoryItem4export(key) {
    return this.#OwidLiveSearches[key];
  }

  /**
   * @param  {string} key Get the specific table of the search (history) entry. Used by components/Clipboard
   * @param  {number} granulation Set the granulation for calculation (0=day, 1=week, 2=month, 3=quarter, 4=year)
   */
  GetSearchHistoryItem(key, granulation) {
    var data = this.#OwidLiveSearches[key];
    var dates = this.#Dates;
    var total = this.#Total[this.#N - 1];
    var normd = null;
    switch (granulation) {
      case 1:
        normd = this.NormWeek;
        break;
      case 2:
        normd = this.NormMonth;
        break;
      case 3:
        normd = this.NormQuarter;
        break;
      case 4:
        normd = this.NormYear;
        break;
      default:
        normd = this.NormDate;
        break;
    }

    var res = [];
    data.OwidLiveStorageTimeItems.forEach(function(item) {
      var tokens = item.Key.split("µ");

      var d = Object.keys(item.Date).length;
      var s = 0;
      Object.keys(item.Date).forEach((key) => {
        s += item.Date[key].value;
      });

      var sparkNorm = [];
      for (var i in normd) {
        var v = i in item.Date ? item.Date[i].value : 0;  
        sparkNorm.push(Math.round((v / normd[i] * 1000000.0), 0));
      }      

      var wS = tokens[0].split(" ");
      var pS = tokens[2].split(" ");

      var korap = "";
      for (let i = 0; i < wS.length; i++) {
        korap += `[orth=${wS[i]}/i & pos=${pS[i]}] `;
      }

      console.log(korap);

      res.push({
        key: item.Key,

        w: tokens[0],
        l: tokens[1],
        p: tokens[2],

        d: d,
        dRel: ((d / dates.length) * 100.0).toFixed(5),
        s: s,
        sRel: ((s / total) * 1000000.0).toFixed(5),
        sparkNorm: sparkNorm,

        korap: korap.trim(),

        checked: item.IsSelected,
      });
    });

    return res;
  }

  #funcDate = function(x) {
    return (
      x.getFullYear() +
      "-" +
      (x.getMonth() + 1).pad(2) +
      "-" +
      x.getDate().pad(2)
    );
  };

  #funcWeek = function(x) {
    return x.getYearWeek();
  };

  #funcMonth = function(x) {
    return x.getFullYear() + "-" + x.getMonth().pad(2);
  };

  #funcQuarter = function(x) {
    return x.getYearQuarter();
  };

  #funcYear = function(x) {
    return x.getFullYear();
  };

  /**
   * get a date array (day based)
   */
  get DatesDate() {
    return this.calculateDateGranulation(this.#funcDate);
  }

  /**
   * get the norm date values for N(-Gram)
   */
  get NormDate() {
    return this.calculateGranulation(this.#funcDate);
  }

  /**
   * get a date array (week based)
   */
  get DatesWeek() {
    return this.calculateDateGranulation(this.#funcWeek);
  }

  /**
   * get the norm weeks values for N(-Gram)
   */
  get NormWeek() {
    return this.calculateGranulation(this.#funcWeek);
  }

  /**
   * get a date array (month based)
   */
  get DatesMonth() {
    return this.calculateDateGranulation(this.#funcMonth);
  }

  /**
   * get the norm month values for N(-Gram)
   */
  get NormMonth() {
    return this.calculateGranulation(this.#funcMonth);
  }

  /**
   * get a date array (quarter based)
   */
  get DatesQuarter() {
    return this.calculateDateGranulation(this.#funcQuarter);
  }

  /**
   * get the norm quarters values for N(-Gram)
   */
  get NormQuarter() {
    return this.calculateGranulation(this.#funcQuarter);
  }

  /**
   * get a date array (year based)
   */
  get DatesYear() {
    return this.calculateDateGranulation(this.#funcYear);
  }

  /**
   * get the norm years values for N(-Gram)
   */
  get NormYear() {
    return this.calculateGranulation(this.#funcYear);
  }

  /**
   * HELPER-Function: Used by NormDate, NormWeek, NormMonth, NormQuarter and NormYear (see above)
   * @param  {function} func the functions needs to describe how-to find the dateTime-Key
   */
  calculateGranulation(func) {
    var dates = this.#Norm[this.#N - 1];
    var res = {};
    Object.keys(dates).forEach((d) => {
      var key = func(new Date(d));
      if (key in res) res[key] += dates[d];
      else res[key] = dates[d];
    });
    return res;
  }

  /**
   * HELPER-Function: Used by NormDate, NormWeek, NormMonth, NormQuarter and NormYear (see above)
   * @param  {function} func the functions needs to describe how-to find the dateTime-Key
   */
  calculateDateGranulation(func) {
    var res = [];
    Object.keys(this.#Dates).forEach((d) => {      
      res.push(func(new Date(this.#Dates[d])));
    });
    return res;
  }
}
