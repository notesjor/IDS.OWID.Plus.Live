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
    <v-expansion-panels accordion>
      <v-expansion-panel v-for="i in entries" :key="i">
        <v-expansion-panel-header>{{ i.label }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table
            :headers="headers"
            :items="i.grid"
            :search="search"
            :single-select="true"
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
    };
  },

  computed: {
    entries: function() {
      if (this.$store.state.owid === null) return;

      var res = [];
      this.$store.state.owid
        .GetSearchHistory(this.$store.state.N)
        .forEach((key) => {
          res.push({
            label: key,
            grid: this.$store.state.owid.GetSearchHistoryItem(key, this.$store.state.N),
          });
        });
console.log("1");
      return res;
    },
  },
};
</script>
