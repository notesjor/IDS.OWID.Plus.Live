<template>
  <v-tabs vertical>
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

    <v-tab-item>
      <v-row>
        <v-col>
          <VizTimeChart></VizTimeChart>
        </v-col>
      </v-row>
    </v-tab-item>
    <v-tab-item>
      <v-row>
        <v-col>
          <VizCalendar></VizCalendar>
        </v-col>
      </v-row>
    </v-tab-item>
    <v-tab-item :eager="true">
      <v-row>
        <v-col>
          <VizBoxplot></VizBoxplot>
        </v-col>
      </v-row>
    </v-tab-item>
    <v-tab-item :eager="true">
      <v-row>
        <v-col>
          <VizSankey></VizSankey>
        </v-col>
      </v-row>
    </v-tab-item>
    <v-tab-item :eager="true">
      <v-row>
        <v-col>
          <VizBubble></VizBubble>
        </v-col>
      </v-row>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import VizTimeChart from "./visualizations/VizTimeChart";
import VizCalendar from "./visualizations/VizCalendar";
import VizBoxplot from "./visualizations/VizBoxplot";
import VizSankey from "./visualizations/VizSankey";
import VizBubble from "./visualizations/VizBubble";

export default {
  name: "VizPanel",
  theme: { dark: false },
  components: {
    VizTimeChart,
    VizCalendar,
    VizBoxplot,
    VizSankey,
    VizBubble,
  },
};
</script>
