<template>
  <div id="timechart" style="width: 110%; height: 68vh; margin:0px 0px 0px 0px"></div>
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
            if (c in data.data) values.push(data.data[c]);
          });

          series.push({
            name: data.name,
            type: "line",
            data: values,
            symbolSize: 1,
            line: { marker: { enable: false } },
          });
        }

        var unit = this.$store.state.vizOptionRelative ? this.$t("lbl_unit_tokenPPM") : this.$t("lbl_unit_token");

        let myChartOption = {
          toolbox: {
            show: true,
            top: "3%",
            right: "10%",
            feature: {
              saveAsImage: {
                title: this.$t("lbl_save") + " \xa0 \xa0 \xa0 \xa0 \xa0",
                name: this.$t("lbl_export_fileName"),
              },
            },
          },
          animation: false,
          legend: {
            show: true,
          },
          xAxis: {
            type: "category",
            data: availableDates,
          },
          yAxis: {
            type: "value",
            scale: true,
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
                " " +
                unit
              );
            },
          },
        };

        this.$data.component.clear();
        this.$data.component.setOption(myChartOption);
      },
      {
        deep: true,
      }
    );
  },
};
</script>
