import { OwidLiveStorageTimeItem } from "./OwidLiveStorageTimeItem";

export class OwidLiveSearch {
  #N;
  #Key;
  #Request;
  #OwidLiveStorageTimeItems;
  #IsSelected;

  /**
   * Create a new OwidLiveSearch
   * @param  {number} n of the N-Gram search
   * @param  {array} request the original search request
   * @param  {array} items the search responses
   */
  constructor(n, request, items) {
    this.#N = n;

    var key = "(N = " + n.toString() + "): ";
    request.forEach((x) => {
      key += x.toString();
    });
    this.#Key = key.trim();

    this.#Request = request;

    var olsti = [];
    Object.keys(items).forEach(item => {
      olsti.push(new OwidLiveStorageTimeItem(item, items[item]));
    });
    this.#OwidLiveStorageTimeItems = olsti;

    this.#IsSelected = true;
  }

  /**
   * Get the N(-Gram)
   */
  get N() {
    return this.#N;
  }

  /**
   * Auto generated key
   */
  get Key() {
    return this.#Key;
  }

  /**
   * Name based in Key and information about selected sub items
   */
  get Name() {
    var cnt = 0;
    this.#OwidLiveStorageTimeItems.forEach((i) => {
      if (i.IsSelected) cnt++;
    });

    return (
      this.#Key + " [" + cnt + " / " + this.#OwidLiveStorageTimeItems.length + "]"
    );
  }

  /**
   * Get all sub items (timelines)
   */
  get OwidLiveStorageTimeItems() {
    return this.#OwidLiveStorageTimeItems;
  }

  /**
   * Is this entry selected (sum up all selected sub items - see OwidLiveStorageItems)
   */
  get IsSelected() {
    return this.#IsSelected;
  }

  /**
   * @param  {boolean} bool Select this entry to sum up all selected sub items (see OwidLiveStorageItems)
   */
  set IsSelected(bool) {
    if (typeof bool === "boolean") {
      this.#IsSelected = bool;
      this.#OwidLiveStorageTimeItems.forEach((x) => {
        this.#OwidLiveStorageTimeItems[x].IsSelected(true);
      });
    }
  }

  /**
   * The original search request
   */
  get Request() {
    return this.#Request;
  }

  /**
   * If this.IsSelected than you recived the sum of all sub items (see OwidLiveStorageItems) otherwise null
   */
  get Date() {
    return this.#IsSelected
      ? this.Sum(function(x) {
          return x.Date;
        })
      : null;
  }

  /**
   * If this.IsSelected than you recived the sum of all sub items (see OwidLiveStorageItems) grouped by week otherwise null
   */
  get Week() {
    return this.#IsSelected
      ? this.Sum(function(x) {
          return x.Week;
        })
      : null;
  }

  /**
   * If this.IsSelected than you recived the sum of all sub items (see OwidLiveStorageItems) grouped by month otherwise null
   */
  get Month() {
    return this.#IsSelected
      ? this.Sum(function(x) {
          return x.Month;
        })
      : null;
  }

  /**
   * If this.IsSelected than you recived the sum of all sub items (see OwidLiveStorageItems) grouped by quarter otherwise null
   */
  get Quarter() {
    return this.#IsSelected
      ? this.Sum(function(x) {
          return x.Quarter;
        })
      : null;
  }

  /**
   * If this.IsSelected than you recived the sum of all sub items (see OwidLiveStorageItems) grouped by years otherwise null
   */
  get Year() {
    return this.#IsSelected
      ? this.Sum(function(x) {
          return x.Year;
        })
      : null;
  }

  /**
   * HELPER-Function: Used by Dates, Week, Month, Quarter and Year
   * @param  {function} func the functions describes how-to sum up the selected sub items (see OwidLiveStorageItems)
   */
  Sum(func) {
    var res = {};
    this.#OwidLiveStorageTimeItems.forEach((x) => {
      var items = func(x);
      Object.keys(items).forEach(key => {
        if (key in res){
           res[key].value += items[key].value;
           res[key].dates = new Set([...res[key].dates, ...items[key].dates]);
        }
        else res[key] = items[key];
      });
    });
    return res;
  }
}
