<template>
  <div
    id="boxplot"
    v-bind:style="
      'margin-left: -20px; min-width:' +
        this.$store.state.vizViewportWidth +
        'px; min-height:' +
        this.$store.state.vizViewportHeight +
        'px'
    "
  >
    {{ update }}
  </div>
</template>

<script>
import * as echarts from "echarts";
var boxplot;

export default {
  name: "VizCalendar",
  theme: { dark: false },
  computed: {
    update: {
      get() {
        if (this.$store.state.vizData === null) return;
        var component = document.getElementById("boxplot");
        if (component === null) return;
        try {
          boxplot = echarts.init(component);
        } catch {
          // ignore
        }

        var all = this.$store.state.vizData["ALLE"];
        var res = [];

        Object.keys(all).forEach((k) => {
          var entry = all[k];
          var dates = Array.from(entry.dates).sort();
          dates.forEach((d) => {
            res.push([d.substring(0, 10), entry.value]);
          });
        });

        //"upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR"
        let boxplotOption = {         
          dataset: [
            {
              source: [
                ['label',
                  960,
                  940,
                  960,
                  940,
                  880,
                  800,
                  850,
                  880,
                  900,
                  840,
                  830,
                  790,
                  810,
                  880,
                  880,
                  830,
                  800,
                  790,
                  760,
                  800,
                ],
                ['label2',
                  880,
                  880,
                  880,
                  860,
                  720,
                  720,
                  620,
                  860,
                  970,
                  950,
                  880,
                  910,
                  850,
                  870,
                  840,
                  840,
                  850,
                  840,
                  840,
                  840,
                ],
                ['label3',
                  890,
                  810,
                  810,
                  820,
                  800,
                  770,
                  760,
                  740,
                  750,
                  760,
                  910,
                  920,
                  890,
                  860,
                  880,
                  720,
                  840,
                  850,
                  850,
                  780,
                ],
                ['label4',
                  890,
                  840,
                  780,
                  810,
                  760,
                  810,
                  790,
                  810,
                  820,
                  850,
                  870,
                  870,
                  810,
                  740,
                  810,
                  940,
                  950,
                  800,
                  810,
                  870,
                ],
              ],
            },
            {
              transform: {
                type: "boxplot",
              },
            },
            {
              fromDatasetIndex: 1,
              fromTransformResult: 1,
            },
          ],
          tooltip: {
            trigger: "item",
            axisPointer: {
              type: "shadow",
            },
          },
          grid: {
            left: "10%",
            right: "10%",
            bottom: "15%",
          },
          xAxis: {
            type: "value",
          },
          yAxis: {
            type: "category",
            boundaryGap: true,
            nameGap: 0,
            splitArea: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          series: [
            {
              name: "Boxplot",
              type: "boxplot",
              datasetIndex: 2,
            },
            {
              name: "Ausreißer",
              type: "scatter",
              datasetIndex: 2,
            },
          ],
        };
        boxplot.setOption(boxplotOption);
        return "";
      },
    },
  },
};
</script>
