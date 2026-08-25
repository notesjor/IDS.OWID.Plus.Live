<template>
  <v-chart autoresize :option="chartOptions" :init-options="initOptions" />
</template>

<script>
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  CalendarComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  ToolboxComponent,
  DataZoomComponent,
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
  DataZoomComponent,
]);

export default {
  name: "VizTimeChart",
  theme: { dark: false },
  data() {
    return {
      initOptions: {
        renderer: "canvas",
      },
    };
  },
  computed: {
    chartOptions() {
      if (this.$store.state.vizData === null) return null;

      const availableDates = this.$store.state.owid.Dates;
      const series = [];

      for (const key in this.$store.state.vizData) {
        if (key === "ALLE") continue;
        const data = this.$store.state.vizData[key];

        const values = [];
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
          lineStyle: { width: 2 },
        });
      }

      const unit = this.$store.state.vizOptionRelative ? this.$t("lbl_unit_tokenPPM") : this.$t("lbl_unit_token");

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
        legend: { show: true },
        xAxis: {
          type: "category",
          data: availableDates,
        },
        yAxis: {
          type: "value",
          scale: true,
        },
        series,
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
    },
  },
};
</script>
