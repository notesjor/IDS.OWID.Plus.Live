export class OwidLiveStorageTimeItem {
  #Key;
  #Token;
  #Name;
  #Label;
  #Dates;
  #IsSelected;

  toJSON(){
    return {
      Key: this.#Key,
      Token: this.#Token,
      Name: this.#Name,
      Dates: this.#Dates,
      IsSelected: this.#IsSelected
    }
  }

  static load(obj) {
    const res = new OwidLiveStorageTimeItem(obj.Key, null);
    const tokens = obj.Key.split("µ");
    res.#Key = obj.Key;
    res.#Token = tokens;
    res.#Name = tokens[0];
    res.#Label = tokens.join(" | ");
    res.#Dates = obj.Dates;
    res.#IsSelected = obj.IsSelected;
    return res;
  }

  /**
   * @param  {string} key the key of the search-result
   * @param  {array} dates all matched dates
   */
  constructor(key, dates) {
    const tokens = key.split("µ");
    this.#Key = key;
    this.#Token = tokens;
    this.#Name = tokens[0];
    this.#Label = tokens.join(" | ");
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
    if (!this.#IsSelected) return null;

    const formatter = new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return this.calculateGranulation((x) => formatter.format(x));
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
      ? this.calculateGranulation(function(x) {
          return x.getYearWeek();
        })
      : null;
  }

  /**
   * All matched month
   */
  get Month() {
    return this.#IsSelected
      ? this.calculateGranulation(function(x) {
          return x.getFullYear() + "-" + x.getMonth().pad(2);
        })
      : null;
  }

  /**
   * All matched quarter
   */
  get Quarter() {
    return this.#IsSelected
      ? this.calculateGranulation(function(x) {
          return x.getYearQuarter();
        })
      : null;
  }

  /**
   * All matched years
   */
  get Year() {
    return this.#IsSelected
      ? this.calculateGranulation(function(x) {
          return x.getFullYear();
        })
      : null;
  }

  /**
   * HELPER-Function: Used by Weeks, Month, Quarter and Year
   * @param  {function} func the function describes how-to group the dates
   */
  calculateGranulation(func) {
    return Object.keys(this.#Dates).reduce((res, k) => {
      const d = new Date(k);
      const key = func(d);
      if (res[key]) {
        res[key].value += this.#Dates[k];
        res[key].dates.add(k);
      } else {
        res[key] = { dates: new Set([k]), value: this.#Dates[k] };
      }
      return res;
    }, {});
  }
}
