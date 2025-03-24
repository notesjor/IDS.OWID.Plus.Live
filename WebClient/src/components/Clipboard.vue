<template>
  <v-card>
    <v-card-title>
      <v-dialog v-model="dialog_help" width="600" scrollable>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on" style="width:100%">
            <div style="display:block; float:left">
              <v-icon>mdi-compare-horizontal</v-icon>
              <span style="margin-left:10px; font-size:15px">{{ $t("clipboard_head") }}</span>
              <sup>
                <v-icon left small style="margin-left:5px">
                  mdi-information-outline
                </v-icon>
              </sup>
            </div>
            <div style="width:auto; display:block; text-align:right">
              <div style="display:block; float:right; margin-left:15px">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-icon @click="modelSave">mdi-content-save-outline</v-icon>
                    </div>
                  </template>
                  <span>
                    {{ $t("clipboard_btn_save") }}
                  </span>
                </v-tooltip>
              </div>
              <div style="display:block; float:right">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-icon @click="modelLoad">mdi-folder-outline</v-icon>
                    </div>
                  </template>
                  <span>
                    {{ $t("clipboard_btn_load") }}
                  </span>
                </v-tooltip>
              </div>
            </div>
            <div style="display:none">
              <input type="file" id="fileinput" style="visibility: collapse; width:0px" />
            </div>
          </div>
        </template>
        <v-card>
          <v-card-title class="headline grey lighten-2">
            {{ $t("clipboard_help_head") }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <span>
              <span v-html="$t('clipboard_help_info_intro')"></span>
              <br /><br />
              <ul>
                <li>
                  <span v-html="$t('clipboard_help_info_compare')"></span>
                </li>
                <li>
                  <span v-html="$t('clipboard_help_info_detail')"></span>
                </li>
                <li>
                  (<v-icon>mdi-content-save-outline</v-icon> / <v-icon>mdi-folder-outline</v-icon>)
                  <span v-html="$t('clipboard_help_info_saveLoad')"></span>
                </li>
                <li>(<v-icon>mdi-dots-vertical</v-icon>) <span v-html="$t('clipboard_help_info_export')"></span></li>
              </ul>
            </span>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_help = false">
              {{ $t("lbl_closeWindow") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-expansion-panels multiple v-model="expanded">
      <v-expansion-panel v-for="(i, idx) in entries" :key="idx">
        <v-expansion-panel-header>
          <div>
            <div style="display:inline;">{{ i.label }}</div>
            <div style="float:right;display:block; margin:-13px 5px 0 0">
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="exportLink(i)">
                    <v-list-item-title><v-icon style="margin-right:10px">mdi-link-variant</v-icon>{{
                      $t("clipboard_export_link") }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="exportTsv(i)">
                    <v-list-item-title><v-icon style="margin-right:10px">mdi-export</v-icon>{{
                      $t("clipboard_export_tsv")
                      }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="exportJson(i)">
                    <v-list-item-title><v-icon style="margin-right:10px">mdi-export</v-icon>{{
                      $t("clipboard_export_json")
                      }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-data-table :headers="headers" :items="i.grid" :search="search" :single-select="false"
            :footer-props="{ itemsPerPageOptions: [3, 5, 10, 25, 50, 100, 250, -1], options: { itemsPerPage: 5 } }"
            @input="selectionChanged" v-model="selected" item-key="key" mutli-sort :sort-by="['dRel']"
            :sort-desc="[true]" show-select>
            <!-- eslint-disable -->
            <template v-slot:item.korap="x">
              <kwicBtnSearch :query="x.item.korap" />
            </template>
            <template v-slot:item.l="x">
              <p v-if="x.item.l != null" style="text-align: center; margin-top: 5px;">{{ x.item.l }}</p>
              <v-btn style="text-transform: none; margin-left: 10%;" small v-else-if="x.item.l === undefined">
                <v-progress-circular indeterminate color="black" :size="10"></v-progress-circular>
              </v-btn>
              <v-btn style="text-transform: none; margin-left: 10%;" small @click="lookup(idx, x.item.key, x.item.w, 1)"
                v-else>
                <v-icon>mdi-card-search-outline</v-icon>
                Anzeigen
              </v-btn>
            </template>
            <template v-slot:item.p="x">
              <p v-if="x.item.p != null" style="text-align: center; margin-top: 5px;">{{ x.item.p }}</p>
              <v-btn style="text-transform: none; margin-left: 10%;" small v-else-if="x.item.p === undefined">
                <v-progress-circular indeterminate color="black" :size="10"></v-progress-circular>
              </v-btn>
              <v-btn style="text-transform: none; margin-left: 10%;" small @click="lookup(idx, x.item.key, x.item.w, 2)"
                v-else>
                <v-icon>mdi-card-search-outline</v-icon>
                Anzeigen
              </v-btn>
            </template>
            <!-- eslint-enable -->
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-snackbar v-model="snackbar">
      <img :src="'https://www.owid.de/api/qrcode/png?p=' + this.$data.snackbarQrcode" />
      <v-text-field label="Link" :value="snackbarLink" readonly> </v-text-field>
      <a @click="copyToClipboard">
        <v-icon>mdi-content-copy</v-icon><span style="color:white;">{{ $t("lbl_copy") }}</span>
      </a>

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false" style="vertical-aign:bottom">
          {{ $t("lbl_ok") }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
function saveBlob(blob, fileType, fileName) {
  var newBlob = new Blob([blob], { type: fileType });

  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }

  const data = window.URL.createObjectURL(newBlob);
  var link = document.createElement("a");
  link.href = data;
  link.download = fileName;
  link.click();
  setTimeout(function () {
    window.URL.revokeObjectURL(data);
  }, 100);
}

export function saveClipboard(str) {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export var storeGlobal;

import kwicBtnSearch from './kwicBtnSearch.vue';

export default {
  name: "Clipboard",

  components: {
    kwicBtnSearch
  },

  data: () => {
    return {
      dialog_help: false,
      gradient: ["#f72047", "#ffd200", "#1feaea"],
      gradientDirection: "top",
      type: "trend",

      expanded: [],
      selected: [],
      search: "",
      headers: null,
      entries: [],

      syncLock: false,
      syncSumSelection: [],

      snackbar: false,
      snackbarLink: "",
      snackbarQrcode: "",
    };
  },

  mounted: function () {
    this.headers = [
      { text: this.$t("layer_wordform"), value: "w" },
      { text: this.$t("layer_lemma"), value: "l" },
      { text: this.$t("layer_posTag"), value: "p" },
      { text: this.$t("clipboard_tableHeader_detectedDays"), value: "d", align: "end" },
      { text: this.$t("clipboard_tableHeader_detectedDaysPercent"), value: "dRel", align: "end" },
      { text: this.$t("clipboard_tableHeader_sum"), value: "s", align: "end" },
      { text: this.$t("clipboard_tableHeader_sumRel"), value: "sRel", align: "end" },
      { text: "KorAP", value: "korap", sortable: false },
    ];
  },

  watch: {
    selected: function (val) {
      if (this.$data.syncLock) return;

      var sel = [];
      for (var i in val) sel.push(val[i].key);
      this.$data.syncLock = true;
      this.$store.commit("selectSearchHistoryItemsChange", sel);
      if (this.$store.state.vizNoCommit === 0) this.$store.commit("calculate");
      else this.$store.state.vizNoCommit--;
      this.$data.syncLock = false;
    },
  },

  methods: {
    lookup(idx, key, w, layer) {
      var baseUrl = "http://localhost:4455/v3"; //TODO: this.$config.baseUrl;
      var year = this.$store.state.yearFocus;
      var data = this.$data;

      data.entries[idx].grid.forEach((x) => {
        if (x.key === key) {
          if (layer === 1) x.l = undefined;
          else x.p = undefined;
        }
      });

      fetch(baseUrl + "/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Layer: layer,
          Query: w,
          Year: year
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(globalT.$t("search_progress_err01"));
        }
        return response.json();
      }).then((lookup) => {
        data.entries[idx].grid.forEach((x) => {
          if (x.key === key) {
            if (layer === 1) x.l = lookup.Lookup;
            else x.p = lookup.Lookup;
          }
        });
      }).catch((error) => {
        console.error("Error:", error);
      });
    },
    changeSumSelection: function () {
      if (this.$data.syncLock) return;

      this.$data.syncLock = true;
      this.$store.commit("selectSearchChange", this.$data.syncSumSelection);
      this.$store.commit("calculate");
      this.$data.syncLock = false;
    },
    selectionChanged() {
      if (this.$data.selected === null) return;

      var list = [];
      Object.keys(this.$data.selected).forEach((k) => {
        list.push(this.$data.selected[k].key);
      });

      this.$store.commit("selectSearchHistoryItemsChange", list);
    },
    exportLink(i) {
      var data = this.$store.state.owid.GetSearchHistoryItemRequest(i.label);
      var locale = this.$cookie.get("locale");
      this.$data.snackbarLink =
        this.$config.webUrl + "?" + (locale != "de" ? "locale=" + locale + "&" : "") + "data=" + btoa(JSON.stringify(data));
      this.$data.snackbarQrcode = encodeURIComponent(this.$data.snackbarLink.replace("https://www.owid.de/"));
      this.$data.snackbar = true;
    },
    exportTsv(i) {
      var raw = this.$store.state.owid.GetSearchHistoryItem4export(i.label);
      var keys = [];
      raw.OwidLiveStorageTimeItems.forEach((x) => {
        if (x.IsSelected) keys.push(x.Key);
      });

      var config = this.$config;

      fetch(config.baseUrl + "/down", {
        method: "post",
        body: JSON.stringify({ Format: "TSV", N: raw.N, Requests: keys }),
      })
        .then(function (r) {
          return r.arrayBuffer();
        })
        .then(function (buffer) {
          saveBlob(buffer, "text/tab-separated-value", "data.tsv");
        })
        .catch(function (error) {
          console.log("Request failed", error);
        });
    },
    exportJson(i) {
      var enc = new TextEncoder();
      saveBlob(
        enc.encode(
          JSON.stringify({
            Format: "JSON",
            Owid: this.$store.state.owid.GetSearchHistoryItem4export(i.label),
          })
        ).buffer,
        "application/json",
        "data.json"
      );
    },
    modelSave() {
      var enc = new TextEncoder();
      saveBlob(
        enc.encode(JSON.stringify({ Format: "JSON", Owid: this.$store.state.owid })).buffer,
        "application/json",
        "data.json"
      );
    },
    modelLoad() {
      storeGlobal = this.$store;
      var fileinput = document.getElementById("fileinput");
      fileinput.addEventListener("change", this.handleFileSelect);
      fileinput.click();
    },
    copyToClipboard() {
      saveClipboard(this.$data.snackbarLink);
    },
    handleFileSelect(e) {
      var files = e.target.files;
      if (files.length < 1) {
        alert("select a file...");
        return;
      }
      var file = files[0];
      var reader = new FileReader();
      reader.onload = this.onFileLoaded;
      reader.readAsDataURL(file);
    },
    onFileLoaded(e) {
      var match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
      if (match == null) {
        throw "Could not parse result";
      }
      var obj = JSON.parse(decodeURIComponent(escape(atob(match[2]))));
      storeGlobal.commit("modelLoad", obj.Owid);
      storeGlobal.commit("calculate");
      this.refreshData();
    },
    refreshData() {
      if (this.$store.state.owid === null) return;

      var selected = new Set();
      var selectedSums = [];
      var res = [];

      this.$store.state.owid.GetSearchHistory().forEach((key) => {
        var grid = this.$store.state.owid.GetSearchHistoryItem(key, this.$store.state.vizOptionGranulation);

        for (var row in grid) if (grid[row].checked) selected.add(grid[row]);

        res.push({
          label: key,
          checked: this.$store.state.owid.OwidLiveSearches[key].IsSelected,
          grid: grid,
        });

        if (this.$store.state.owid.OwidLiveSearches[key].IsSelected) selectedSums.push(key);
      });

      this.$data.syncLock = true;
      this.$data.selected = Array.from(selected);
      this.$data.syncSumSelection = selectedSums;
      this.$data.entries = res;

      var exp = [];
      var max = res.length > 3 ? 3 : res.length;
      for (var ei = 0; ei < max; ei++) exp.push(ei);
      this.$data.expanded = exp;

      this.$data.syncLock = false;
    }
  },

  created() {
    var self = this;

    this.$store.watch(
      () => {
        return self.$store.state.searches;
      },
      () => {
        self.refreshData();
      },
      {
        deep: true,
      }
    );
  },
};
</script>

<style>
.v-data-table-header {
  font-weight: 400;
}

th {
  border-left-style: solid;
  border-left-color: #1976d2;
  border-left-width: 4px;
}

th.active {
  background-color: rgba(0, 0, 0, 0.05);
}

th:hover {
  background: #1976d2;
  color: white !important;
}

th:hover i {
  color: white !important;
}

td {
  background-color: white !important;
}

td.text-start .v-simple-checkbox {
  text-align: center;
}

.v-card__title {
  margin-bottom: 0px !important;
}
</style>
