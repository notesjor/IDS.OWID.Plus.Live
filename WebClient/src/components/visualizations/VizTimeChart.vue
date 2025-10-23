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

        var availableDates = this.$store.state.owid.Dates;

        var series = [];

        for (const key in this.$store.state.vizData) {
          if (key === "ALLE") continue;
          const data = this.$store.state.vizData[key];

          var values = [];
          availableDates.forEach((c) => {
            if (c in data.data) values.push(data.data[c]);
          });
          
          series.push({
            name: data.name,
            type: "line",
            data: values,
            showSymbol: false,
            large: true,
            largeThreshold: 2000,
            sampling: "minmax",
            progressive: 400,
            progressiveThreshold: 2000,
            lineStyle: { width: 2 }
          });
        }

        var unit = this.$store.state.vizOptionRelative ? this.$t("lbl_unit_tokenPPM") : this.$t("lbl_unit_token");

        return {
          toolbox: {
            show: true,
            top: "3%",
            right: "10%",
            feature: {
              saveAsImage: {
                title: this.$t("lbl_save") + " \xa0 \xa0 \xa0 \xa0 \xa0",
                name: this.$t("lbl_export_fileName"),
              },
            },
          },
          animation: false,
          legend: {
            show: true,
          },
          xAxis: {
            type: "category",
            data: availableDates,
          },
          yAxis: {
            type: "value",
            scale: true,
          },
          series: series,
          dataZoom: [
            { type: "slider", show: true },
            { type: "inside", show: true },
          ],
          tooltip: {
            axisPointer: {
              snap: true,
              type: "cross",
            },
            formatter: function(params) {
              return (
                "<strong>" +
                params.seriesName +
                "</strong><br/>" +
                params.name +
                ": " +
                params.value
                  .toString()
                  .replace(",", "'")
                  .replace(".", ",") +
                " " +
                unit
              );
            },
          },
        };
    },
  },
};
</script>
