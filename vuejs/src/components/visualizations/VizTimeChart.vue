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
        if (this.$store.vizData === null) return;

        // CHART
        var chart = document.getElementById("chart");
        if (chart != null) {
          try {
            var myChart = echarts.init(chart);
          } catch {
            // ignore
          }

          // easyFreq >>>
          // var dates = state.result[key];
          //
          //var norm = state.norm[state.currentN];
          //var spark = [];
          // var sparkNorm = [];
          //state.resultSeries = [
          //  {
          //    type: "line",
          //    data: sparkNorm,
          //    symbolSize: 10,
          //    line: { marker: { enable: false } },
          //    lineStyle: {
          //      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //        {
          //          offset: 0,
          //          color: "rgba(247, 32, 71)",
          //        },
          //        {
          //          offset: 0.5,
          //          color: "rgba(255, 210, 0)",
          //        },
          //        {
          //          offset: 1,
          //          color: "rgba(31, 234, 234)",
          //        },
          //      ]),
          //    },
          //  },
          //];
          // <<<

          let myChartOption = {
            xAxis: {
              type: "category",
              data: this.$store.state.dates.map((x) =>
                x.key.replace("T00:00:00", "")
              ),
            },
            yAxis: {
              type: "value",
            },
            series: this.$store.state.resultSeries,
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
        }

        return "";
      },
    },
  },
};
</script>
