<template>
  <div
    id="timechart"
    style="width: 110%; height: 68vh; margin:-20px 0px 0px -20px"
  ></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "VizTimeChart",
  theme: { dark: false },
  data() {
    return {
      component: null,
    };
  },
  mounted() {
    // VizTimeChart is the first Visualization, so the component must me initialized in mounted (otherwise in created > $store.watch)
    var component = document.getElementById("timechart");
    if (component != null) {
      try {
        this.$data.component = echarts.init(component, null, {
          renderer: "svg",
        });
      } catch {
        // ignore
      }
    }

    // init the Viewport - usefull for other visualizations
    this.$store.commit("updateViewport", {
      w: component.clientWidth,
      h: component.clientHeight,
    });
    this.$store.commit("calculate");
  },
  created() {
    this.$store.watch(
      () => {
        return this.$store.state.version;
      },
      () => {
        if (this.$store.state.vizData === null) return;

        var availableDates = new Set();

        Object.keys(this.$store.state.vizData["ALLE"].data).forEach((key) => {
          availableDates.add(key);
        });
        availableDates = Array.from(availableDates);
        availableDates.sort();

        var series = [];
        for (const key in this.$store.state.vizData) {
          if (key === "ALLE") continue;
          const data = this.$store.state.vizData[key];

          var values = [];
          availableDates.forEach((c) => {
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
          animation: false,
          xAxis: {
            type: "category",
            data: availableDates,
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
        this.$data.component.setOption(myChartOption);
        this.$store.commit("updateViewportId", "timechart");
      },
      {
        deep: true,
      }
    );
  },
};
</script>
