<template>
  <v-carousel>
    <v-carousel-item>
      <v-container>
        <v-row>
          <v-col>
            <div
              id="chart"
              style="width: 110%; height: 68vh; margin: -50px 0px 0px -40px"
            >
              {{ update }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-carousel-item>
    <v-carousel-item>
      <v-container>
        <v-row>
          <v-col>
            <div
              id="calendar"
              style="width: 100%; height: 65vh; margin: -50px 0px 0px -40px"
            ></div>
          </v-col>
        </v-row>
      </v-container>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import * as echarts from  "echarts";

export default {
  name: "MainChart",
  theme: { dark: false },
  computed: {
    update: {
      get() {
        if (this.$store.state.dates === null) return;
        if (this.$store.state.resultSeries === null) return;

        // CHART
        var chart = document.getElementById("chart");
        var myChart = echarts.init(chart);

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
        };
        myChart.setOption(myChartOption);

        // CALENDAR
        var calendar = document.getElementById("calendar");        
        var myCalendar = echarts.init(calendar);

        let myCalendarOption = {
          tooltip: {
            position: "top",
          },
          visualMap: {
            min: Math.min(...this.$store.state.resultCalendar.map(o => o[1]), 0),
            max: Math.max(...this.$store.state.resultCalendar.map(o => o[1]), 0),
            calculable: true,
            orient: "horizontal",
            left: "center",
            top: "bottom",
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
          ]
        };
        myCalendar.setOption(myCalendarOption);

        return "";
      },
    },
  },
};
</script>
