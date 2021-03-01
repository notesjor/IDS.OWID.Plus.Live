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
        <!-- ToDo
        <v-col style="text-align:right;">
          <a>
          <v-icon style="block:inline;">mdi-folder-outline</v-icon>
          <span style="margin-left:10px; font-size:15px; color:rgb(0,0,0,0.87)">Laden</span>
          </a>
        </v-col>
        -->
      </v-row>
    </v-card-title>
    <v-expansion-panels multiple>
      <v-expansion-panel v-for="i in entries" :key="i.label">
        <v-expansion-panel-header>
          <div>
            <div style="display:inline;">{{ i.label }}</div>
            <div style="float:right;display:block; margin:-25px 45px 0 0">
              <v-checkbox
                :value="i.label"
                label="Summieren"
                style="max-height:10px; margin: 15px 10px 0 0"
                @change="changeSumSelection"
                v-model="syncSumSelection"
              ></v-checkbox>
            </div>
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
                auto-draw
              ></v-sparkline>
            </template>
            <!-- eslint-enable -->
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-snackbar v-model="snackbar">
      <div style=" width: 95%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; margin-top:8px">
        {{ snackbarLink }}</div>
      <v-icon style="margin-top:-10px;" @click="copyToClipboard">mdi-content-copy</v-icon>

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Ok
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export function saveJson(i) {
  console.log(i);
  download(i, "OWIDplusLIVE.json", "application/json");
}

export function saveClipboard(str){
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

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
      this.$store.commit("calculate");
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
    exportLink(i) {
      var data = this.$store.state.owid.GetSearchHistoryItemRequest(i.label);
      this.$data.snackbarLink = this.$store.state.webUrl + encodeURI(JSON.stringify(data));
      this.$data.snackbar = true;
    },
    exportTsv(i) {
      console.log(i);
    },
    exportJson(i) {
      console.log(i);
    },
    copyToClipboard(){
      saveClipboard(this.$data.snackbarLink);
    }
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
        console.log(res);
        data.syncLock = false;
      },
      {
        deep: true,
      }
    );
  },
};
</script>
