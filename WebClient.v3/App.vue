<template>
  <v-app>
    <v-app-bar app theme="dark" class="d-print-none" style="z-index:999">
      <div>
        <a href="https://www.owid.de/plus/" target="_blank">
          <img alt="Logo" src="/logo_left.svg" style="min-height:40px; margin-left:10px" />
        </a>
      </div>

      <v-spacer />

      <div>
        <a href="https://www.ids-mannheim.de/" target="_blank">
          <img alt="Logo" src="/logo_right.svg" style="min-height:70px" />
        </a>
      </div>
    </v-app-bar>

    <v-main>
      <v-container>

        <v-row>
          <v-col>
            <Search ref="searchComponent" @searchRequestSubmitted="scrollToVizPanel" :config="$config" :api="api" />
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            <VizPanel id="vizPanel" :config="$config" :api="api"/> <!-- TODO: v-show="owidApi.vizData != null" -->
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-footer padless>
              <v-card class="flex" flat tile>
                <v-card-text class="py-2" style="text-align:left">
                  <div style="display:inline-block">
                    {{ $t("footer_corpusSize") }}
                    <i>
                      ({{ $t("footer_lastUpdate") }}:
                      {{ api.owid === null ? "" : api.owid.LastDate }}):
                    </i>
                    <br />
                    {{ totalLabel }}
                  </div>
                </v-card-text>
              </v-card>
            </v-footer>
          </v-col>

          <v-col>
            <v-footer padless>
              <v-card class="flex" flat tile>
                <v-card-text class="py-2" style="text-align:right">
                  <div style="display:inline-block">
                    {{ new Date().getFullYear() }} — <strong>{{ $config.appName }}</strong>
                  </div>
                  <div style="display:inline-block">
                    <a :href="footerContact" style="margin-left:15px"
                      v-if="footerContact != null && footerContact.length > 1">{{ $t("footer_Contact") }}</a>
                    <a :href="footerImpressum" style="margin-left:15px"
                      v-if="footerImpressum != null && footerImpressum.length > 1">{{ $t("footer_Impressum") }}</a>
                    <a :href="footerDsgvo" style="margin-left:15px"
                      v-if="footerDsgvo != null && footerDsgvo.length > 1">{{ $t("footer_Dsgvo") }}</a>
                  </div>
                </v-card-text>
              </v-card>
            </v-footer>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-menu top z-index="1000">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="#EF7D00" fab style="position:fixed; right:1em; bottom:1em" v-bind="attrs" v-on="on">
          <v-icon>
            mdi-menu
          </v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="newProject">
          <div>
            <v-icon style="font-size:32px; float:left; margin-right:5px">mdi-file-outline</v-icon>
            <div class="d-none d-sm-flex">
              <span style="font-size:14px; line-height:1; font-weight:200;">
                <p v-html="$t('main_menu_new')"></p>
              </span>
            </div>
          </div>
        </v-list-item>
        <v-list-item @click="showTutorial" v-if="$config.tutorialUrl.length > 0">
          <v-icon style="font-size:32px; float:left; margin-right:5px">mdi-help-circle-outline</v-icon>
          <div class="d-none d-sm-flex">
            <span style="font-size:14px; line-height:1; font-weight:200; margin-top:10px;">
              <p v-html="$t('main_menu_videoTutorial')"></p>
            </span>
          </div>
        </v-list-item>
        <v-list-item>
          <div class="d-none d-sm-flex">
            <span style="font-size:14px; line-height:1; font-weight:200; margin-top:10px;">
              <p>
                <strong>{{ $t("main_menu_language") }}</strong><br />
                <a @click="setLocale('de')"><img src="./locales/de.svg" alt="Deutsch"
                    style="height:24px; margin:10px 10px 5px 0px" /></a>
                <a @click="setLocale('en')"><img src="./locales/gb.svg" alt="Englisch"
                    style="height:24px; margin:10px 10px 5px 0px" /></a>
                <a @click="setLocale('th')"><img src="./locales/th.svg" alt="Thai"
                    style="height:24px; margin:10px 10px 5px 0px" /></a>
                <a @click="setLocale('cmn')"><img src="./locales/cn.svg" alt="Mandarin"
                    style="height:24px; margin:10px 10px 5px 0px" /></a>
              </p>
            </span>
          </div>
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- TODO
    <v-footer theme="dark"
      style="z-index: 100; max-height: 80px; position: absolute; bottom: 0; width: 100%; padding-left:25px;">
      <div style="color:white; margin-top: 20px; font-size: 12px;">
        <img alt="Logo" src="/owid-logo-dunkel.svg" style="max-height:15px; margin:-10px 0px 3px 0px" float="left" />
        <div>
          <a style="color: #fff" href="mailto:ruediger@ids-mannheim.de">Kontakt</a>
          &middot;
          <a style="color: #fff" href="https://www.owid.de/wb/owid/privacy.html">Datenschutzhinweis</a>
          &middot;
          <a style="color: #fff" href="https://www.owid.de/wb/owid/impressum.html">Impressum</a>
        </div>
        <div>
          &copy; Leibniz-Institut für Deutsche Sprache
        </div>
      </div>

      <v-spacer />

      <div style="text-align: right;">
        <a href="https://www.ids-mannheim.de/" target="_blank">
          <img alt="Logo" src="/logo_right.svg"
            style="max-height:65px; min-height: 45px; min-width: 200px; margin-left: auto; " />
        </a>
      </div>
    </v-footer>
  -->
  </v-app>

  <v-dialog v-model="tutorial" theme="dark">
    <div style="margin-left: auto; margin-right: auto; position: relative; color:white">
      <div
        style="background-color: rgb(55, 55, 64); display: block; min-height: 410px; max-height: 410px; min-width: 300px; max-width: 300px; position: absolute; left: -320px; top: 50px; ">
        <h3 style="margin: 7px 0px 10px 15px;">Neuigkeiten</h3>
        <v-window v-model="newsAll" vertical>
          <v-window-item :key="0">
            <v-virtual-scroll :items="$config.public.news" height="368" item-height="64">
              <template v-slot:default="{ item }">
                <v-list-item :key="item" class="newsItem" @click="newsSelected = item.id" style="margin:5px 0px">
                  <div>
                    <span style="width: 100%;">
                      <v-icon>{{ item.icon }}</v-icon>&nbsp;
                      <b>{{ item.date }}:</b> {{ item.title }}
                    </span>
                  </div>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-window-item>
          <v-window-item :key="1">
            <div style="height: 100%; width: 100%; padding: 0px 10px 0px 10px; min-height: 352px;">
              <v-row align="center" class="mb-4" style="margin: 5px 0px 0px 0px; font-size: 1.2rem;">
                <v-icon>{{ $config.public.news[newsSelected]?.icon }}</v-icon>&nbsp;
                <b>{{ $config.public.news[newsSelected]?.date }}:</b> {{
                  $config.public.news[newsSelected]?.title }}
              </v-row>

              <div v-html="$config.public.news[newsSelected]?.text" style="text-align:left;" class="newsText">
              </div>
              <div style="margin: 10px 0px 0px 0px; position: absolute; bottom: 0px;">
                <v-btn @click="newsSelected = -1" prepend-icon="mdi-arrow-left-circle-outline" class="pulse-btn">
                  Zeige alle Neuigkeiten
                </v-btn>
              </div>
            </div>
          </v-window-item>
        </v-window>
      </div>

      <div class="text-center">
        <v-card style="min-width: 300px;">
          <v-card-title class="headline">
            {{ $t("app_dialog_welcome_message") }} {{ $config.public.appName }}
          </v-card-title>
          <iframe :src="$config.public.tutorialUrl" title="Video-Tutorial"
            style="width:600px; max-width:600px; height:414px; margin:5px"></iframe>
          <v-card-text>
            {{ $t("app_dialog_welcome_message_info") }}
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="tutorial = false" prepend-icon="mdi-arrow-right-circle-outline" class="pulse-btn">
              {{ $t("app_dialog_welcome_message_btn") }}
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-dialog>

  <v-dialog v-model="alert">
    <div class="text-center">
      <v-card>
        <v-card-title class="headline">
          {{ $t("app_dialog_serverError_message") }} {{ $config.appName }}
        </v-card-title>
        <v-card-text>
          {{ $t("app_dialog_serverError_message_info") }}
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
// DataHelper
function Normalize(item, normData) {
  const dataMap = new Map(Object.entries(item.data));
  Object.keys(normData).forEach((date) => {
    if (dataMap.has(date)) {
      const entry = dataMap.get(date);
      entry.value = (entry.value / normData[date]) * 1000000;
    } else {
      dataMap.set(date, { dates: new Set(), value: 0.0 });
    }
  });
  item.data = Object.fromEntries(dataMap);
  return item;
}

function Prefill(item, normData) {
  const dataMap = new Map(Object.entries(item.data));
  Object.keys(normData).forEach((date) => {
    if (!dataMap.has(date)) {
      dataMap.set(date, { dates: new Set(), value: 0.0 });
    }
  });
  item.data = Object.fromEntries(dataMap);
  return item;
}

// DateHelper
Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};
// SOURCE: https://weeknumber.net/how-to/javascript >>>
Date.prototype.getWeek = function () {
  this.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  this.setDate(this.getDate() + 3 - ((this.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(this.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((this.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
      7
    )
  );
};
// <<<
Date.prototype.getYearWeek = function () {
  return this.getFullYear() + "-" + this.getWeek().pad(2);
};
Date.prototype.getYearQuarter = function () {
  return this.getFullYear() + "-" + (Math.floor(this.getMonth() / 3) + 1);
};
// OwidLiveSearch
class OwidLiveSearch {
  _N;
  _Key;
  _Request;
  _OwidLiveStorageTimeItems;
  _IsSelected;
  _TimeStamp;

  toJSON() {
    return {
      N: this._N,
      Key: this._Key,
      Request: this._Request,
      OwidLiveStorageTimeItems: this._OwidLiveStorageTimeItems,
      IsSelected: this._IsSelected,
      TimeStamp: this._TimeStamp,
    };
  }

  static load(obj) {
    var olsti = [];
    obj.OwidLiveStorageTimeItems.forEach((x) => {
      olsti.push(OwidLiveStorageTimeItem.load(x));
    });

    var res = new OwidLiveSearch(obj.N, obj.Request, null);
    res._Key = obj.Key;
    res._IsSelected = obj.IsSelected;
    res._OwidLiveStorageTimeItems = olsti;
    res._TimeStamp = obj.TimeStamp;
    return res;
  }

  /**
   * Create a new OwidLiveSearch
   * @param  {number} n of the N-Gram search
   * @param  {array} request the original search request
   * @param  {array} items the search responses
   */
  constructor(n, request, items) {
    this._N = n;
    this._TimeStamp = new Date();

    var key = "(N = " + n.toString() + "): ";
    request.forEach((x) => {
      key += x.toString() + " ";
    });
    this._Key = key.trim();

    this._Request = request;

    var olsti = [];
    if (items != null)
      Object.keys(items).forEach((item) => {
        olsti.push(new OwidLiveStorageTimeItem(item, items[item]));
      });
    this._OwidLiveStorageTimeItems = olsti;

    this._IsSelected = true;
  }

  /**
   * Get the N(-Gram)
   */
  get N() {
    return this._N;
  }

  /**
   * Auto generated key
   */
  get Key() {
    return this._Key;
  }

  /**
   * Name based in Key and information about selected sub items
   */
  get Name() {
    var cnt = 0;
    this._OwidLiveStorageTimeItems.forEach((i) => {
      if (i.IsSelected) cnt++;
    });

    return (
      this._Key +
      " [" +
      cnt +
      " / " +
      this._OwidLiveStorageTimeItems.length +
      "]"
    );
  }

  /**
   * Get the TimeStamp
   */
  get TimeStamp() {
    return this._TimeStamp;
  }

  /**
   * Get all sub items (timelines)
   */
  get OwidLiveStorageTimeItems() {
    return this._OwidLiveStorageTimeItems;
  }

  /**
   * Is this entry selected (sum up all selected sub items - see OwidLiveStorageItems)
   */
  get IsSelected() {
    return this._IsSelected;
  }

  /**
   * @param  {boolean} bool Select this entry to sum up all selected sub items (see OwidLiveStorageItems)
   */
  set IsSelected(bool) {
    if (typeof bool === "boolean") {
      this._IsSelected = bool;
      this._OwidLiveStorageTimeItems.forEach((x) => {
        x.IsSelected = true;
      });
    }
  }

  /**
   * The original search request
   */
  get Request() {
    return this._Request;
  }

  /**
   * If this.IsSelected than you recived the sum of all sub items (see OwidLiveStorageItems) otherwise null
   */
  get Date() {
    return this._IsSelected
      ? this.Sum(function (x) {
        return x.Date;
      })
      : null;
  }

  /**
   * If this.IsSelected than you recived the sum of all sub items (see OwidLiveStorageItems) grouped by week otherwise null
   */
  get Week() {
    return this._IsSelected
      ? this.Sum(function (x) {
        return x.Week;
      })
      : null;
  }

  /**
   * If this.IsSelected than you recived the sum of all sub items (see OwidLiveStorageItems) grouped by month otherwise null
   */
  get Month() {
    return this._IsSelected
      ? this.Sum(function (x) {
        return x.Month;
      })
      : null;
  }

  /**
   * If this.IsSelected than you recived the sum of all sub items (see OwidLiveStorageItems) grouped by quarter otherwise null
   */
  get Quarter() {
    return this._IsSelected
      ? this.Sum(function (x) {
        return x.Quarter;
      })
      : null;
  }

  /**
   * If this.IsSelected than you recived the sum of all sub items (see OwidLiveStorageItems) grouped by years otherwise null
   */
  get Year() {
    return this._IsSelected
      ? this.Sum(function (x) {
        return x.Year;
      })
      : null;
  }

  /**
   * HELPER-Function: Used by Dates, Week, Month, Quarter and Year
   * @param  {function} func the functions describes how-to sum up the selected sub items (see OwidLiveStorageItems)
   */
  Sum(func) {
    const res = {};
    this._OwidLiveStorageTimeItems.forEach((item) => {
      const data = func(item);
      if (data) {
        for (const [key, value] of Object.entries(data)) {
          if (res[key]) {
            res[key].value += value.value;
            res[key].dates = new Set([...res[key].dates, ...value.dates]);
          } else {
            res[key] = { ...value };
          }
        }
      }
    });
    return res;
  }

  /**
   * (Un-)Selects all OwidLiveStorageTimeItems
   * @param  {arry} selection all listed items will be selected - other: unselected
   */
  SelectOwidLiveStorageTimeItems(selection) {
    const set = new Set(selection);
    this._OwidLiveStorageTimeItems.forEach((i) => {
      i.IsSelected = set.has(i.Key);
    });
  }
}

// OwidLiveStorage
class OwidLiveStorage {
  _OwidLiveSearches;
  _Norm;
  _Dates;
  _LastDate;
  _Total;
  _NormTotal;
  _N;
  _NMax = 3;
  _Granulation;
  _AvailableYears;

  toJSON() {
    return {
      Dates: this._Dates,
      N: this._N,
      Norm: this._Norm,
      OwidLiveSearches: this._OwidLiveSearches,
      Total: this._Total,
      NormTotal: this._NormTotal,
    };
  }

  static load(norm, ols, n, dates, total, ntotal) {
    var res = new OwidLiveStorage(norm);
    res._Norm = norm;
    res._OwidLiveSearches = {};
    Object.keys(ols).forEach((x) => {
      res._OwidLiveSearches[x] = OwidLiveSearch.load(ols[x]);
    });
    res._N = n;
    res._Dates = dates;
    res._Total = total;
    res._NormTotal = ntotal;
    return res;
  }

  /**
   * @param  {array} norm array from GET: owidAPI/norm
   */
  constructor(norm) {
    this._Norm = norm;
    this._OwidLiveSearches = {};
    this._N = 1;

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

    this._Dates = Array.from(dates).sort();
    this._LastDate = this._Dates[this._Dates.length - 1];
    this._Total = total;
    this._NormTotal = notal;
  }

  /**
   * Returns the complete search history
   */
  get OwidLiveSearches() {
    return this._OwidLiveSearches;
  }

  /**
   * (Un-)Selects all OwidLiveSearches
   * @param  {arry} selection all listed items will be selected - other: unselected
   */
  selectSearchItems(selection) {
    var set = new Set(selection);
    Object.keys(this._OwidLiveSearches).forEach((key) => {
      this._OwidLiveSearches[key].IsSelected = set.has(key);
    });
  }

  /**
   * (Un-)Selects all OwidLiveStorageTimeItems
   * @param  {arry} selection all listed items will be selected - other: unselected
   */
  selectSearchHistoryItem(selection) {
    Object.keys(this._OwidLiveSearches).forEach((key) => {
      this._OwidLiveSearches[key].SelectOwidLiveStorageTimeItems(selection);
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
    this._OwidLiveSearches[x.Key] = x;
  }

  /**
   * Delete all searches
   */
  clearAll() {
    // reset to empty object
    this._OwidLiveSearches = {};
  }

  /**
   * Return all normalization data
   */
  get Norm() {
    return this._Norm;
  }

  /**
   * Return the last date
   */
  get LastDate() {
    return this._LastDate === null ? "" : this._LastDate;
  }

  /**
   * Return all available dates
   */
  get Dates() {
    return this._Granulation;
  }

  /**
   * Set the current granulation
   */
  set Dates(granulation) {
    this._Granulation = granulation;
  }

  /**
   * Return the current N(-gram)
   */
  get N() {
    return this._N;
  }

  /**
   * @param  {number} n set the current N(-gram)
   */
  set N(n) {
    this._N = n;
  }

  /**
   * Return the total (in Token)
   */
  get Total() {
    return this._Total;
  }

  /**
   * Return the relative total (in pro Mio. Token)
   */
  get NormTotal() {
    return this._NormTotal;
  }

  /**
   * Get the search history for N(-Gram). Used by components/Clipboard
   */
  GetSearchHistory() {
    if (Object.keys(this._OwidLiveSearches).length === 0) return [];

    return Object.entries(this._OwidLiveSearches)
      .filter(([, search]) => search.N === this._N)
      .sort(([, a], [, b]) => b.TimeStamp - a.TimeStamp)
      .map(([key]) => key);
  }

  /**
   * @param  {string} key Get the request of the HistoryItem
   */
  GetSearchHistoryItemRequest(key) {
    return this._OwidLiveSearches[key].Request;
  }

  /**
   * @param  {string} key Get the raw the HistoryItem (for export only)
   */
  GetSearchHistoryItem4export(key) {
    return this._OwidLiveSearches[key];
  }

  /**
   * @param  {string} key Get the specific table of the search (history) entry. Used by components/Clipboard
   * @param  {number} granulation Set the granulation for calculation (0=day, 1=week, 2=month, 3=quarter, 4=year)
   */
  GetSearchHistoryItem(key, granulation) {
    var data = this._OwidLiveSearches[key];
    var dates = this._Dates;
    var total = this._Total[this._N - 1];
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

  _funcDate = function (x) {
    return (
      x.getFullYear() +
      "-" +
      (x.getMonth() + 1).pad(2) +
      "-" +
      x.getDate().pad(2)
    );
  };

  _funcWeek = function (x) {
    return x.getYearWeek();
  };

  _funcMonth = function (x) {
    return x.getFullYear() + "-" + x.getMonth().pad(2);
  };

  _funcQuarter = function (x) {
    return x.getYearQuarter();
  };

  _funcYear = function (x) {
    return x.getFullYear();
  };

  /**
   * get a date array (day based)
   */
  get DatesDate() {
    return this.calculateDateGranulation(this._funcDate);
  }

  /**
   * get the norm date values for N(-Gram)
   */
  get NormDate() {
    return this.calculateGranulation(this._funcDate);
  }

  /**
   * get a date array (week based)
   */
  get DatesWeek() {
    return this.calculateDateGranulation(this._funcWeek);
  }

  /**
   * get the norm weeks values for N(-Gram)
   */
  get NormWeek() {
    return this.calculateGranulation(this._funcWeek);
  }

  /**
   * get a date array (month based)
   */
  get DatesMonth() {
    return this.calculateDateGranulation(this._funcMonth);
  }

  /**
   * get the norm month values for N(-Gram)
   */
  get NormMonth() {
    return this.calculateGranulation(this._funcMonth);
  }

  /**
   * get a date array (quarter based)
   */
  get DatesQuarter() {
    return this.calculateDateGranulation(this._funcQuarter);
  }

  /**
   * get the norm quarters values for N(-Gram)
   */
  get NormQuarter() {
    return this.calculateGranulation(this._funcQuarter);
  }

  /**
   * get a date array (year based)
   */
  get DatesYear() {
    return this.calculateDateGranulation(this._funcYear);
  }

  /**
   * get the norm years values for N(-Gram)
   */
  get NormYear() {
    return this.calculateGranulation(this._funcYear);
  }

  /**
   * HELPER-Function: Used by NormDate, NormWeek, NormMonth, NormQuarter and NormYear (see above)
   * @param  {function} func the functions needs to describe how-to find the dateTime-Key
   */
  calculateGranulation(func) {
    const res = new Map();
    for (const [date, value] of Object.entries(this._Norm[this._N - 1])) {
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
    return this._Dates.map((date) => func(new Date(date)));
  }
}

// OwidLiveStorageTimeItem
class OwidLiveStorageTimeItem {
  _Key;
  _Token;
  _Name;
  _Label;
  _Dates;
  _IsSelected;

  toJSON() {
    return {
      Key: this._Key,
      Token: this._Token,
      Name: this._Name,
      Dates: this._Dates,
      IsSelected: this._IsSelected,
    };
  }

  static load(obj) {
    var res = new OwidLiveStorageTimeItem("?µ?µ?", null);
    res._Key = obj.Key;
    res._Token = obj.Token;
    res._Name = obj.Name;
    res._Label = obj.Key.split("µ").join(" | ");
    res._Dates = obj.Dates;
    res._IsSelected = obj.IsSelected;
    return res;
  }

  /**
   * @param  {string} key the key of the search-result
   * @param  {array} dates all matched dates
   */
  constructor(key, dates) {
    this._Key = key;
    this._Token = key.split("µ");
    this._Name = key.split("µ")[0];
    this._Label = key.split("µ").join(" | ");
    this._Dates = dates;
    this._IsSelected = true;
  }

  /**
   * The key of the search-result
   */
  get Key() {
    return this._Key;
  }

  /**
   * Token based on Key
   */
  get Token() {
    return this._Token;
  }

  /**
   * Name based on Key
   */
  get Name() {
    return this._Name;
  }

  /**
   * The label of the search-result
   */
  get Label() {
    return this._Label;
  }

  /**
   * All matched dates
   */
  get Date() {
    return this._IsSelected
      ? this.calculateGranulation(function (x) {
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
    return this._IsSelected;
  }

  /**
   * @param  {boolean} bool select for visualization?
   */
  set IsSelected(bool) {
    if (typeof bool === "boolean") this._IsSelected = bool;
  }

  /**
   * All matched weeks
   */
  get Week() {
    return this._IsSelected
      ? this.calculateGranulation(function (x) {
        return x.getYearWeek();
      })
      : null;
  }

  /**
   * All matched month
   */
  get Month() {
    return this._IsSelected
      ? this.calculateGranulation(function (x) {
        return x.getFullYear() + "-" + x.getMonth().pad(2);
      })
      : null;
  }

  /**
   * All matched quarter
   */
  get Quarter() {
    return this._IsSelected
      ? this.calculateGranulation(function (x) {
        return x.getYearQuarter();
      })
      : null;
  }

  /**
   * All matched years
   */
  get Year() {
    return this._IsSelected
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
    const res = {};
    for (const [key, value] of Object.entries(this._Dates)) {
      const date = new Date(key);
      const granulatedKey = func(date);
      if (!res[granulatedKey]) {
        res[granulatedKey] = { dates: new Set(), value: 0 };
      }
      res[granulatedKey].value += value;
      res[granulatedKey].dates.add(key);
    }
    return res;
  }
}

// SCRIPT
export default {
  name: "Index",
  theme: { dark: false },
  data() {
    return {
      tutorial: false,
      alert: false,
      newsSelected: -1,
      api: {
        // === State ===
        years: [],
        yearMin: 0,
        yearMax: 0,
        yearInc: 0,
        yearFocus: 2024,

        owid: null,
        version: 0,
        searches: 0,

        vizNoCommit: 0,
        vizOptionRelative: true,
        vizOptionGranulation: 0,
        vizOptionSmoothing: 16,

        vizData: null,

        // === Former Mutations => Methods ===

        setYears(years) {
          this.years = years;
          this.yearMin = Math.min(...years);
          this.yearMax = Math.max(...years);
          this.yearInc = -1;
        },

        setFocusYear(year) {
          this.yearFocus = year;
        },

        init(payload) {
          this.owid = new OwidLiveStorage(payload);
        },

        clearAll() {
          this.owid?.clearAll();
        },

        updateN(N) {
          if (this.owid) this.owid.N = N;
        },

        search({ n, queryItems, items }) {
          if (!this.owid) return;
          this.owid.addOwidLiveSearchItem(n, queryItems, items);
          this.searches = Object.keys(this.owid.OwidLiveSearches).length;
        },

        setVizOptions({ r, g, s }) {
          this.vizOptionRelative = r;
          this.vizOptionGranulation = g;
          this.vizOptionSmoothing = s;
        },

        selectSearchChange(payload) {
          this.owid?.selectSearchItems(payload);
        },

        selectSearchHistoryItemsChange(payload) {
          this.owid?.selectSearchHistoryItem(payload);
        },

        modelLoad(o) {
          this.owid = OwidLiveStorage.load(o.Norm, o.OwidLiveSearches, o.N, o.Dates, o.Total, o.NormTotal);
        },

        calculate() {
          if (!this.owid || !this.owid.OwidLiveSearches) {
            this.vizData = null;
            return;
          }

          this.vizData = {};
          const res = {};

          // Auswahl der Zeitgranularität
          switch (this.vizOptionGranulation) {
            case 1: this.owid.Dates = this.owid.DatesWeek; break;
            case 2: this.owid.Dates = this.owid.DatesMonth; break;
            case 3: this.owid.Dates = this.owid.DatesQuarter; break;
            case 4: this.owid.Dates = this.owid.DatesYear; break;
            default: this.owid.Dates = this.owid.DatesDate; break;
          }

          // Datenaufbereitung (1:1 übernommen)
          for (const s in this.owid.OwidLiveSearches) {
            const search = this.owid.OwidLiveSearches[s];
            if (search.N !== this.owid.N) continue;

            const subItems = {};

            for (const i in search.OwidLiveStorageTimeItems) {
              const item = search.OwidLiveStorageTimeItems[i];
              if (!item.IsSelected) continue;

              let sitem;
              switch (this.vizOptionGranulation) {
                case 1: sitem = item.Week; break;
                case 2: sitem = item.Month; break;
                case 3: sitem = item.Quarter; break;
                case 4: sitem = item.Year; break;
                default: sitem = item.Date; break;
              }

              subItems[item.Label] = {
                name: item.Name,
                label: item.Label,
                data: sitem,
                items: null,
              };
            }

            if (Object.keys(subItems).length === 0) continue;

            if (search.IsSelected) {
              let sgrp;
              switch (this.vizOptionGranulation) {
                case 1: sgrp = search.Week; break;
                case 2: sgrp = search.Month; break;
                case 3: sgrp = search.Quarter; break;
                case 4: sgrp = search.Year; break;
                default: sgrp = search.Date; break;
              }

              res[search.Name] = {
                name: search.Name,
                label: search.Label,
                data: sgrp,
                items: subItems,
              };
            } else {
              Object.keys(subItems).forEach((x) => {
                res[x] = {
                  name: subItems[x].name,
                  label: subItems[x].label,
                  data: subItems[x].data,
                  items: [subItems[x]],
                };
              });
            }
          }

          let normData;
          switch (this.vizOptionGranulation) {
            case 1: normData = this.owid.NormWeek; break;
            case 2: normData = this.owid.NormMonth; break;
            case 3: normData = this.owid.NormQuarter; break;
            case 4: normData = this.owid.NormYear; break;
            default: normData = this.owid.NormDate; break;
          }

          if (this.vizOptionRelative) {
            Object.keys(res).forEach((key) => {
              res[key] = Normalize(res[key], normData);
              if (res[key].items) {
                Object.keys(res[key].items).forEach((subKey) => {
                  res[key].items[subKey] = Normalize(res[key].items[subKey], normData);
                });
              }
            });
          } else {
            Object.keys(res).forEach((key) => {
              res[key] = Prefill(res[key], normData);
              if (res[key].items) {
                Object.keys(res[key].items).forEach((subKey) => {
                  res[key].items[subKey] = Prefill(res[key].items[subKey], normData);
                });
              }
            });
          }

          // smoothing
          if (this.vizOptionSmoothing > 1) {
            let carret, odd;
            if (this.vizOptionSmoothing % 2 === 0) {
              carret = Math.floor(this.vizOptionSmoothing / 2);
              odd = false;
            } else {
              carret = Math.floor((this.vizOptionSmoothing - 1) / 2);
              odd = true;
            }

            const halfVOS = this.vizOptionSmoothing * 2.0;

            Object.keys(res).forEach((key) => {
              const item = res[key].data;
              const keys = this.owid.Dates;
              const nval = {};

              for (let i = carret; i < keys.length - carret; i++) {
                const dates = new Set();
                let sum = 0.0;

                for (let j = -carret; j <= carret; j++) {
                  const currentKey = keys[i + j];
                  if (!item[currentKey]) continue;

                  item[currentKey].dates.forEach((d) => dates.add(d));
                  if (odd || (j !== -carret && j !== carret)) {
                    sum += item[currentKey].value / this.vizOptionSmoothing;
                  } else {
                    sum += item[currentKey].value / halfVOS;
                  }
                }

                nval[keys[i]] = {
                  dates: dates,
                  value: parseFloat(sum.toFixed(5)),
                };
              }

              res[key].data = nval;
            });
          }

          this.vizData = res;
          this.version++;
        },
      }
    }
  },

  mounted() {
    var config = this.$config;    
    var baseUrl = "https://www.owid.de/plus/live-2021/api/v3";
    var self = this;

    // Der Aufruf INIT sowie NORM lädt notwendige Normdaten herunter.
    // INIT kann serverseitig zur Flood-Detection und Loging verwendet werden.
    fetch(baseUrl + "/years")
      .then((response) => response.json())
      .then((response) => {        
        self.api.setYears(response);

        fetch(baseUrl + "/norm", {
          method: "GET",
        })
          .then((resp) => {
            if (resp.status != 200)
              throw new Error("Server Error");
            return resp;
          })
          .then((resp) => {
            return resp.ok ? resp.json() : null;
          })
          .then((obj) => {
            if (obj === null)
              throw new Error("No Data");

            self.api.init(obj);
            self.api.setVizOptions({ r: true, s: 16, g: 1 });
          })
          .then(() => {
            const queries = new URLSearchParams(window.location.search);
            var data = "";
            if (queries.has("data")) {
              data = queries.get("data");
            }
            if (queries.has("locale")) {
              var locale = queries.get("locale");
              // vermeidet reload
              if (this.$cookie.get("locale") != locale)
                self.setLocale(locale);
            }

            if (data.length < 10) return;

            this.tutorial = true;
            try {
              search.search_invoke(JSON.parse(atob(data)));
            } catch {
              // ignore
            }
            return;
          });
      })
      .catch((ex) => {
        console.log(ex);
        this.$data.alert = true;
      });

    // TODO
    //let trackingScript = document.createElement("script");
    //trackingScript.setAttribute("src", "./tracking.js");
    //document.head.appendChild(trackingScript);

    // Als Tutorial lassen sich MP4-Video-Dateien (inkl. PNG-Poster => myvideo.mp4.png) oder
    // eine externe HTML-Datei mit Video-Player laden.
    // TODO
    //if (config.tutorialUrl.length < 1)
    //  this.tutorial = true;
    //else
    //  this.$data.tutorial_iframe_src = config.tutorialUrl;
  },

  methods: {
  },

  computed: {
    totalLabel: function () {
      if (this.api.owid === null) return "";

      var totals = this.api.owid.Total;
      var res = [];
      for (var i = 0; i < totals.length; i++) {
        res.push("N=" + (i + 1) + ": " + totals[i]);
      }

      return res.join(" / ");
    },
    newsAll: {
      get() {
        return this.newsSelected === -1 ? 0 : 1;
      },
    }
  }
}
</script>

<style>
.pulse-btn {
  border: 3px solid rgba(255, 255, 255, 1);
  border-radius: 8px;
  background-clip: padding-box;
  /* verhindert, dass der Hintergrund unter dem Radius sichtbar wird */
  animation: pulse-border 3s ease-in-out infinite;
  -webkit-animation: pulse-border 3s ease-in-out infinite;
}

@keyframes pulse-border {
  0% {
    border-color: rgba(255, 255, 255, 1);
  }

  50% {
    border-color: rgba(255, 255, 255, 0.25);
  }

  100% {
    border-color: rgba(255, 255, 255, 1);
  }
}

@-webkit-keyframes pulse-border {
  0% {
    border-color: rgba(255, 255, 255, 1);
  }

  50% {
    border-color: rgba(255, 255, 255, 0.25);
  }

  100% {
    border-color: rgba(255, 255, 255, 1);
  }
}

.newsItem {
  background-color: rgb(75, 75, 84);
}

.newsItem:hover {
  background-color: rgb(95, 95, 104);
  cursor: pointer;
}

div.newsText>a {
  color: #ff9800;
  text-decoration: none;
}

div.newsText a:visited {
  color: #ff9800;
  text-decoration: none;
}

div.newsText {
  font-size: 1.1rem;
  font-weight: 200;
  line-height: 1.4;
}
</style>