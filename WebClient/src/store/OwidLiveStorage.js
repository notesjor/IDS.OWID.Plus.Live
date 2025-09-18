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
  #NMax = 3;
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
    var res = new OwidLiveStorage(norm);
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

    const dates = new Set();
    const total = [];
    const notal = [];

    norm.forEach((entry, index) => {
      let sum = 0;
      Object.entries(entry).forEach(([key, value]) => {
        if (index === 0) dates.add(key.substring(0, 10));
        sum += value;
      });
      total.push(sum);
      notal.push(sum / 1000000.0);
    });

    this.#Dates = Array.from(dates).sort();
    this.#LastDate = this.#Dates[this.#Dates.length - 1];
    this.#Total = total;
    this.#NormTotal = notal;
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
  clearAll() {
    this.#OwidLiveSearches.clear();
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
    if (Object.keys(this.#OwidLiveSearches).length === 0) return [];

    return Object.entries(this.#OwidLiveSearches)
      .filter(([, search]) => search.N === this.#N)
      .sort(([, a], [, b]) => b.TimeStamp - a.TimeStamp)
      .map(([key]) => key);
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

    return data.OwidLiveStorageTimeItems.map((item) => {
      const tokens = item.Key.split("µ");
      const w = tokens[0];
      const l = tokens[1] || null;
      const p = tokens[2] || null;

      // Precompute keys and values for item.Date
      const dateKeys = Object.keys(item.Date);
      const d = dateKeys.length;
      let s = 0;
      for (let i = 0; i < dateKeys.length; i++) {
        s += item.Date[dateKeys[i]].value;
      }

      // Precompute sparkNorm array
      const sparkNorm = [];
      for (const i in normd) {
        const v = item.Date[i]?.value || 0;
        // Only push if normd[i] is not zero to avoid division by zero
        sparkNorm.push(normd[i] ? Math.round((v / normd[i]) * 1000000.0) : 0);
      }

      // Build korap string efficiently
      const korap = w
        .split(" ")
        .map((ws) => `[orth=${ws}/i]`)
        .join(" ");

      return {
        key: item.Key,
        w,
        l,
        p,
        d,
        dRel: ((d / dates.length) * 100.0).toFixed(5),
        s,
        sRel: ((s / total) * 1000000.0).toFixed(5),
        sparkNorm,
        korap,
        checked: item.IsSelected,
      };
    });
  }

  #funcDate = function (x) {
    return (
      x.getFullYear() +
      "-" +
      (x.getMonth() + 1).pad(2) +
      "-" +
      x.getDate().pad(2)
    );
  };

  #funcWeek = function (x) {
    return x.getYearWeek();
  };

  #funcMonth = function (x) {
    return x.getFullYear() + "-" + x.getMonth().pad(2);
  };

  #funcQuarter = function (x) {
    return x.getYearQuarter();
  };

  #funcYear = function (x) {
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
    const res = new Map();
    for (const [date, value] of Object.entries(this.#Norm[this.#N - 1])) {
      const key = func(new Date(date));
      res.set(key, (res.get(key) || 0) + value);
    }
    return Object.fromEntries(res);
  }

  /**
   * HELPER-Function: Used by NormDate, NormWeek, NormMonth, NormQuarter and NormYear (see above)
   * @param  {function} func the functions needs to describe how-to find the dateTime-Key
   */
  calculateDateGranulation(func) {
    return this.#Dates.map((date) => func(new Date(date)));
  }
}
