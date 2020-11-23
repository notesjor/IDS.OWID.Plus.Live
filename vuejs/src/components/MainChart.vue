<template>
  <v-theme-provider>
    <v-container>
      <v-row>
        <v-col>
          <div id="chart" style="width: 100vw; height: 100vh;"></div>
        </v-col>
      </v-row>
    </v-container>
  </v-theme-provider>
</template>

<script>
import * as echarts from "../assets/echarts.min.js";

export default {
  name: "MainChart",
  mounted() {
    var chart = document.getElementById("chart");
    var myChart = echarts.init(chart);
    console.log(chart);
    console.log(myChart);
    let option = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
