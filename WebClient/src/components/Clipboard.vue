<template>
  <v-card>
    <v-card-title>
      <v-dialog v-model="dialog_help" width="600" scrollable>
        <template v-slot:activator="{ props }">
          <div v-bind="props" style="width:100%">
            <div style="display:block; float:left">
              <v-icon>mdi-compare-horizontal</v-icon>
              <span style="margin-left:10px; font-size:15px">{{ $t("clipboard_head") }}</span>
              <sup>
                <v-icon start small style="margin-left:5px">
                  mdi-information-outline
                </v-icon>
              </sup>
            </div>
            <div style="width:auto; display:block; text-align:right">
              <div style="display:block; float:right; margin-left:15px">
                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props">
                      <v-icon @click="modelSave">mdi-content-save-outline</v-icon>
                    </div>
                  </template>
                  <span>
                    {{ $t("clipboard_btn_save") }}
                  </span>
                </v-tooltip>
              </div>
              <div style="display:block; float:right">
                <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props">
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
          <v-card-title class="text-h5 bg-grey-lighten-2">
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
            <v-btn color="primary" variant="text" @click="dialog_help = false">
              {{ $t("lbl_closeWindow") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-expansion-panels multiple v-model="expanded">
      <v-expansion-panel v-for="(i, idx) in entries" :key="idx">
        <v-expansion-panel-title>
          <div>
            <div style="display:inline;">{{ i.label }}</div>
            <div style="float:right;display:block; margin:-13px 5px 0 0">
              <v-menu location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-btn icon variant="text" v-bind="props">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="exportLink(i)">
                    <v-list-item-title><v-icon style="margin-right:10px">mdi-link-variant</v-icon>{{
                      $t("clipboard_export_link") }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="exportCsv(i)">
                    <v-list-item-title><v-icon style="margin-right:10px">mdi-export</v-icon>{{
                      $t("clipboard_export_csv")
                      }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="exportTsv(i)">
                    <v-list-item-title><v-icon style="margin-right:10px">mdi-export</v-icon>{{
                      $t("clipboard_export_tsv")
                      }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="exportHtml(i)">
                    <v-list-item-title><v-icon style="margin-right:10px">mdi-export</v-icon>{{
                      $t("clipboard_export_html")
                      }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="exportXml(i)">
                    <v-list-item-title><v-icon style="margin-right:10px">mdi-export</v-icon>{{
                      $t("clipboard_export_xml")
                      }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="exportJson(i)">
                    <v-list-item-title><v-icon style="margin-right:10px">mdi-export</v-icon>{{
                      $t("clipboard_export_json")
                      }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="exportSql(i)">
                    <v-list-item-title><v-icon style="margin-right:10px">mdi-export</v-icon>{{
                      $t("clipboard_export_sql")
                      }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-data-table :headers="headers" :items="i.grid" :search="search"
            :items-per-page-options="itemsPerPageOptions" :items-per-page="5"
            v-model="selected" item-value="key" return-object :sort-by="[{ key: 'dRel', order: 'desc' }]"
            show-select>
            <!-- eslint-disable -->
            <template v-slot:item.korap="x">
              <kwicBtnSearch :query="x.item.korap" />
            </template>
            <template v-slot:item.l="x">
              <p v-if="x.item.l != null" style="text-align: center; margin-top: 5px;">{{ x.item.l }}</p>
              <v-btn style="text-transform: none; margin-left: 10%;" size="small" v-else-if="x.item.l === undefined">
                <v-progress-circular indeterminate color="black" :size="10"></v-progress-circular>
              </v-btn>
              <v-btn style="text-transform: none; margin-left: 10%;" size="small" @click="lookup(idx, x.item.key, x.item.w, 1)"
                v-else>
                <v-icon>mdi-card-search-outline</v-icon>
                Anzeigen
              </v-btn>
            </template>
            <template v-slot:item.p="x">
              <p v-if="x.item.p != null" style="text-align: center; margin-top: 5px;">{{ x.item.p }}</p>
              <v-btn style="text-transform: none; margin-left: 10%;" size="small" v-else-if="x.item.p === undefined">
                <v-progress-circular indeterminate color="black" :size="10"></v-progress-circular>
              </v-btn>
              <v-btn style="text-transform: none; margin-left: 10%;" size="small" @click="lookup(idx, x.item.key, x.item.w, 2)"
                v-else>
                <v-icon>mdi-card-search-outline</v-icon>
                Anzeigen
              </v-btn>
            </template>
            <!-- eslint-enable -->
          </v-data-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-snackbar v-model="snackbar">
      <img :src="'https://www.owid.de/api/qrcode/png?p=' + snackbarQrcode" />
      <v-text-field label="Link" :model-value="snackbarLink" readonly> </v-text-field>
      <a @click="copyToClipboard">
        <v-icon>mdi-content-copy</v-icon><span style="color:white;">{{ $t("lbl_copy") }}</span>
      </a>

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false" style="vertical-aign:bottom">
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
import { useOwidStore } from "../store/owid";

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
      itemsPerPageOptions: [
        { value: 3, title: "3" },
        { value: 5, title: "5" },
        { value: 10, title: "10" },
        { value: 25, title: "25" },
        { value: 50, title: "50" },
        { value: 100, title: "100" },
        { value: 250, title: "250" },
        { value: -1, title: "$vuetify.dataFooter.itemsPerPageAll" },
      ],
      entries: [],

      syncLock: false,
      syncSumSelection: [],

      snackbar: false,
      snackbarLink: "",
      snackbarQrcode: "",
    };
  },

  setup() {
    return { store: useOwidStore() };
  },

  mounted: function () {
    this.headers = [
      { title: this.$t("layer_wordform"), key: "w" },
      { title: this.$t("layer_lemma"), key: "l" },
      { title: this.$t("layer_posTag"), key: "p" },
      { title: this.$t("clipboard_tableHeader_detectedDays"), key: "d", align: "end" },
      { title: this.$t("clipboard_tableHeader_detectedDaysPercent"), key: "dRel", align: "end" },
      { title: this.$t("clipboard_tableHeader_sum"), key: "s", align: "end" },
      { title: this.$t("clipboard_tableHeader_sumRel"), key: "sRel", align: "end" },
      { title: "KorAP", key: "korap", sortable: false },
    ];
  },

  watch: {
    "store.searches": function () {
      this.refreshData();
    },
    selected: function (val) {
      if (this.$data.syncLock) return;

      var sel = [];
      for (var i in val) sel.push(val[i].key);
      this.$data.syncLock = true;
      this.store.selectSearchHistoryItemsChange(sel);
      if (this.store.vizNoCommit === 0) this.store.calculate();
      else this.store.vizNoCommit--;
      this.$data.syncLock = false;
    },
  },

  methods: {
    lookup(idx, key, w, layer) {
      var baseUrl = "https://www.owid.de/plus/live-2021/api/v3";
      var year = this.store.yearFocus;
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
          throw new Error(this.$t("search_progress_err01"));
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
      this.store.selectSearchChange(this.$data.syncSumSelection);
      this.store.calculate();
      this.$data.syncLock = false;
    },
    exportLink(i) {
      var data = this.store.owid.GetSearchHistoryItemRequest(i.label);
      var locale = this.$i18n.locale;
      this.$data.snackbarLink =
        this.$config.webUrl + "?" + (locale != "de" ? "locale=" + locale + "&" : "") + "data=" + btoa(JSON.stringify(data));
      this.$data.snackbarQrcode = encodeURIComponent(this.$data.snackbarLink.replace("https://www.owid.de/"));
      this.$data.snackbar = true;
    },
    export(i, format, mime, fn){
      var exp = this.store.owid.GetSearchHistoryItem4export(i.label);
      var baseUrl = "https://www.owid.de/plus/live-2021/api/v3";

      fetch(`${baseUrl}/convert?N=${exp.N}&format=${format}`, {
        method: "post",
        body: JSON.stringify(exp.Request),
      })
        .then(function (r) {
          return r.arrayBuffer();
        })
        .then(function (buffer) {
          saveBlob(buffer, mime, fn);
        })
        .catch(function (error) {
          console.log("Request failed", error);
        });
    },
    exportTsv(i) {
      this.export(i, "TSV", "text/tab-separated-value", "data.tsv");
    },
    exportCsv(i) {
      this.export(i, "CSV", "text/csv", "data.csv");
    },
    exportHtml(i) {
      this.export(i, "HTML", "text/html", "data.html");
    },
    exportXml(i) {
      this.export(i, "XML", "text/xml", "data.xml");
    },
    exportSql(i) {
      this.export(i, "SQL", "text/sql", "data.sql");
    },
    exportJson(i) {
      var enc = new TextEncoder();
      saveBlob(
        enc.encode(
          JSON.stringify({
            Format: "JSON",
            Owid: this.store.owid.GetSearchHistoryItem4export(i.label),
          })
        ).buffer,
        "application/json",
        "data.json"
      );
    },
    modelSave() {
      var enc = new TextEncoder();
      saveBlob(
        enc.encode(JSON.stringify({ Format: "JSON", Owid: this.store.owid })).buffer,
        "application/json",
        "data.json"
      );
    },
    modelLoad() {
      storeGlobal = this.store;
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
      storeGlobal.modelLoad(obj.Owid);
      storeGlobal.calculate();
      this.refreshData();
    },
    refreshData() {
      if (this.store.owid === null) return;

      var selected = new Set();
      var selectedSums = [];
      var res = [];

      this.store.owid.GetSearchHistory().forEach((key) => {
        var grid = this.store.owid.GetSearchHistoryItem(key, this.store.vizOptionGranulation);

        for (var row in grid) if (grid[row].checked) selected.add(grid[row]);

        res.push({
          label: key,
          checked: this.store.owid.OwidLiveSearches[key].IsSelected,
          grid: grid,
        });

        if (this.store.owid.OwidLiveSearches[key].IsSelected) selectedSums.push(key);
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
