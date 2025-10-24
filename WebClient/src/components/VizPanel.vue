<template>
  <div style="min-height:700px">
    <div style="display:block; position:relative; top:0px; left:-49.5%">
      <v-dialog v-model="dialog_help" width="600" scrollable>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <sup>
              <v-icon left small>
                mdi-information-outline
              </v-icon>
            </sup>
          </div>
        </template>
        <v-card>
          <v-card-title class="headline grey lighten-2">
            {{ $t("vizPanel_help") }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <span>
              {{ $t("vizPanel_help_info") }}<br />
              <br />
              <ul>
                <li>
                  <strong><v-icon left> mdi-chart-line </v-icon>{{ $t("viz_name_timechart") }}</strong>
                  <br />
                  {{ $t("viz_name_timechart_info") }}
                </li>
                <li>
                  <strong><v-icon left> mdi-calendar-multiselect </v-icon>{{ $t("viz_name_calendar") }}</strong>
                  <br />
                  {{ $t("viz_name_calendar_info") }}
                </li>
                <li>
                  <strong><v-icon left> mdi-view-dashboard-variant </v-icon>{{ $t("viz_name_sankey") }}</strong>
                  <br />
                  {{ $t("viz_name_sankey_info") }}
                </li>
              </ul>
              <br />
              <i>{{ $t("lbl_hint") }}:</i> {{ $t("vizPanel_help_additionalInfo") }}
            </span>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_help = false">
              {{ $t("lbl_closeWindow") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <div>
        <v-tabs vertical @change="tabChange" v-model="tab">
          <v-tab>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <v-icon left>
                    mdi-chart-line
                  </v-icon>
                </div>
              </template>
              <span>
                {{ $t("viz_name_timechart") }}
              </span>
            </v-tooltip>
          </v-tab>
          <v-tab>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <v-icon left>
                    mdi-calendar-multiselect
                  </v-icon>
                </div>
              </template>
              <span>
                {{ $t("viz_name_calendar") }}
              </span>
            </v-tooltip>
          </v-tab>
          <v-tab>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <v-icon left>
                    mdi-view-dashboard-variant
                  </v-icon>
                </div>
              </template>
              <span>
                {{ $t("viz_name_sankey") }}
              </span>
            </v-tooltip>
          </v-tab>
          <v-tab-item :transition="false">
            <VizTimeChart style="min-height:650px" :chartOptions="lineChart"></VizTimeChart>
          </v-tab-item>
          <v-tab-item :transition="false">
            <VizCalendar></VizCalendar>
          </v-tab-item>
          <v-tab-item :transition="false">
            <VizSankey></VizSankey>
          </v-tab-item>
        </v-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import VizTimeChart from "./visualizations/VizTimeChart";
import VizCalendar from "./visualizations/VizCalendar";
import VizSankey from "./visualizations/VizSankey";

export default {
  name: "VizPanel",
  theme: { dark: false },
  components: {
    VizTimeChart,
    VizCalendar,
    VizSankey,
  },
  data: function () {
    return {
      dialog_help: false,
      tab: 0,
      lineChart: null,
    };
  },
  mounted() {
    this.$store.commit("setVizCalcFunc", this.calcLineChart);
  },
  methods: {
    tabChange: function () {
      this.$store.commit("setVizCalcFunc", this.calcLineChart);
      this.$forceUpdate();
    },

    calcLineChart: function (vizData, availableDates) {
      console.log("Calculating Line Chart Data");
      if (vizData === null) return null;

      var series = [];

      for (const key in vizData) {
        if (key === "ALLE") continue;
        const data = vizData[key];

        var values = [];
        availableDates.forEach((c) => {
          values.push((c in data.data) ? data.data[c].value : 0);
        });

        series.push({
          name: data.name,
          type: "line",
          data: values,
          showSymbol: false,
          large: true,
          largeThreshold: 1000,
          sampling: "lttb",
          progressive: 250,
          progressiveThreshold: 1000,
          lineStyle: { width: 2 }
        });
      }

      var unit = this.$store.state.vizOptionRelative ? this.$t("lbl_unit_tokenPPM") : this.$t("lbl_unit_token");

      console.log("final");
      var res = Object.freeze({
        toolbox: {
          show: true,
          top: "3%",
          right: "10%",
          feature: {
            saveAsImage: {
              title: this.$t("lbl_save") + " \xa0 \xa0 \xa0 \xa0 \xa0",
              name: this.$t("lbl_export_fileName"),
            },
          },
        },
        animation: false,
        legend: {
          show: true,
        },
        xAxis: {
          type: "category",
          data: Object.freeze(availableDates),
        },
        yAxis: {
          type: "value",
          scale: true,
        },
        series: Object.freeze(series),
        dataZoom: [
          { type: "slider", show: true },
          { type: "inside", show: true },
        ],
        tooltip: {
          axisPointer: {
            snap: true,
            type: "cross",
          },
          formatter: function (params) {
            return (
              "<strong>" +
              params.seriesName +
              "</strong><br/>" +
              params.name +
              ": " +
              params.value
                .toString()
                .replace(",", "'")
                .replace(".", ",") +
              " " +
              unit
            );
          },
        },
      });
      console.log("apply");
      console.log(res);
      console.log(JSON.stringify(res));
      console.log("length: " + JSON.stringify(res).length);
      this.lineChart = res;
      console.log("done");
    }
  },
};
</script>
