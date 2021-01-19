<template>
  <v-card>
    <v-card-title>
      <div>
        <v-icon>mdi-compare-horizontal</v-icon
        ><span style="margin-left:10px; font-size:15px"
          >SUCHVERLAUF: Vorangeganenen Suchen vergleichen &amp; verfeinern</span
        >
      </div>
    </v-card-title>
    <v-expansion-panels multiple>
      <v-expansion-panel v-for="i in entries" :key="i.label">
        <v-expansion-panel-header>
          <div>
            <div style="display:inline;">{{ i.label }}</div>
            <div style="float:right;display:block; margin-top:-25px">
              <v-checkbox
                :value="i.label"
                label="Summieren"
                style="max-height:10px; margin: 15px 10px 0 0"
                @change="changeSumSelection"
                v-model="syncSumSelection"
              ></v-checkbox>
            </div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table
            :headers="headers"
            :items="i.grid"
            :search="search"
            :single-select="false"
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
  </v-card>
</template>

<script>
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
    };
  },

  watch: {
    selected: function(val) {
      if (this.$data.syncLock) return;

var sel = [];
for(var i in val)
sel.push(val[i].key);
console.log(sel);
      this.$data.syncLock = true;
      this.$store.commit("updateStatus", "pending");
      this.$store.commit("selectSearchHistoryItemsChange", sel);
      this.$store.commit("calculate");
      this.$store.commit("updateStatus", "success");
      this.$data.syncLock = false;
    },
  },

  methods: {
    changeSumSelection: function() {
      if (this.$data.syncLock) return;

      this.$data.syncLock = true;
      this.$store.commit("updateStatus", "pending");
      this.$store.commit("selectSearchChange", this.$data.syncSumSelection);
      this.$store.commit("calculate");
      this.$store.commit("updateStatus", "success");
      this.$data.syncLock = false;
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
        data.syncLock = false;
      },
      {
        deep: true,
      }
    );
  },
};
</script>
