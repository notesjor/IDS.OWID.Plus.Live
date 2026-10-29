<template>
  <v-chart ref="myChart" autoresize :option="chartOptions" :init-options="initOptions" :style="chartStyle" />
</template>

<script>
import VueECharts, { THEME_KEY } from "vue-echarts";

import { use } from "echarts/core";
import {
  SankeyChart
} from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  ToolboxComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useOwidStore } from "../../store/owid";

use([
  SankeyChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  CanvasRenderer,
  ToolboxComponent
]);


export default {
  name: "VizSankey",
  components: { VChart: VueECharts },
  setup() {
    return { store: useOwidStore() };
  },
  provide: {
    [THEME_KEY]: "light"
  },
  data() {
    return {
      initOptions: {
        renderer: "canvas"
      },
      chartStyle: "height:400px;"
    };
  },
  methods:{
    setChartHeight: function (height) {
      this.chartStyle = `height:${height}px;`;

      var refs = this.$refs;
      setTimeout(() => {
        if (refs.myChart) refs.myChart.resize({ height: height });
      }, 0);
    }
  },
  computed: {
    chartOptions() {
      if (this.store.vizData === null) return;

      var tnodes = new Set();
      var links = [];

      console.log(this.store.vizData);

      for (const key in this.store.vizData) {
        if (key === "ALLE") continue;
        const data = this.store.vizData[key];

        Object.keys(data.items).forEach((key2) => {
          var sum = 0;
          Object.keys(data.items[key2].data).forEach((key3) => {
            sum += data.items[key2].data[key3].value;
          });

          var tokens = data.items[key2].name.split(" ");
          var last = "0>>>";
          var n = 1;
          tokens.forEach((t) => {
            var ntk = n + t;
            tnodes.add(ntk);
            n++;

            if (last != null) links.push({ source: last, target: ntk, value: sum });

            last = ntk;
          });
        });
      }

      var nodes = [];
      nodes.push({ name: "", id: "0>>>" });
      Array.from(tnodes).forEach((nt) => {
        nodes.push({ name: nt.substring(1), id: nt });
      });

      this.setChartHeight(nodes.length * 20);

      var unit = this.store.vizOptionRelative ? this.$t("lbl_unit_tokenPPM") : this.$t("lbl_unit_token");

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
        animation: false,
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          formatter: function (params) {
            return (
              (params.data.source === "START >>>" ? "" : params.data.source.substring(1)) +
              " -- " +
              params.data.value
                .toFixed(3)
                .replace(",", "'")
                .replace(".", ",") +
              " " +
              unit +
              " -> " +
              params.data.target.substring(1)
            );
          },
        },
        series: [
          {
            type: "sankey",
            data: nodes,
            dataLabels: {
              allowOverlap: false
            },
            links: links,
            emphasis: {
              focus: "adjacency",
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
    },
  },
};
</script>
