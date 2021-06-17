<template>
  <v-tabs vertical @change="tabChange">
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
        mdi-view-dashboard-variant
      </v-icon>
    </v-tab>
    <!--
    <v-tab>
      <v-icon left>
        mdi-distribute-vertical-center
      </v-icon>
    </v-tab>
    <v-tab>
      <v-icon left>
        mdi-chart-bubble
      </v-icon>
    </v-tab>
    -->

    <v-tab-item>
      <v-row>
        <v-col>
          <VizTimeChart style="z-index:100"></VizTimeChart>
        </v-col>
      </v-row>
    </v-tab-item>
    <v-tab-item>
      <v-row>
        <v-col>
          <VizCalendar style="z-index:100"></VizCalendar>
        </v-col>
      </v-row>
    </v-tab-item>
    <v-tab-item>
      <v-row>
        <v-col>
          <VizSankey style="z-index:100"></VizSankey>
        </v-col>
      </v-row>
    </v-tab-item>
    <!--
    <v-tab-item>
      <v-row>
        <v-col>
          <VizBoxplot></VizBoxplot>
        </v-col>
      </v-row>
    </v-tab-item>
    <v-tab-item>
      <v-row>
        <v-col>
          <VizBubble></VizBubble>
        </v-col>
      </v-row>
    </v-tab-item>
    -->
  </v-tabs>
</template>

<script>
import VizTimeChart from "./visualizations/VizTimeChart";
import VizCalendar from "./visualizations/VizCalendar";
import VizSankey from "./visualizations/VizSankey";
//import VizBoxplot from "./visualizations/VizBoxplot";
//import VizBubble from "./visualizations/VizBubble";

export default {
  name: "VizPanel",
  theme: { dark: false },
  components: {
    VizTimeChart,
    VizCalendar,
    VizSankey,
    //VizBoxplot,    
    //VizBubble,
  },
  methods:{
    tabChange: function(){
      this.$forceUpdate();
    }
  }
};
</script>
