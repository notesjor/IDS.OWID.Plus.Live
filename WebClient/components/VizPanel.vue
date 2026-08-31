<template>
  <div style="min-height:700px">
    <div style="display:block; position:relative; top:0px; left:-49.5%">
      <v-dialog v-model="dialog_help" width="600" scrollable>
        <template v-slot:activator="{ props }">
          <div v-bind="props">
            <sup>
              <v-icon left small>mdi-information-outline</v-icon>
            </sup>
          </div>
        </template>
        <v-card>
          <v-card-title class="headline grey lighten-2">
            {{ $t('vizPanel_help') }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <ul>
              <li><strong><v-icon left>mdi-chart-line</v-icon>{{ $t('viz_name_timechart') }}</strong></li>
              <li><strong><v-icon left>mdi-calendar-multiselect</v-icon>{{ $t('viz_name_calendar') }}</strong></li>
              <li><strong><v-icon left>mdi-view-dashboard-variant</v-icon>{{ $t('viz_name_sankey') }}</strong></li>
            </ul>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_help = false">{{ $t('lbl_closeWindow') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-tabs vertical>
      <v-tab>
        <v-icon left>mdi-chart-line</v-icon>
      </v-tab>
      <v-tab>
        <v-icon left>mdi-calendar-multiselect</v-icon>
      </v-tab>
      <v-tab>
        <v-icon left>mdi-view-dashboard-variant</v-icon>
      </v-tab>

      <v-tab-item :transition="false">
        <VizTimeChart style="min-height:650px" />
      </v-tab-item>
      <v-tab-item :transition="false">
        <VizCalendar />
      </v-tab-item>
      <v-tab-item :transition="false">
        <VizSankey />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import VizTimeChart from './visualizations/VizTimeChart'
import VizCalendar from './visualizations/VizCalendar'
import VizSankey from './visualizations/VizSankey'

export default {
  name: 'VizPanel',
  components: { VizTimeChart, VizCalendar, VizSankey },
  data() {
    return {
      dialog_help: false,
    }
  },
  methods: {
    tabChange() {
      this.$forceUpdate()
    },
  },
}
</script>
