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
              style="width: 110%; height: 68vh; margin: -50px 0px 0px -40px"
            ></div>
          </v-col>
        </v-row>
      </v-container>
    </v-carousel-item>
    <v-carousel-item>
      <h1 style="color:black;">Hello Hello Hello Hello Hello</h1>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import * as echarts from "../assets/echarts.min.js";

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
        myCalendar.setOption(myCalendarOption);

        return "";
      },
    },
  },
};
</script>
