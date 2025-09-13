<template>
  <v-chart ref="myChart" autoresize :option="chartOptions" :init-options="initOptions" :style="chartStyle" />
</template>

<script>
import Vue from "vue";
import VueECharts, { THEME_KEY } from "vue-echarts";

import { use } from "echarts/core";
import {
  HeatmapChart
} from "echarts/charts";
import {
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
  HeatmapChart,
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

var monthMap = {
  nameMap: null,
};

var dayMap = {
  firstDay: 1,
  nameMap: null,
};

export default {
  name: "VizCalendar",
  theme: { dark: false },
  provide: {
    [THEME_KEY]: "light"
  },
  data() {
    return {
      initOptions: {
        renderer: "canvas"
      },
      chartStyle: "min-height:650px;"
    };
  },
  methods: {
    setChartHeight: function (height) {
      this.$data.chartStyle = `min-height:${height}px;`;

      var refs = this.$refs;
      setTimeout(() => {
        refs.myChart.resize({ height: height });
      }, 0);
    }
  },
  created() {
    monthMap.nameMap = [
      this.$t("lbl_month_short_january"),
      this.$t("lbl_month_short_february"),
      this.$t("lbl_month_short_march"),
      this.$t("lbl_month_short_april"),
      this.$t("lbl_month_short_may"),
      this.$t("lbl_month_short_june"),
      this.$t("lbl_month_short_july"),
      this.$t("lbl_month_short_august"),
      this.$t("lbl_month_short_september"),
      this.$t("lbl_month_short_october"),
      this.$t("lbl_month_short_november"),
      this.$t("lbl_month_short_december"),
    ];
    dayMap.nameMap = [
      this.$t("lbl_weekday_short_monday"),
      this.$t("lbl_weekday_short_tuesday"),
      this.$t("lbl_weekday_short_wednesday"),
      this.$t("lbl_weekday_short_thursday"),
      this.$t("lbl_weekday_short_friday"),
      this.$t("lbl_weekday_short_saturday"),
      this.$t("lbl_weekday_short_sunday"),
    ];
    dayMap.firstDay = parseInt(this.$t("lbl_weekday_firstIndex"));
  },
  computed: {
    chartOptions() {
      if (this.$store.state.vizData === null) return;

      var tmp = {};
      Object.keys(this.$store.state.vizData).forEach((sK) => {
        Object.keys(this.$store.state.vizData[sK].data).forEach((d) => {
          this.$store.state.vizData[sK].data[d].dates.forEach((i) => {
            if (i in tmp) tmp[i] += parseFloat(this.$store.state.vizData[sK].data[d].value);
            else tmp[i] = parseFloat(this.$store.state.vizData[sK].data[d].value);
          });
        });
      });

      var res = [];
      Object.keys(tmp).forEach((k) => {
        res.push([k, tmp[k]]);
      });

      var min = 2020;
      var max = 0;

      res.forEach((r) => {
        var val = parseInt(r[0].substring(0, 4));

        if (val < min) min = val;
        if (val > max) max = val;
      });

      var diff = max - min + 1;
      var series = [];
      for (let si = 0; si < diff; si++) {
        series.push({
          type: "heatmap",
          coordinateSystem: "calendar",
          calendarIndex: si,
          data: res,
        });
      }

      var calenderHeight = 175;
      var chartSize = series.length * calenderHeight + 425;
      console.log(chartSize)
      this.setChartHeight(chartSize);      

      var unit = this.$store.state.vizOptionRelative ? this.$t("lbl_unit_tokenPPM") : this.$t("lbl_unit_token");

      var calendars = [];
      var top = 35;
      this.$store.state.years.forEach((year) => {
        calendars.push({
          range: year,
          cellSize: ["auto", 20],
          dayLabel: dayMap,
          monthLabel: monthMap,
          top: top,
        });
        top += calenderHeight;
      });

      return {
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              title: this.$t("lbl_save") + " \xa0 \xa0 \xa0 \xa0 \xa0",
              name: this.$t("lbl_export_fileName"),
            },
          },
        },
        tooltip: {
          position: "top",
          formatter: function (params) {
            return (
              params.value[0].substring(0, 10) +
              ": " +
              params.value[1].toFixed(3).replace(",", "'").replace(".", ",") +
              " " +
              unit
            );
          },
        },
        visualMap: {
          min: Math.min(...res.map((o) => o[1]), 0),
          max: Math.max(...res.map((o) => o[1]), 0),
          calculable: true,
          orient: "horizontal",
          left: "center",
          top: "bottom",
          inRange: {
            color: ["#1feaea", "#ffd200", "#f72047"],
          },
        },
        calendar: calendars,
        series: series,
      };
    },
  },
};
</script>
