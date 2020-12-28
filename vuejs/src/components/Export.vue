<template>
  <v-card>
    <v-card-title>
      <div>
        <v-icon>mdi-export</v-icon
        ><span style="margin-left:10px; font-size:15px"
          >EXPORT: Visualisierung &amp; Daten für Weiterverarbeitung exportieren</span
        >
      </div>
    </v-card-title>
    <v-card-text style="text-align:left;">
      <v-btn>CSV</v-btn>
      <v-btn>JSON</v-btn>
      <v-btn>PNG</v-btn>
      <v-btn>LINK</v-btn>
      <v-btn>IFRAME</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Export",

  data: () => {
    return {
      name: "world",
    };
  },
  methods: {
    greet: function() {},
  },
};
</script>
