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
  name: "VizCalendar",
  theme: { dark: false },
  methods: {
    updateViewport: function() {
      this.$store.commit("calculate");
      this.$forceUpdate();
    },
  },
  computed: {
    update: {
      get() {
        if (this.$store.vizData === null) return;

        var calendar = document.getElementById("calendar");
        if (calendar != null) {
          try {
            var myCalendar = echarts.init(calendar);
          } catch {
            // ignore
          }

          //var dates = state.result[key];
          //
          //var norm = state.norm[state.currentN];
          //var spark = [];
          //var sparkNorm = [];
          //
          //// easyCal
          //var easyCal = [];
          //
          //for (var i in norm) {
          //  var n = norm[i];
          //  var v = i in dates ? dates[i] : 0;
          //  spark.push(v);
          //  sparkNorm.push(Math.round((v / n) * 1000000.0));
          //
          //  // easyCal >>>
          //  easyCal.push([
          //    i.replace("T00:00:00", ""),
          //    Math.round((v / n) * 1000000.0),
          //  ]);
          //  // <<<
          //}
          //
          //state.resultCalendar = easyCal; // easyCal

          let myCalendarOption = {
            tooltip: {
              position: "top",
            },
            visualMap: {
              min: Math.min(
                ...this.$store.state.resultCalendar.map((o) => o[1]),
                0
              ),
              max: Math.max(
                ...this.$store.state.resultCalendar.map((o) => o[1]),
                0
              ),
              calculable: true,
              orient: "horizontal",
              left: "center",
              top: "bottom",
              inRange: {
                color: ["#1feaea", "#ffd200", "#f72047"],
              },
            },
            calendar: [
              {
                range: "2020",
                cellSize: ["auto", 20],
              },
            ],
            series: [
              {
                type: "heatmap",
                coordinateSystem: "calendar",
                calendarIndex: 0,
                data: this.$store.state.resultCalendar,
              },
            ],
          };
          myCalendar.setOption(myCalendarOption);
        }

        return "";
      },
    },
  },
};
</script>
