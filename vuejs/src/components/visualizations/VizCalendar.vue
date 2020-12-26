<template>
  <div id="calendar" style="width: 100%; height: 68vh;">
    {{ update }}
  </div>
</template>

<script>
import * as echarts from "echarts";

var myCalendar;

export default {
  name: "VizCalendar",
  theme: { dark: false },
  computed: {
    update: {
      get() {
        if (this.$store.state.vizData === null) return;

        var calendar = document.getElementById("calendar");
        if (calendar != null) {
          try {
            myCalendar = echarts.init(calendar);
          } catch {
            // ignore
          }
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
        myCalendar.setOption(myCalendarOption);

        return "";
      },
    },
  },
  updated() {
    var calendar = document.getElementById("calendar");
    if (calendar === null) {
      this.$forceUpdate();
      calendar = document.getElementById("calendar");
    }
    console.log(calendar);
    if (calendar != null) {
      try {
        myCalendar = echarts.init(calendar);
      } catch {
        // ignore
      }
    }
  },
};
</script>
