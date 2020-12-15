<template>
  <v-card style="pagging-bottom:-15px">
    <v-container>
      <v-row>
        <v-col class="d-flex justify-left" style="margin-top:-15px;">
          <v-switch v-model="relativeFrequency" label="Relative Frequenz"></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-left">
          <label
            for="granulation"
            class="v-label theme--light"
            style="margin-top:-20px"
            >Granulierung:</label
          >
          <v-slider
            id="granulation"
            v-model="granulationValue"
            min="1"
            max="5"
            ticks="always"
            :tick-labels="granulationLabels"
            step="1"
            style="margin-left:10px; margin-top:-27px"
          ></v-slider>
        </v-col>
        <v-col class="d-flex justify-left">
          <label
            for="smooth"
            class="v-label theme--light"
            style="margin-top:-20px"
            >Glättung:</label
          >
          <v-slider
            id="smooth"
            v-model="smoothValue"
            thumb-label
            min="1"
            max="365"
            style="margin-left:10px; margin-top:-27px"
          ></v-slider>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "VizOptions",

  data: () => {
    return {
      name: "world",
      relativeFrequency: true,
      smoothValue: 7,
      granulationValue: 1,
      granulationLabels: ["Tag", "Woche", "Monat", "Quartal", "Jahr"],
    };
  },
  methods: {
    greet: function() {
      this.$store.commit("increment");
    },
  },
};
</script>
