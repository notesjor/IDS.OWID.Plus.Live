<template>
<v-container>
  <v-row>
    <v-col class="d-flex justify-left">
      <v-switch
      v-model="switch1"
      label="Relative Frequenz"
    ></v-switch>
    <v-switch
      v-model="switch2"
      label="Summieren"
    ></v-switch>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
 export default {
  name: "VizOptions",

  data: () => {
    return {
      name: "world",
      switch1: true,
      switch2: true
    };
  },
  methods: {
    greet: function() {
      this.$store.commit("increment");
    }
  },
};
</script>
