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
            min="1"
            thumb-label="always"
            :max="smoothMax"
            :tick-labels="smoothLabels"
            ticks="always"
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

  switch (g) {
    case 1:
      this.$data.smoothMax = 52;
      this.$data.smoothLabels = ["1","","","4","","","","8","","","","12","","","","16","","","","20","","","","24","","26","","28","","","","32","","","","36","","","","40","","","","44","","","","48","","","","52"];
      break;
    case 2:
      this.$data.smoothMax = 24;
      this.$data.smoothLabels = ["1","2","","4","","6","","8","","","","12","","","","16","","18","","20","","","","24"];
      break;
    case 3:
      this.$data.smoothMax = 8;
      this.$data.smoothLabels = ["1","2","","4","","6","","8"];
      break;
    case 4:
      this.$data.smoothMax = 10;
      this.$data.smoothLabels = ["1","","","","5","","","","","10"];
      break;
    default:
      this.$data.smoothMax = 31;
      this.$data.smoothLabels = ["1","","","","","","7","","","","","","","14","","","","","","","21","","","","","","","28","","","31"];
      break;
  }

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
      smoothMin: 1,
      smoothMax: 31,
      granulationValue: 0,
      granulationLabels: ["Tag", "Woche", "Monat", "Quartal", "Jahr"],
      smoothLabels: ["1","","","","","","7","","","","","","","14","","","","","","","21","","","","","","","28","","","31"]
    };
  },
  watch: {
    relativeFrequency: commit,
    smoothValue: commit,
    granulationValue: commit,
  },
};
</script>
