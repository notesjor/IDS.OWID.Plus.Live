<template>
  <div
    id="chart"
    style="width: 110%; height: 68vh; margin: -50px 0px 0px -40px"
  >
    {{ update }}
  </div>
</template>

<script>
//import * as echarts from "echarts";

export default {
  name: "VizBoxplot",
  theme: { dark: false },
  computed: {
    update: {
      get() {
        if (this.$store.state.dates === null) return;
        if (this.$store.state.resultSeries === null) return;

        return "";
      },
    },
  },
};
</script>
