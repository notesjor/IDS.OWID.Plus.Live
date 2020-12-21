export class OwidLiveStorageTimeItem {
  #Key;
  #Dates;
  #IsSelected;

  constructor(key, dates) {
    this.#Key = key;
    this.#Dates = dates;
    this.#IsSelected = true;
  }

  get Key() {
    return this.#Key;
  }

  get Dates() {
    return this.#IsSelected ? this.#Dates : null;
  }

  get IsSelected() {
    return this.#IsSelected;
  }

  set IsSelected(bool) {
    if (typeof bool === "boolean")
      this.#IsSelected = bool;
  }

  get Weeks() {
    return this.#IsSelected
      ? this.calculateGranulation(function (x) {
        return x.getYearWeek();
      })
      : null;
  }

  get Month() {
    return this.#IsSelected
      ? this.calculateGranulation(function (x) {
        return x.getMonth();
      })
      : null;
  }

  get Quarter() {
    return this.#IsSelected
      ? this.calculateGranulation(function (x) {
        return x.getYearQuarter();
      })
      : null;
  }

  get Year() {
    return this.#IsSelected
      ? this.calculateGranulation(function (x) {
        return x.getFullYear();
      })
      : null;
  }

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
