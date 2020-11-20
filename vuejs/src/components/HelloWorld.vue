<template>
  <v-theme-provider light>
    <v-container>
      <v-row class="text-center">
        <v-col cols="12">
          Hello
        </v-col>
      </v-row>
      <v-row class="text-center">
        <v-col>
          Hello
        </v-col>
        <v-col>
          Hello
        </v-col>
      </v-row>
      <v-col cols="1">
        <v-row>hey</v-row>
        <v-row>hey</v-row>
        <v-row>hey</v-row>
      </v-col>
      <v-col cols="2">
        <v-row>hey</v-row>
        <v-row>hey</v-row>
        <v-row><v-btn v-on:click="greet">Greet</v-btn></v-row>
      </v-col>
    </v-container>
  </v-theme-provider>
</template>

<script>
export default {
  name: "HelloWorld",

  data: () => {
    return "world";
  },
  // define methods under the `methods` object
  methods: {
    greet: function() {
      // `this` inside methods points to the Vue instance
      alert("Hello " + this.$data + "!");
    },
  },
};
</script>
