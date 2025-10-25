<template>
  <VChart
    ref="myChart"
    autoresize
    :option="chartOptions"
    :init-options="initOptions"
  />
</template>

<script setup>
import { ref, computed, nextTick, provide } from 'vue';
import VChart, { THEME_KEY } from 'vue-echarts';
import { useI18n } from 'vue-i18n';

import { use } from 'echarts/core';
import { SankeyChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  ToolboxComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

use([
  SankeyChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  CanvasRenderer,
  ToolboxComponent,
]);

// Theme wie im Original bereitstellen
provide(THEME_KEY, 'light');

// Props (anstatt direkten Zugriffs auf this.$store)
const props = defineProps({
  vizData: { type: Object, default: null },
  vizOptionRelative: { type: Boolean, default: false },
});

const { t } = useI18n();

const myChart = ref(null);
const initOptions = { renderer: 'canvas' };

const chartOptions = computed(() => {
  if (!props.vizData) return {};

  const tnodes = new Set();
  const links = [];

  for (const key in props.vizData) {
    if (key === 'ALLE') continue;
    const data = props.vizData[key];

    Object.keys(data.items).forEach((key2) => {
      let sum = 0;
      Object.keys(data.items[key2].data).forEach((key3) => {
        sum += data.items[key2].data[key3].value;
      });

      const tokens = data.items[key2].name.split(' ');
      let last = '0>>>';
      let n = 1;
      tokens.forEach((tk) => {
        const ntk = n + tk;
        tnodes.add(ntk);

        if (last != null) links.push({ source: last, target: ntk, value: sum });

        last = ntk;
        n++;
      });
    });
  }

  const nodes = [{ name: '', id: '0>>>' }];
  Array.from(tnodes).forEach((nt) => nodes.push({ name: nt.substring(1), id: nt }));

  // Höhe setzen (asynchron nachdem nodes berechnet sind)
  nextTick(() => {
    const height = nodes.length * 20;
    if (myChart.value && typeof myChart.value.resize === 'function') {
      try {
        myChart.value.resize({ height });
      } catch (e) {
        // ignore
      }
    }
  });

  const unit = props.vizOptionRelative ? t('lbl_unit_tokenPPM') : t('lbl_unit_token');

  return {
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          title: t('lbl_save') + ' \xa0 \xa0 \xa0 \xa0 \xa0',
          name: t('lbl_export_fileName'),
        },
      },
    },
    animation: false,
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: function (params) {
        return (
          (params.data.source === 'START >>>' ? '' : (params.data.source ? params.data.source.substring(1) : '')) +
          ' -- ' +
          params.data.value
            .toFixed(3)
            .replace(',', "'")
            .replace('.', ',') +
          ' ' +
          unit +
          ' -> ' +
          (params.data.target ? params.data.target.substring(1) : '')
        );
      },
    },
    series: [
      {
        type: 'sankey',
        data: nodes,
        dataLabels: {
          allowOverlap: false,
        },
        links: links,
        emphasis: {
          focus: 'adjacency',
        },
        lineStyle: {
          curveness: 0.5,
        },
        label: {
          formatter: function (params) {
            return params.data.name;
          },
        },
      },
    ],
  };
});
</script>
