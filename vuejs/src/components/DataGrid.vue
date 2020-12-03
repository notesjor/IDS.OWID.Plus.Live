<template>
  <v-card>
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
      :single-select="true"
      v-model="selected"
      item-key="key"
      mutli-sort
      show-select
    >
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "DataGrid",
  data: () => {
    return {
      name: "world",

      selected: [],
      search: "",
      headers: [
        { text: "Wortform", value: "w" },
        { text: "Lemma", value: "l" },
        { text: "POS-Tag", value: "p" },
        { text: "Erfasst an Tagen", value: "d" },
        { text: "Summe", value: "s" },
        { text: "Summe (rel.)", value: "sRel" },
      ],
    };
  },
  computed: {
    data_items: {
      get() {
        try {
          return this.$store === null ||
            this.$store.state === null ||
            this.$store.state.resultGrid === null
            ? []
            : this.$store.state.resultGrid;
        } catch (error) {
          return [];
        }
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
