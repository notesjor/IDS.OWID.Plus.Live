import { OwidLiveStorageTimeItem } from "./OwidLiveStorageTimeItem";

export class OwidLiveSearch {
  #N;
  #Key;
  #Request;
  #OwidLiveStorageTimeItems;
  #IsSelected;

  constructor(n, request, items) {
    this.#N = n;

    var key = "(N = " + n.toString() + "): ";
    request.forEach((x) => {
      key += x.toString();
    });
    this.#Key = key.trim();

    this.#Request = request;

    this.#OwidLiveStorageTimeItems = [];
    items.forEach((item) => {
      this.#OwidLiveStorageTimeItems.push(
        new OwidLiveStorageTimeItem(item, items[item])
      );
    });

    this.#IsSelected = true;
  }

  get N() {
    return this.#N;
  }

  get Key() {
    return this.#Key;
  }

  get OwidLiveStorageItems() {
    return this.#OwidLiveStorageTimeItems;
  }

  get IsSelected() {
    return this.#IsSelected;
  }

  set IsSelected(bool) {
    if (typeof bool === "boolean") {
      this.#IsSelected = bool;
      this.#OwidLiveStorageTimeItems.forEach((x) => {
        this.#OwidLiveStorageTimeItems[x].IsSelected(true);
      });
    }
  }

  get Request() {
    return this.#Request;
  }

  get Dates() {
    return this.#IsSelected
      ? this.Sum(function (x) {
        return x.Dates();
      })
      : null;
  }

  get Weeks() {
    return this.#IsSelected
      ? this.Sum(function (x) {
        return x.Weeks();
      })
      : null;
  }

  get Month() {
    return this.#IsSelected
      ? this.Sum(function (x) {
        return x.Month();
      })
      : null;
  }

  get Quarter() {
    return this.#IsSelected
      ? this.Sum(function (x) {
        return x.Quarter();
      })
      : null;
  }

  get Year() {
    return this.#IsSelected
      ? this.Sum(function (x) {
        return x.Year();
      })
      : null;
  }

  Sum(func) {
    var res = {};
    this.#OwidLiveStorageTimeItems.forEach((x) => {
      var items = func(this.#OwidLiveStorageTimeItems[x]);
      items.forEach((item) => {
        if (item in res)
          res[item] += items[item];
        else
          res[item] = items[item];
      });
    });
  }
}
