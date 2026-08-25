<template>
  <v-chart ref="myChart" autoresize :option="chartOptions" :init-options="initOptions" />
</template>

<script>
import { use } from "echarts/core";
import { SankeyChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  ToolboxComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

use([
  SankeyChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  CanvasRenderer,
  ToolboxComponent,
]);

export default {
  name: "VizSankey",
  theme: { dark: false },
  data() {
    return {
      initOptions: {
        renderer: "canvas",
      },
    };
  },
  methods: {
    setChartHeight(height) {
      const refs = this.$refs;
      setTimeout(() => {
        refs.myChart.resize({ height });
      }, 0);
    },
  },
  computed: {
    chartOptions() {
      if (this.$store.state.vizData === null) return;

      const tnodes = new Set();
      const links = [];

      for (const key in this.$store.state.vizData) {
        if (key === "ALLE") continue;
        const data = this.$store.state.vizData[key];

        Object.keys(data.items).forEach((key2) => {
          let sum = 0;
          Object.keys(data.items[key2].data).forEach((key3) => {
            sum += data.items[key2].data[key3].value;
          });

          const tokens = data.items[key2].name.split(" ");
          let last = "0>>>";
          let n = 1;
          tokens.forEach((t) => {
            const ntk = n + t;
            tnodes.add(ntk);
            n++;

            if (last != null) links.push({ source: last, target: ntk, value: sum });
            last = ntk;
          });
        });
      }

      const nodes = [{ name: "", id: "0>>>" }];
      Array.from(tnodes).forEach((nt) => {
        nodes.push({ name: nt.substring(1), id: nt });
      });

      this.setChartHeight(nodes.length * 20);

      const unit = this.$store.state.vizOptionRelative ? this.$t("lbl_unit_tokenPPM") : this.$t("lbl_unit_token");

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
              allowOverlap: false,
            },
            links,
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
