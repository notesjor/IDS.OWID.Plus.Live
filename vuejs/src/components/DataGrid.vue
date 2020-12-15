<template>
  <v-card v-if="status === 'success'">
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Daten durchsuchen..."
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="data_items"
      :search="search"
      :single-select="false"
      v-model="selected"
      item-key="key"
      mutli-sort
      show-select
      show-expand
      :single-expand="true"
      :expanded.sync="expanded"
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
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <h3 style="margin-top:10px">Absoluter Frequenzverlauf</h3>
          <v-sparkline
            :value="item.spark"
            :gradient="gradient"
            :smooth="true"
            :padding="0"
            :gradient-direction="gradientDirection"
            :fill="false"
            :type="type"
            :line-width="1"
            auto-draw
          ></v-sparkline>
          <h3 style="margin-top:10px">Relativer Frequenzverlauf</h3>
          <v-sparkline
            :value="item.sparkNorm"
            :gradient="gradient"
            :smooth="true"
            :padding="0"
            :gradient-direction="gradientDirection"
            :fill="false"
            :type="type"
            :line-width="1"
            auto-draw
          ></v-sparkline>
        </td>
      </template>
      <!-- eslint-enable -->
    </v-data-table>
  </v-card>
  <v-card v-else-if="status === 'init'">
  </v-card>
  <v-card v-else>
    <v-data-table
      loading
      loading-text="Daten werden abgerufen..."
    ></v-data-table>
  </v-card>
</template>

<script>
//import * as echarts from "../assets/echarts.min.js";

export default {
  name: "DataGrid",
  data: () => {
    return {
      name: "world",

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
        { text: "Erfasst an Tagen", value: "d" },
        { text: "Erfasst an Tagen (in %)", value: "dRel" },
        { text: "Summe", value: "s" },
        { text: "Summe (rel.)", value: "sRel" },
        { text: "Frequenzkurve", value: "spark" },
        { text: "Frequenzkurve (rel.)", value: "sparkNorm" },
      ],
    };
  },
  computed: {
    data_items: {
      get() {
        try {
          return this.$store === null ||
            this.$store.state === null ||
            this.$store.state.currentGrid === null
            ? []
            : this.$store.state.currentGrid;
        } catch (error) {
          return [];
        }
      },
    },
    status: {
      get() {
        return this.$store.state.status;
      },
    },
  },
  // define methods under the `methods` object
  methods: {
    greet: function() {
      this.$store.commit("increment");
      alert("Hello " + this.$data + " (" + this.$store.state.count + ")!");
    },

  },
};
</script>
