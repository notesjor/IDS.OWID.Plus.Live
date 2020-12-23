export class OwidLiveStorageTimeItem {
  #Key;
  #Token;
  #Name;
  #Dates;
  #IsSelected;
  
  /**
   * @param  {string} key the key of the search-result
   * @param  {array} dates all matched dates
   */
  constructor(key, dates) {
    this.#Key = key;
    this.#Token = key.split("µ");
    this.#Name = this.#Token.join(" ");
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
   * All matched dates
   */
  get Dates() {
    return this.#IsSelected ? this.#Dates : null;
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
    if (typeof bool === "boolean")
      this.#IsSelected = bool;
  }

  /**
   * All matched weeks
   */
  get Weeks() {
    return this.#IsSelected
      ? this.calculateGranulation(function (x) {
        return x.getYearWeek();
      })
      : null;
  }

  /**
   * All matched month
   */
  get Month() {
    return this.#IsSelected
      ? this.calculateGranulation(function (x) {
        return x.getMonth();
      })
      : null;
  }

  /**
   * All matched quarter
   */
  get Quarter() {
    return this.#IsSelected
      ? this.calculateGranulation(function (x) {
        return x.getYearQuarter();
      })
      : null;
  }

  /**
   * All matched years
   */
  get Year() {
    return this.#IsSelected
      ? this.calculateGranulation(function (x) {
        return x.getFullYear();
      })
      : null;
  }

  /**
   * HELPER-Function: Used by Weeks, Month, Quarter and Year
   * @param  {function} func the function describes how-to group the dates
   */
  calculateGranulation(func) {
    var dates = this.Dates();
    var res = {};
    dates.forEach((d) => {
      var key = func(d);
      if (key in res)
        res[key] += dates[d];
      else
        res[key] = dates[d];
    });
    return res;
  }
}
