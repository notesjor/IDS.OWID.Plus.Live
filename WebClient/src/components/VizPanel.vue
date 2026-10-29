<template>
  <div style="min-height:700px">
    <div style="display:block; position:relative; top:0px; left:-49.5%">
      <v-dialog v-model="dialog_help" width="600" scrollable>
        <template v-slot:activator="{ props }">
          <div v-bind="props">
            <sup>
              <v-icon start small>
                mdi-information-outline
              </v-icon>
            </sup>
          </div>
        </template>
        <v-card>
          <v-card-title class="text-h5 bg-grey-lighten-2">
            {{ $t("vizPanel_help") }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <span>
              {{ $t("vizPanel_help_info") }}<br />
              <br />
              <ul>
                <li>
                  <strong><v-icon start> mdi-chart-line </v-icon>{{ $t("viz_name_timechart") }}</strong>
                  <br />
                  {{ $t("viz_name_timechart_info") }}
                </li>
                <li>
                  <strong><v-icon start> mdi-calendar-multiselect </v-icon>{{ $t("viz_name_calendar") }}</strong>
                  <br />
                  {{ $t("viz_name_calendar_info") }}
                </li>
                <li>
                  <strong><v-icon start> mdi-view-dashboard-variant </v-icon>{{ $t("viz_name_sankey") }}</strong>
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
            <v-btn color="primary" variant="text" @click="dialog_help = false">
              {{ $t("lbl_closeWindow") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <div>
        <div class="d-flex flex-row">
        <v-tabs v-model="tab" direction="vertical">
          <v-tab :value="0">
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <v-icon start>
                    mdi-chart-line
                  </v-icon>
                </div>
              </template>
              <span>
                {{ $t("viz_name_timechart") }}
              </span>
            </v-tooltip>
          </v-tab>
          <v-tab :value="1">
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <v-icon start>
                    mdi-calendar-multiselect
                  </v-icon>
                </div>
              </template>
              <span>
                {{ $t("viz_name_calendar") }}
              </span>
            </v-tooltip>
          </v-tab>
          <v-tab :value="2">
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <v-icon start>
                    mdi-view-dashboard-variant
                  </v-icon>
                </div>
              </template>
              <span>
                {{ $t("viz_name_sankey") }}
              </span>
            </v-tooltip>
          </v-tab>
        </v-tabs>
        <v-window v-model="tab" class="viz-window flex-grow-1" :touch="false" style="min-width:0">
          <v-window-item :value="0">
            <VizTimeChart style="height:650px"></VizTimeChart>
          </v-window-item>
          <v-window-item :value="1">
            <VizCalendar></VizCalendar>
          </v-window-item>
          <v-window-item :value="2">
            <VizSankey></VizSankey>
          </v-window-item>
        </v-window>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VizTimeChart from "./visualizations/VizTimeChart.vue";
import VizCalendar from "./visualizations/VizCalendar.vue";
import VizSankey from "./visualizations/VizSankey.vue";

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
    };
  },
};
</script>

<style>
.viz-window .v-window-x-transition-enter-active,
.viz-window .v-window-x-transition-leave-active,
.viz-window .v-window-x-reverse-transition-enter-active,
.viz-window .v-window-x-reverse-transition-leave-active {
  transition: none !important;
}
</style>
