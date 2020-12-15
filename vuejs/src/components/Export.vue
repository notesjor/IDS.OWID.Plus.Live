<template>
  <v-card>
    <v-card-title>
      Export
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
