import { granulateKey } from "./DateHelper.js";

export class OwidLiveStorageTimeItem {
  #Key;
  #Token;
  #Name;
  #Label;
  #Dates;
  #IsSelected;
  #Cache = {};

  toJSON() {
    return {
      Key: this.#Key,
      Token: this.#Token,
      Name: this.#Name,
      Dates: this.#Dates,
      IsSelected: this.#IsSelected,
    };
  }

  static load(obj) {
    var res = new OwidLiveStorageTimeItem("?µ?µ?", null);
    res.#Key = obj.Key;
    res.#Token = obj.Token;
    res.#Name = obj.Name;
    res.#Label = obj.Key.split("µ").join(" | ");
    res.#Dates = obj.Dates;
    res.#IsSelected = obj.IsSelected;
    return res;
  }

  /**
   * @param  {string} key the key of the search-result
   * @param  {array} dates all matched dates
   */
  constructor(key, dates) {
    this.#Key = key;
    this.#Token = key.split("µ");
    this.#Name = key.split("µ")[0];
    this.#Label = key.split("µ").join(" | ");
    this.#Dates = dates;
    this.#IsSelected = true;
  }

  /**
   * The key of the search-result
   */
  get Key() {
    return this.#Key;
  }

  /**
   * Token based on Key
   */
  get Token() {
    return this.#Token;
  }

  /**
   * Name based on Key
   */
  get Name() {
    return this.#Name;
  }

  /**
   * The label of the search-result
   */
  get Label() {
    return this.#Label;
  }

  /**
   * All matched dates
   */
  get Date() {
    return this.#IsSelected
      ? this.calculateGranulation("Date", function (x) {
          return (
            x.getFullYear() +
            "-" +
            (x.getMonth() + 1).pad(2) +
            "-" +
            x.getDate().pad(2)
          );
        })
      : null;
  }

  /**
   * Is this timeItem selected for visualization?
   */
  get IsSelected() {
    return this.#IsSelected;
  }

  /**
   * @param  {boolean} bool select for visualization?
   */
  set IsSelected(bool) {
    if (typeof bool === "boolean") this.#IsSelected = bool;
  }

  /**
   * All matched weeks
   */
  get Week() {
    return this.#IsSelected
      ? this.calculateGranulation("Week", function (x) {
          return x.getYearWeek();
        })
      : null;
  }

  /**
   * All matched month
   */
  get Month() {
    return this.#IsSelected
      ? this.calculateGranulation("Month", function (x) {
          return x.getFullYear() + "-" + x.getMonth().pad(2);
        })
      : null;
  }

  /**
   * All matched quarter
   */
  get Quarter() {
    return this.#IsSelected
      ? this.calculateGranulation("Quarter", function (x) {
          return x.getYearQuarter();
        })
      : null;
  }

  /**
   * All matched years
   */
  get Year() {
    return this.#IsSelected
      ? this.calculateGranulation("Year", function (x) {
          return x.getFullYear();
        })
      : null;
  }

  /**
   * HELPER-Function: Used by Weeks, Month, Quarter and Year
   * @param  {function} func the function describes how-to group the dates
   */
  calculateGranulation(kind, func) {
    // Ergebnis ist unveränderlich (Dates ändern sich nie) -> einmal berechnen, dann wiederverwenden
    const cached = this.#Cache[kind];
    if (cached !== undefined) return cached;
    const res = {};
    for (const [key, value] of Object.entries(this.#Dates)) {
      const granulatedKey = granulateKey(kind, func, key);
      if (!res[granulatedKey]) {
        res[granulatedKey] = { dates: new Set(), value: 0 };
      }
      res[granulatedKey].value += value;
      res[granulatedKey].dates.add(key);
    }
    this.#Cache[kind] = res;
    return res;
  }
}
