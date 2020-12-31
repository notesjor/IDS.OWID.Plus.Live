<template>
  <v-card style="pagging-bottom:-15px">
    <v-card-title>
      <div>
        <v-icon>mdi-eye-outline</v-icon
        ><span style="margin-left:10px; font-size:15px"
          >ANPASSEN: Einstellungen für Visualisierung ändern</span
        >
      </div>
    </v-card-title>
    <v-container>
      <v-row>
        <v-col
          class="d-flex justify-left"
          style="margin-top:-30px; margin-bottom:10px"
        >
          <v-switch
            v-model="relativeFrequency"
            label="Relative Frequenz"
          ></v-switch>
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
            min="0"
            max="4"
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
function commit() {
  var r = this.$data.relativeFrequency;
  var s = this.$data.smoothValue;
  var g = this.$data.granulationValue;

  this.$store.commit("updateStatus", "pending");
  this.$store.commit("vizOption", { r, s, g });
  this.$store.commit("calculate");
  this.$store.commit("updateStatus", "success");
}

export default {
  name: "VizOptions",

  data: () => {
    return {
      name: "world",
      relativeFrequency: true,
      smoothValue: 7,
      granulationValue: 0,
      granulationLabels: ["Tag", "Woche", "Monat", "Quartal", "Jahr"],
    };
  },
  watch: {
    relativeFrequency: commit,
    smoothValue: commit,
    granulationValue: commit,
  },
  methods: {
    greet: function() {
      this.$store.commit("increment");
    },
  },
};
</script>
