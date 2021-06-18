<template>
  <v-card>
    <v-card-title>
      <v-dialog v-model="dialog_help" width="600" scrollable>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on" style="width:100%">
            <div style="display:block; float:left">
              <v-icon>mdi-compare-horizontal</v-icon>
              <span style="margin-left:10px; font-size:15px"
                >SUCHVERLAUF: Vorangeganenen Suchen vergleichen &amp; verfeinern</span
              >
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
                    Vollständigen Suchverlauf speichern
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
                    Bestehenden Suchverlauf laden
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
            HILFE: Vorangeganenen Suchen vergleichen &amp; verfeinern
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <span>
              Im Abschnitt 'Vorangeganenen Suchen vergleichen &amp; verfeinern' haben Sie folgende Möglichkeiten:<br/> <br/>
              <ul>                
                <li>
                  <strong>Suchen vergleichen</strong> <br />
                  Wenn Sie mehrere Suchanfragen hintereinander ausführen, werden die Ergebnisse hier archiviert und im Detail angezeigt.                  
                </li>
                <li>
                  <strong>Detailansicht und Suchen verfeinern</strong> <br />
                  Die Detailansicht führt genau aus, welche Zeitreihen in einem Suchergebnis zusammengefasst wurden.
                  Sie können einzelne Zeireihen aus- bzw. abwählen. Dadurch können Sie z. B. starke Ausreißer oder ungewollte Ergebnisse filtern.                  
                </li>
                <li>
                  <strong>Suchverlauf komplett speichern und laden</strong>
                  <br />
                  Wenn Sie mehrere Suchen speichern möchten, z. B. um sie später - für ein Seminar oder einen Artikel - wiederzuverwenden, dann können Sie die Symbole
                  (Speichern: <v-icon @click="modelSave">mdi-content-save-outline</v-icon>) und (Laden: <v-icon @click="modelLoad">mdi-folder-outline</v-icon>) nutzen. Die Daten werden dann als
                  JSON-Objekt auf ihrer Festplatte gespeichert. Dadurch können Sie die Daten auch noch nachträglich modifizieren - z. B. eine andere Glättung oder Granulierung wählen.
                  Außerdem können Sie die JSON-Datei weitergeben (z. B. mit einer Seminar-Gruppe teilen).
                </li>
                <li>
                  <strong>Einzelne Suche exportieren</strong> <br />
                  Wenn Sie auf das Dreipunkt-Menü (<v-icon>mdi-dots-vertical</v-icon>) einer einzelnen Suche klicken, können Sie diese Suche exportieren.
                  Folgende Exportformate stehen zur Verfügung:
                  <ul>
                    <li><strong>Link</strong>: Es wird ein Link erzeugt, über den die Suche direkt aufgerufen werden kann (keine extra Eingabe nötig). Dies eigenen sich z. B. wenn Sie eine Suche mit anderen teilen möchten oder wenn Sie die Suche in regelmäßig Abständen wiederholen möchten.</li>
                    <li><strong>TSV</strong>: Erzeugt eine TSV-Tabelle. Diese Tabelle kann z. B. in Excel oder einem anderen Tabellenkalkulationsprogramm geöffnet werdden.</li>
                    <li><strong>JSON</strong>: Ein JSON-Objekt eignet sich besonders für die Weiterverarbeitung mit selbst geschriebenen Programmen und Skripten.</li>
                  </ul>
                </li>
              </ul>
            </span>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_help = false">
              Fenster schließen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
                      ><v-icon style="margin-right:10px">mdi-link-variant</v-icon>Link erzeugen &amp;
                      weitergeben</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item @click="exportTsv(i)">
                    <v-list-item-title
                      ><v-icon style="margin-right:10px">mdi-export</v-icon>TSV-Tabelle (z. B. für
                      Excel)</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item @click="exportJson(i)">
                    <v-list-item-title
                      ><v-icon style="margin-right:10px">mdi-export</v-icon>JSON-Objekt (für
                      Entwickler*innen)</v-list-item-title
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
            :sort-by="['dRel']"
            :sort-desc="[true]"
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
      <a @click="copyToClipboard"> <v-icon>mdi-content-copy</v-icon><span style="color:white;">Kopieren</span> </a>

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
      dialog_help: false,
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
        { text: "Erfasst (Tage)", value: "d", align: "end" },
        { text: "Erfasst (%-Tage)", value: "dRel", align: "end" },
        { text: "Summe", value: "s", align: "end" },
        { text: "Summe (rel.)", value: "sRel", align: "end" },
        { text: "Frequenzkurve", value: "spark", align: "end" },
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
      this.$data.snackbarLink = this.$config.webUrl + btoa(JSON.stringify(data));
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
        enc.encode(JSON.stringify({ Format: "JSON", Owid: this.$store.state.owid })).buffer,
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
          var grid = this.$store.state.owid.GetSearchHistoryItem(key, this.$store.state.vizOptionGranulation);

          for (var row in grid) if (grid[row].checked) selected.add(grid[row]);

          res.push({
            label: key,
            checked: this.$store.state.owid.OwidLiveSearches[key].IsSelected,
            grid: grid,
          });

          if (this.$store.state.owid.OwidLiveSearches[key].IsSelected) selectedSums.push(key);
        });

        data.syncLock = true;
        data.selected = Array.from(selected);
        data.syncSumSelection = selectedSums;
        data.entries = res;

        var exp = [];
        var max = res.length > 3 ? 3 : res.length;
        for (var ei = 0; ei < max; ei++) exp.push(ei);
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
</style>
