export class OwidLiveStorageTimeItem {
  #Key;
  #Token;
  #Name;
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

  /**
   * @param  {string} key the key of the search-result
   * @param  {array} dates all matched dates
   */
  constructor(key, dates) {
    this.#Key = key;
    this.#Token = key.split("µ");
    this.#Name = key.split("µ")[0];
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
  get Date() {
    return this.#IsSelected
      ? this.calculateGranulation(function(x) {
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
    var res = {};
    Object.keys(this.#Dates).forEach((k) => {
      var d = new Date(k);
      var key = func(d);
      if (key in res) {
        res[key].value += this.#Dates[k];
        res[key].dates.add(k);
      } else {
        var nset = new Set();
        nset.add(k);

        res[key] = { dates: nset, value: this.#Dates[k] };
      }
    });
    return res;
  }
}
