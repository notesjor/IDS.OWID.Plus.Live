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
          renderer: "canvas",
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

        var availableDates = this.$store.state.owid.Dates;

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
            symbolSize: 1,
            line: { marker: { enable: false } },
          });
        }
        
        var unit = this.$store.state.vizOptionRelative
          ? " (pro Mio. Token)"
          : " (Token)";

        let myChartOption = {
          toolbox: {
            show: true,
            top: "3%",
            right: "10%",
            feature: {
              saveAsImage: {
                title: "Speichern \xa0 \xa0 \xa0 \xa0 \xa0",
                name: "OWIDplusLIVE"
              },
            },
          },
          animation: false,
          xAxis: {
            type: "category",
            data: availableDates,
          },
          yAxis: {
            type: "value",
            scale: true
          },
          series: series,
          dataZoom: [
            { type: "slider", show: true },
            { type: "inside", show: true },
          ],
          tooltip: {
            axisPointer: {
              snap: true,
              type: "cross",
            },
            formatter: function(params) {
              return (
                "<strong>" +
                params.seriesName +
                "</strong><br/>" +
                params.name +
                ": " +
                params.value
                  .toString()
                  .replace(",", "'")
                  .replace(".", ",") +
                unit
              );
            },
          },
        };
        this.$data.component.setOption(myChartOption);
      },
      {
        deep: true,
      }
    );
  },
};
</script>
