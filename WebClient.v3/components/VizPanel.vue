<template>
  <v-btn @click="renderIt">RENDER</v-btn>
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
<VizTimeChart :config="$config" :api="api" style="min-height:650px;" ref="chartLine"></VizTimeChart>
<!--
        <v-tabs vertical @change="tabChange" v-model="tab">
          <v-tab value="line">
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
          <v-tab value="calendar">
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
          <v-tab value="sankey">
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

          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="line" style="background-color: red;">
              <VizTimeChart :config="$config" :api="api" style="min-height:650px" ref="chartLine"></VizTimeChart>
            </v-tabs-window-item>
            <v-tabs-window-item value="calendar">
              !-- TODO<VizCalendar :config="$config" :api="api"></VizCalendar>--
            </v-tabs-window-item>
            <v-tabs-window-item value="sankey">
              !-- TODO<VizSankey :config="$config" :api="api"></VizSankey>--
            </v-tabs-window-item>
          </v-tabs-window>
        </v-tabs>
      -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VizPanel",
  theme: { dark: false },
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
    api: {
      type: Object,
      default: () => ({}),
    },
  },
  data: function () {
    return {
      dialog_help: false,
      tab: "line",
    };
  },
  methods: {
    tabChange: function () {
      this.$forceUpdate();
    },
    renderIt: function () {
      console.log("RENDER IT");
      this.$refs.chartLine.updateChart();
    }
  },
};
</script>
