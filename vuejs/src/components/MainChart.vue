<template>
  <v-carousel>
    <v-carousel-item>
      <v-container>
        <v-row>
          <v-col>
            <div
              id="chart"
              style="width: 110%; height: 68vh; margin: -50px 0px 0px -40px"
            ></div>
          </v-col>
        </v-row>
      </v-container>
    </v-carousel-item>
    <v-carousel-item>
      <v-container>
        <v-row>
          <v-col>
            <div style="color:black;"><p>Hello</p></div>
          </v-col>
        </v-row>
      </v-container>
    </v-carousel-item>
    <v-carousel-item>
      <h1 style="color:black;"> Hello Hello Hello Hello Hello</h1>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import * as echarts from "../assets/echarts.min.js";

export default {
  name: "MainChart",
  theme: { dark: false },
  mounted() {
    var chart = document.getElementById("chart");
    var myChart = echarts.init(chart);
    let option = {
      xAxis: {
        type: "category",
        data: this.$store.state.dates,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
        },
      ],
    };
    myChart.setOption(option);
  },
  data: () => {
    return {
      name: "world",
    };
  },
  // define methods under the `methods` object
  methods: {
    greet: function() {
      this.$store.commit("increment");
      alert("Hello " + this.$data + " (" + this.$store.state.count + ")!");
    },
  },
};
</script>
