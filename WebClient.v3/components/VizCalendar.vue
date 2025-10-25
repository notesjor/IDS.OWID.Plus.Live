<template>
  <v-chart
    ref="myChart"
    autoresize
    :option="chartOptions"
    :init-options="initOptions"
    :style="chartStyle"
  />
</template>

<script>
import { defineComponent, ref, computed, onMounted, provide, nextTick } from "vue";
import VueECharts, { THEME_KEY } from "vue-echarts";

import { use } from "echarts/core";
import { HeatmapChart } from "echarts/charts";
import {
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
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  CanvasRenderer,
  ToolboxComponent,
  DataZoomComponent,
]);

export default defineComponent({
  name: "VizCalendar",
  components: {
    "v-chart": VueECharts,
  },
  setup() {
    // Theme provide (wie vorher)
    provide(THEME_KEY, "light");

    // init options & style
    const initOptions = ref({ renderer: "canvas" });
    const chartStyle = ref("min-height:650px;");

    // refs
    const myChart = ref(null);

    // month/day maps
    const monthMap = ref({ nameMap: [] });
    const dayMap = ref({ firstDay: 1, nameMap: [] });

    // i18n / store access (Anpassung ggf. nötig)
    // Versuche useI18n falls installiert, ansonsten useNuxtApp.$t
    let t = (s) => s;
    try {
      // eslint-disable-next-line no-undef
      const { useI18n } = require("vue-i18n");
      t = useI18n ? useI18n().t : t;
    } catch (e) {
      // fallback zu Nuxt runtime (wenn verfügbar)
      try {
        // eslint-disable-next-line no-undef
        const { useNuxtApp } = require("#app");
        const nuxt = useNuxtApp();
        if (nuxt && nuxt.$t) t = nuxt.$t.bind(nuxt);
      } catch (err) {
        // leave default
      }
    }

    // Nuxt store access: versucht nuxtApp.$store (Vuex) als Fallback.
    let nuxtStore = null;
    try {
      // eslint-disable-next-line no-undef
      const { useNuxtApp } = require("#app");
      const nuxt = useNuxtApp();
      if (nuxt) {
        nuxtStore = nuxt.$store || nuxt.$pinia || null;
      }
    } catch (e) {
      nuxtStore = null;
    }

    // Helper: set chart height and trigger resize
    function setChartHeight(height) {
      chartStyle.value = `min-height:${height}px;`;
      // wait nextTick then call resize on chart instance
      nextTick(() => {
        const inst = myChart.value && myChart.value.__chart ? myChart.value.__chart : myChart.value;
        try {
          if (inst && typeof inst.resize === "function") inst.resize({ height });
        } catch (e) {
          // ignore
        }
      });
    }

    // populate month/day names on mount
    onMounted(() => {
      monthMap.value.nameMap = [
        t("lbl_month_short_january"),
        t("lbl_month_short_february"),
        t("lbl_month_short_march"),
        t("lbl_month_short_april"),
        t("lbl_month_short_may"),
        t("lbl_month_short_june"),
        t("lbl_month_short_july"),
        t("lbl_month_short_august"),
        t("lbl_month_short_september"),
        t("lbl_month_short_october"),
        t("lbl_month_short_november"),
        t("lbl_month_short_december"),
      ];
      dayMap.value.nameMap = [
        t("lbl_weekday_short_monday"),
        t("lbl_weekday_short_tuesday"),
        t("lbl_weekday_short_wednesday"),
        t("lbl_weekday_short_thursday"),
        t("lbl_weekday_short_friday"),
        t("lbl_weekday_short_saturday"),
        t("lbl_weekday_short_sunday"),
      ];
      const firstIdx = parseInt(t("lbl_weekday_firstIndex"));
      dayMap.value.firstDay = isNaN(firstIdx) ? 1 : firstIdx;
    });

    // computed chart options (reads store if vorhanden)
    const chartOptions = computed(() => {
      const storeState = nuxtStore && nuxtStore.state ? nuxtStore.state : (nuxtStore || {}).state || null;
      // if no store state, return undefined to avoid rendering wrong config
      if (!storeState || !storeState.vizData) return {};

      const vizData = storeState.vizData;
      const tmp = {};
      Object.keys(vizData).forEach((sK) => {
        Object.keys(vizData[sK].data).forEach((d) => {
          vizData[sK].data[d].dates.forEach((i) => {
            if (i in tmp) tmp[i] += parseFloat(vizData[sK].data[d].value);
            else tmp[i] = parseFloat(vizData[sK].data[d].value);
          });
        });
      });

      const res = [];
      Object.keys(tmp).forEach((k) => {
        res.push([k, tmp[k]]);
      });

      let min = 2020;
      let max = 0;
      res.forEach((r) => {
        const val = parseInt(r[0].substring(0, 4));
        if (val < min) min = val;
        if (val > max) max = val;
      });

      const diff = max - min + 1;
      const series = [];
      for (let si = 0; si < diff; si++) {
        series.push({
          type: "heatmap",
          coordinateSystem: "calendar",
          calendarIndex: si,
          data: res,
        });
      }

      const calenderHeight = 175;
      const chartSize = series.length * calenderHeight + 425;
      // set height
      setChartHeight(chartSize);

      const unit = storeState.vizOptionRelative ? t("lbl_unit_tokenPPM") : t("lbl_unit_token");

      const calendars = [];
      let top = 35;
      const years = storeState.years || [];
      years.forEach((year) => {
        calendars.push({
          range: year,
          cellSize: ["auto", 20],
          dayLabel: dayMap.value,
          monthLabel: monthMap.value,
          top: top,
        });
        top += calenderHeight;
      });

      return {
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              title: t("lbl_save") + " \xa0 \xa0 \xa0 \xa0 \xa0",
              name: t("lbl_export_fileName"),
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
    });

    return {
      initOptions,
      chartStyle,
      chartOptions,
      myChart,
      setChartHeight,
    };
  },
});
</script>
