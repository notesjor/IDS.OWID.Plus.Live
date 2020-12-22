<template>
  <v-tabs vertical @change="updateViewport">
    <v-tab>
      <v-icon left>
        mdi-chart-line
      </v-icon>
    </v-tab>
    <v-tab>
      <v-icon left>
        mdi-calendar-multiselect
      </v-icon>
    </v-tab>
    <v-tab>
      <v-icon left>
        mdi-access-point
      </v-icon>
    </v-tab>
    <v-tab>
      <v-icon left>
        mdi-access-point
      </v-icon>
    </v-tab>

    <v-tab-item>
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
    </v-tab-item>
    <v-tab-item>
      <v-row>
        <v-col>
          <div
            id="calendar"
            style="width: 100%; height: 65vh; margin: -50px 0px 0px -40px"
          >
            {{ update }}
          </div>
        </v-col>
      </v-row>
    </v-tab-item>
    <v-tab-item>
      <v-card flat>
        <v-card-text>
          <p>
            Lorem IPSUM
          </p>
        </v-card-text>
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card flat>
        <v-card-text>
          <p>
            Lorem IPSUM
          </p>
        </v-card-text>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "MainChart",
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
        if (this.$store.state.dates === null) return;
        if (this.$store.state.resultSeries === null) return;

        // CHART
        var chart = document.getElementById("chart");
        if (chart != null) {
          try {
            var myChart = echarts.init(chart);
          } catch {
            // ignore
          }

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
                return params.name + ": " + params.value.toString().replace(".", ",") + " (pro Mio. Token)";
              },
            },
          };
          myChart.setOption(myChartOption);
        }

        // CALENDAR
        var calendar = document.getElementById("calendar");
        if (calendar != null) {
          try {
            var myCalendar = echarts.init(calendar);
          } catch {
            // ignore
          }

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
