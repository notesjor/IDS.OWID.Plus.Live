<template>
  <v-card>Hello</v-card>
</template>

<script>
 export default {
  name: "VizOptions",

  data: () => {
    return {
      name: "world",
    };
  },
  methods: {
    greet: function() {
      this.$store.commit("increment");
    }
  },
};
</script>
