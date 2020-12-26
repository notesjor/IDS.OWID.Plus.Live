<template>
  <div
    id="chart"
    style="width: 110%; height: 68vh; margin: -50px 0px 0px -40px"
  >
    {{ update }}
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "VizTimeChart",
  theme: { dark: false },
  computed: {
    update: {
      get() {
        if (this.$store.state.vizData === null) return;
        
        var chart = document.getElementById("chart");
        if (chart != null) {
          try {
            var myChart = echarts.init(chart);
          } catch {
            // ignore
          }
        }

        var categories = new Set();

        Object.keys(this.$store.state.vizData["ALLE"]).forEach((key) => {
          categories.add(key);
        });
        categories = Array.from(categories);
        categories.sort();

        var series = [];
        for (const key in this.$store.state.vizData) {
          if (key === "ALLE") continue;
          const data = this.$store.state.vizData[key];

          var values = [];
          categories.forEach(c => {
            values.push(c in data.data ? data.data[c] : 0);
          });

          series.push({
            name: data.name,
            type: "line",
            data: values,
            symbolSize: 10,
            line: { marker: { enable: false } },
            lineStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(247, 32, 71)",
                },
                {
                  offset: 0.5,
                  color: "rgba(255, 210, 0)",
                },
                {
                  offset: 1,
                  color: "rgba(31, 234, 234)",
                },
              ]),
            },
          });
        }

        let myChartOption = {
          xAxis: {
            type: "category",
            data: categories,
          },
          yAxis: {
            type: "value",
          },
          series: series,
          dataZoom: [
            { type: "slider", show: true },
            { type: "inside", show: true },
          ],
          tooltip: {
            axisPointer: {
              type: "cross",
            },
            formatter: function(params) {
              return (
                params.name +
                ": " +
                params.value.toString().replace(".", ",") +
                " (pro Mio. Token)"
              );
            },
          },
        };
        myChart.setOption(myChartOption);

        return "";
      },
    },
  },
};
</script>
