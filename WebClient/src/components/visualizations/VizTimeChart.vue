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
  props: {
    chartOptions: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      initOptions: {
        renderer: "canvas"
      },
    };
  },
};
</script>
