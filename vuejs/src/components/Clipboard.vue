<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col style="text-align:left;">
          <v-icon>mdi-compare-horizontal</v-icon>
          <span style="margin-left:10px; font-size:15px"
            >SUCHVERLAUF: Vorangeganenen Suchen vergleichen &amp;
            verfeinern</span
          >
        </v-col>
        <v-col style="text-align:right;">
          <v-icon style="block:inline; margin-right:10px;" @click="modelLoad"
            >mdi-folder-outline</v-icon
          >
          <v-icon style="block:inline;" @click="modelSave"
            >mdi-content-save-outline</v-icon
          >
          <input
            type="file"
            id="fileinput"
            style="visibility: collapse; width:0px"
          />
        </v-col>
      </v-row>
    </v-card-title>
    <v-expansion-panels multiple v-model="expanded">
      <v-expansion-panel v-for="(i, idx) in entries" :key="idx" expand>
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
                    <v-list-item-title
                      ><v-icon style="margin-right:10px"
                        >mdi-link-variant</v-icon
                      >Link erzeugen</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item @click="exportTsv(i)">
                    <v-list-item-title
                      ><v-icon style="margin-right:10px">mdi-export</v-icon
                      >TSV-Tabelle</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item @click="exportJson(i)">
                    <v-list-item-title
                      ><v-icon style="margin-right:10px">mdi-export</v-icon
                      >JSON-Objekt</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table
            :headers="headers"
            :items="i.grid"
            :search="search"
            :single-select="false"
            :footer-props="{ itemsPerPageOptions: [10, 20, 50, 100, 250, -1] }"
            @input="selectionChanged"
            v-model="selected"
            item-key="key"
            mutli-sort
            show-select
          >
            <!-- eslint-disable -->
            <template v-slot:item.spark="x">
              <v-sparkline
                :value="x.item.spark"
                :gradient="gradient"
                :smooth="true"
                :padding="0"
                :gradient-direction="gradientDirection"
                :fill="false"
                :type="type"
                :auto-line-width="true"
                auto-draw-easing="none"
                auto-draw
              ></v-sparkline>
            </template>
            <template v-slot:item.sparkNorm="x">
              <v-sparkline
                :value="x.item.spark"
                :gradient="gradient"
                :smooth="true"
                :padding="0"
                :gradient-direction="gradientDirection"
                :fill="false"
                :type="type"
                :auto-line-width="true"
                auto-draw-easing="none"
                auto-draw
              ></v-sparkline>
            </template>
            <!-- eslint-enable -->
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-snackbar v-model="snackbar">
      <v-text-field label="Link" :value="snackbarLink" readonly> </v-text-field>
      <a @click="copyToClipboard">
        <v-icon>mdi-content-copy</v-icon
        ><span style="color:white;">Kopieren</span>
      </a>

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Ok
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
  setTimeout(function() {
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

export function handleFileSelect(e) {
  var files = e.target.files;
  if (files.length < 1) {
    alert("select a file...");
    return;
  }
  var file = files[0];
  var reader = new FileReader();
  reader.onload = onFileLoaded;
  reader.readAsDataURL(file);
}

export function onFileLoaded(e) {
  var match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
  if (match == null) {
    throw "Could not parse result";
  }
  var obj = JSON.parse(atob(match[2]));
  storeGlobal.commit("modelLoad", obj.Owid);
  storeGlobal.commit("calculate");  
}

export var storeGlobal;

export default {
  name: "Clipboard",

  data: () => {
    return {
      gradient: ["#f72047", "#ffd200", "#1feaea"],
      gradientDirection: "top",
      type: "trend",

      expanded: [],
      selected: [],
      search: "",
      headers: [
        { text: "Wortform", value: "w" },
        { text: "Lemma", value: "l" },
        { text: "POS-Tag", value: "p" },
        { text: "Erfasst (Tage)", value: "d" },
        { text: "Erfasst (%-Tage)", value: "dRel" },
        { text: "Summe", value: "s" },
        { text: "Summe (rel.)", value: "sRel" },
        { text: "Frequenzkurve", value: "spark" },
        { text: "Frequenzkurve (rel.)", value: "sparkNorm" },
      ],
      entries: [],

      syncLock: false,
      syncSumSelection: [],

      snackbar: false,
      snackbarLink: "",
    };
  },

  watch: {
    selected: function(val) {
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
    changeSumSelection: function() {
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
      this.$data.snackbarLink =
        this.$config.webUrl + btoa(JSON.stringify(data));
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
        .then(function(r) {
          return r.arrayBuffer();
        })
        .then(function(buffer) {
          saveBlob(buffer, "text/tab-separated-value", "data.tsv");
        })
        .catch(function(error) {
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
        enc.encode(
          JSON.stringify({ Format: "JSON", Owid: this.$store.state.owid })
        ).buffer,
        "application/json",
        "data.json"
      );
    },
    modelLoad() {
      storeGlobal = this.$store;
      var fileinput = document.getElementById("fileinput");
      fileinput.addEventListener("change", handleFileSelect);
      fileinput.click();
    },
    copyToClipboard() {
      saveClipboard(this.$data.snackbarLink);
    },
  },

  created() {
    var data = this.$data;

    this.$store.watch(
      () => {
        return this.$store.state.searches;
      },
      () => {
        if (this.$store.state.owid === null) return;

        var selected = new Set();
        var selectedSums = [];
        var res = [];

        this.$store.state.owid.GetSearchHistory().forEach((key) => {
          var grid = this.$store.state.owid.GetSearchHistoryItem(
            key,
            this.$store.state.vizOptionGranulation
          );

          for (var row in grid) if (grid[row].checked) selected.add(grid[row]);

          res.push({
            label: key,
            checked: this.$store.state.owid.OwidLiveSearches[key].IsSelected,
            grid: grid,
          });

          if (this.$store.state.owid.OwidLiveSearches[key].IsSelected)
            selectedSums.push(key);
        });

        data.syncLock = true;
        data.selected = Array.from(selected);
        data.syncSumSelection = selectedSums;
        data.entries = res;

        var exp = [];
        var max = res.length > 3 ? 3 : res.length;
        for(var ei = 0; ei < max; ei++)        
          exp.push(ei);
        data.expanded = exp;

        data.syncLock = false;
      },
      {
        deep: true,
      }
    );
  },
};
</script>
