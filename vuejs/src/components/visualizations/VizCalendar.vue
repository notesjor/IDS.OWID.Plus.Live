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
  ></div>
</template>

<script>
import * as echarts from "echarts";

var monthMap = {
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
};

var dayMap = {
  firstDay: 1,
  nameMap: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
};

export default {
  name: "VizCalendar",
  theme: { dark: false },
  data() {
    return {
      component: null,
    };
  },
  created() {
    this.$store.watch(
      () => {
        return this.$store.state.version;
      },
      () => {
        if (this.$store.state.vizData === null) return;

        var component = document.getElementById("ecalendar");
        if (component != null && this.$data.component === null) {
          try {
            this.$data.component = echarts.init(component, null, {
              renderer: "canvas",
            });
          } catch {
            // ignore
          }
        }

        var tmp = {};
        Object.keys(this.$store.state.vizData).forEach((sK) => {
          Object.keys(this.$store.state.vizData[sK].data).forEach((d) => {
            this.$store.state.vizData[sK].data[d].dates.forEach((i) => {
              if (i in tmp) tmp[i] += parseFloat(this.$store.state.vizData[sK].data[d].value);
              else tmp[i] = parseFloat(this.$store.state.vizData[sK].data[d].value)
            });
          });
        });

        var res = [];
        Object.keys(tmp).forEach((k) => {
          res.push([k, tmp[k]]);
        });

        var unit = this.$store.state.vizOptionRelative
          ? " (pro Mio. Token)"
          : " (Token)";

        let myCalendarOption = {
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                title: "Speichern \xa0 \xa0 \xa0 \xa0 \xa0",
                name: "OWIDplusLIVE",
              },
            },
          },
          tooltip: {
            position: "top",
            formatter: function(params) {
              return (
                params.value[0] +
                ": " +
                params.value[1]
                  .toString()
                  .replace(",", "'")
                  .replace(".", ",") +
                unit
              );
            },
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
              dayLabel: dayMap,
              monthLabel: monthMap,
            },
            {
              range: "2021",
              cellSize: ["auto", 20],
              dayLabel: dayMap,
              monthLabel: monthMap,
              top: 250,
            },
          ],
          series: [
            {
              type: "heatmap",
              coordinateSystem: "calendar",
              calendarIndex: 0,
              data: res,
            },
            {
              type: "heatmap",
              coordinateSystem: "calendar",
              calendarIndex: 1,
              data: res,
            },
          ],
        };
        this.$data.component.setOption(myCalendarOption);
      },
      {
        deep: true,
      }
    );

    this.$store.commit("calculate");
  },
};
</script>
