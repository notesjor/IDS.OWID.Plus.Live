<template>
  <VueECharts autoresize :option="chartOptions" :init-options="initOptions" />
</template>

<script>
import VueECharts, { THEME_KEY } from "vue-echarts";

import { use } from "echarts/core";

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

export default {
  name: "VizTimeChart",
  theme: { dark: false },
  provide: {
    [THEME_KEY]: "light"
  },
  components: {
    VueECharts
  },
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
    api: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      initOptions: {
        renderer: "canvas"
      },
      chartOptions: {},
    };
  },
  methods: {
    updateChart() {
      console.log("PRESS");
      console.log(this.api);
      if (this.api.vizData === null) return null;

      var availableDates = this.api.owid.Dates;

      var series = [];

      for (const key in this.api.vizData) {
        if (key === "ALLE") continue;
        const data = this.api.vizData[key];

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

      var unit = this.api.vizOptionRelative ? this.$t("lbl_unit_tokenPPM") : this.$t("lbl_unit_token");

      this.chartOptions = {
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
          formatter: function (params) {
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
    }
  },
};
</script>
