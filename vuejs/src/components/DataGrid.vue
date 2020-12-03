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
      headers:[
        {text: "Name", value:"name"},
        {text: "Wert", value:"amount"},
      ],
      data_items: [
        {key:"key1", name:"x", amount:5},
        {key:"key2", name:"y", amount:4},
        {key:"key3", name:"z", amount:6},
        {key:"key4", name:"a", amount:8}
      ]
    };
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
