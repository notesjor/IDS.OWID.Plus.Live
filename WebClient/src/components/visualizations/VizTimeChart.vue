<template>
  <v-chart autoresize :option="chartOptions" :init-options="initOptions" />
</template>

<script>
import Vue from "vue";
import VueECharts, { THEME_KEY } from "vue-echarts";

import {  use } from "echarts/core";
import {
  LineChart
} from "echarts/charts";
import {
  CalendarComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  ToolboxComponent,
  DataZoomComponent
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

use([
  LineChart,
  CalendarComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  CanvasRenderer,
  ToolboxComponent,
  DataZoomComponent
]);

Vue.component('v-chart', VueECharts);

export default {
  name: "VizTimeChart",
  theme: { dark: false },
  provide: {
    [THEME_KEY]: "light"
  },
  data() {
    return {
      initOptions: {
        renderer: "canvas"
      },
    };
  },
  computed:{
    chartOptions(){
      if (this.$store.state.vizData === null) return null;
      console.log(">>> VizTimeChart: get chartOptions");
      var res =this.$store.state.vizData;
      console.log(">>> VizTimeChart: return chartOptions");
      return res;
    },
  },
};
</script>
