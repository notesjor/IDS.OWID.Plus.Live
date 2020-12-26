<template>
  <div
    id="ecalendar"
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
var ecalendar;

export default {
  name: "VizCalendar",
  theme: { dark: false },
  computed: {
    update: {
      get() {
        if (this.$store.state.vizData === null) return;
        var component = document.getElementById("ecalendar");
        if (component === null) return;
        try {
          ecalendar = echarts.init(component);
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

        let myCalendarOption = {
          tooltip: {
            position: "top",
          },
          visualMap: {
            min: Math.min(...res.map((o) => o[1]), 0),
            max: Math.max(...res.map((o) => o[1]), 0),
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
              dayLabel: {
                firstDay: 1,
                nameMap: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
              },
              monthLabel: {
                nameMap: [
                  "JAN",
                  "FEB",
                  "MÄR",
                  "APR",
                  "MAI",
                  "JUN",
                  "JUL",
                  "AUG",
                  "SEP",
                  "OKT",
                  "NOV",
                  "DEZ",
                ],
              },
            },
          ],
          series: [
            {
              type: "heatmap",
              coordinateSystem: "calendar",
              calendarIndex: 0,
              data: res,
            },
          ],
        };
        ecalendar.setOption(myCalendarOption);
        return "";
      },
    },
  },
};
</script>
