import { OwidLiveSearch } from "./OwidLiveSearch";
import "./DateHelper.js";

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

  get OwidLiveSearches() {
    return this.#OwidLiveSearches;
  }

  selectSearchItems(selection) {
    var set = new Set(selection);
    Object.keys(this.#OwidLiveSearches).forEach((key) => {
      this.#OwidLiveSearches[key].IsSelected = set.has(key);
    });
  }

  selectSearchHistoryItem(selection) {
    Object.keys(this.#OwidLiveSearches).forEach((key) => {
      this.#OwidLiveSearches[key].SelectOwidLiveStorageTimeItems(selection);
    });
  }

  addOwidLiveSearchItem(n, request, items) {
    var x = new OwidLiveSearch(n, request, items);
    this.#OwidLiveSearches[x.Key] = x;
  }

  clearAll() {
    this.#OwidLiveSearches = {};
  }

  get Norm() {
    return this.#Norm;
  }

  get LastDate() {
    return this.#LastDate === null ? "" : this.#LastDate;
  }

  get Dates() {
    return this.#Granulation;
  }

  set Dates(granulation) {
    this.#Granulation = granulation;
  }

  get N() {
    return this.#N;
  }

  set N(n) {
    this.#N = n;
  }

  get Total() {
    return this.#Total;
  }

  get NormTotal() {
    return this.#NormTotal;
  }

  GetSearchHistory() {
    if (Object.keys(this.#OwidLiveSearches).length === 0) return [];

    return Object.entries(this.#OwidLiveSearches)
      .filter(([, search]) => search.N === this.#N)
      .sort(([, a], [, b]) => b.TimeStamp - a.TimeStamp)
      .map(([key]) => key);
  }

  GetSearchHistoryItemRequest(key) {
    return this.#OwidLiveSearches[key].Request;
  }

  GetSearchHistoryItem4export(key) {
    return this.#OwidLiveSearches[key];
  }

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

      const dateKeys = Object.keys(item.Date);
      const d = dateKeys.length;
      let s = 0;
      for (let i = 0; i < dateKeys.length; i++) {
        s += item.Date[dateKeys[i]].value;
      }

      const sparkNorm = [];
      for (const i in normd) {
        const v = item.Date[i]?.value || 0;
        sparkNorm.push(normd[i] ? Math.round((v / normd[i]) * 1000000.0) : 0);
      }

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
    return x.getFullYear() + "-" + (x.getMonth() + 1).toString().padStart(2, "0") + "-" + x.getDate().toString().padStart(2, "0");
  };

  #funcWeek = function (x) {
    return x.getYearWeek();
  };

  #funcMonth = function (x) {
    return x.getFullYear() + "-" + (x.getMonth() + 1).toString().padStart(2, "0");
  };

  #funcQuarter = function (x) {
    return x.getYearQuarter();
  };

  #funcYear = function (x) {
    return x.getFullYear();
  };

  get DatesDate() {
    return this.calculateDateGranulation(this.#funcDate);
  }

  get NormDate() {
    return this.calculateGranulation(this.#funcDate);
  }

  get DatesWeek() {
    return this.calculateDateGranulation(this.#funcWeek);
  }

  get NormWeek() {
    return this.calculateGranulation(this.#funcWeek);
  }

  get DatesMonth() {
    return this.calculateDateGranulation(this.#funcMonth);
  }

  get NormMonth() {
    return this.calculateGranulation(this.#funcMonth);
  }

  get DatesQuarter() {
    return this.calculateDateGranulation(this.#funcQuarter);
  }

  get NormQuarter() {
    return this.calculateGranulation(this.#funcQuarter);
  }

  get DatesYear() {
    return this.calculateDateGranulation(this.#funcYear);
  }

  get NormYear() {
    return this.calculateGranulation(this.#funcYear);
  }

  calculateGranulation(func) {
    const res = new Map();
    for (const [date, value] of Object.entries(this.#Norm[this.#N - 1])) {
      const key = func(new Date(date));
      res.set(key, (res.get(key) || 0) + value);
    }
    return Object.fromEntries(res);
  }

  calculateDateGranulation(func) {
    return this.#Dates.map((date) => func(new Date(date)));
  }
}
