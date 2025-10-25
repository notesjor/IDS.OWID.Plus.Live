<template>
  <ClientOnly>
    <VChart autoresize :option="chartOptions" :init-options="initOptions" />
  </ClientOnly>
</template>

<script>
import { ref, computed, provide } from 'vue';
import { useStore } from 'vuex'; // falls du Pinia nutzt, ersetze dies durch den passenden Store-Hook
import { useI18n } from 'vue-i18n';
import VChart, { THEME_KEY } from 'vue-echarts';

import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  CalendarComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  ToolboxComponent,
  DataZoomComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

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
  // Komponenten-Registration (lokal) als Property
  components: { VChart },

  setup() {
    // provide default theme to vue-echarts
    provide(THEME_KEY, 'light');

    const store = useStore();
    const { t } = useI18n();

    const initOptions = ref({
      renderer: 'canvas'
    });

    const chartOptions = computed(() => {
      // Guard: wenn noch keine Daten vorhanden sind
      if (!store.state || store.state.vizData == null) return null;

      const availableDates = store.state.owid?.Dates || [];

      const series = [];

      for (const key in store.state.vizData) {
        if (key === 'ALLE') continue;
        const data = store.state.vizData[key];

        const values = [];
        availableDates.forEach((c) => {
          if (c in data.data) values.push(data.data[c]);
          else values.push(null); // optional: beibehalten der X-Achsen-Positionen
        });

        series.push({
          name: data.name,
          type: 'line',
          data: values,
          showSymbol: false,
          large: true,
          largeThreshold: 2000,
          sampling: 'minmax',
          progressive: 400,
          progressiveThreshold: 2000,
          lineStyle: { width: 2 }
        });
      }

      const unit = store.state.vizOptionRelative ? t('lbl_unit_tokenPPM') : t('lbl_unit_token');

      return {
        toolbox: {
          show: true,
          top: '3%',
          right: '10%',
          feature: {
            saveAsImage: {
              title: t('lbl_save') + ' \xa0 \xa0 \xa0 \xa0 \xa0',
              name: t('lbl_export_fileName')
            }
          }
        },
        animation: false,
        legend: { show: true },
        xAxis: { type: 'category', data: availableDates },
        yAxis: { type: 'value', scale: true },
        series,
        dataZoom: [
          { type: 'slider', show: true },
          { type: 'inside', show: true }
        ],
        tooltip: {
          axisPointer: { snap: true, type: 'cross' },
          formatter: function (params) {
            // params kann Array sein wenn mehrere Series übergeben werden; originales Verhalten beibehalten
            const p = Array.isArray(params) ? params[0] : params;
            const val = (p.value ?? '')
              .toString()
              .replace(',', "'")
              .replace('.', ',');
            return `<strong>${p.seriesName}</strong><br/>${p.name}: ${val} ${unit}`;
          }
        }
      };
    });

    return {
      initOptions,
      chartOptions
    };
  }
};
</script>
