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
        <v-expansion-panel-header
          ><v-checkbox
            :input-value="i.checked"
            :label="i.label"
            :value="i.label"
            style="max-height:10px; margin-top:-10px; margin-bottom:10px"
            @change="changeSumSelection"
          ></v-checkbox
        ></v-expansion-panel-header>
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
    };
  },

  watch: {
    selected: function(val) {
      console.log(val);
    },
  },

  methods: {
    changeSumSelection: function(val, item, x){
      console.log(item);
      console.log(val);
      console.log(x);
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
        });

        data.selected = Array.from(selected);
        console.log(data.selected);
        data.entries = res;
      },
      {
        deep: true,
      }
    );
  },
};
</script>
