<template>
  <v-card style="pagging-bottom:-15px">
    <v-card-title>
      <v-dialog v-model="dialog_help" width="600" scrollable>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on" style="float:right; display:block;">
            <v-icon>mdi-eye-outline</v-icon>
            <span style="margin-left:10px; font-size:15px">{{ $t("vizOptions_header") }}</span>
            <sup>
              <v-icon left small style="margin-left:5px">
                mdi-information-outline
              </v-icon>
            </sup>
          </div>
        </template>
        <v-card>
          <v-card-title class="headline grey lighten-2">
            {{ $t("vizOptions_help") }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <span>
              {{ $t("vizOptions_help_info") }}<br />
              <br />
              <ul>
                <li>
                  <strong>{{ $t("vizOption_name_frequency") }}</strong>
                  <br />
                  {{ $t("vizOption_name_frequency_info") }}
                </li>
                <li>
                  <strong>{{ $t("vizOption_name_granulation") }}</strong> <br />
                  {{ $t("vizOption_name_granulation_info") }}
                  <i>{{ $t("lbl_hint") }}:</i> {{ $t("vizOption_name_granulation_info_ext") }}
                </li>
                <li>
                  <strong>{{ $t("vizOption_name_smoothing") }}</strong> <br />
                  {{ $t("vizOption_name_smoothing_info") }}
                  <i>{{ $t("lbl_hint") }}:</i> {{ $t("vizOption_name_smoothing_info_ext") }}
                </li>
              </ul>
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
    </v-card-title>
    <v-container>
      <v-row>
        <v-col class="d-flex justify-left" style="margin-top:-30px; margin-bottom:10px">
          <v-switch
            v-model="relativeFrequency"
            :label="relativeFrequency ? $t('vizOption_name_frequency') : $t('vizOption_name_frequency_abs')"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-left">
          <label for="granulation" class="v-label theme--light" style="margin-top:-20px"
            >{{ $t("vizOption_name_granulation") }}:</label
          >
          <v-slider
            id="granulation"
            v-model="granulationValue"
            min="0"
            max="4"
            ticks="always"
            :tick-labels="granulationLabels"
            step="1"
            style="margin-left:10px; margin-top:-27px"
          ></v-slider>
        </v-col>
        <v-col class="d-flex justify-left">
          <label for="smooth" class="v-label theme--light" style="margin-top:-20px"
            >{{ $t("vizOption_name_smoothing") }}:</label
          >
          <v-slider
            id="smooth"
            v-model="smoothValue"
            min="1"
            thumb-label="always"
            :max="smoothMax"
            :tick-labels="smoothLabels"
            ticks="always"
            style="margin-left:10px; margin-top:-27px"
          ></v-slider>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
function commit() {
  var r = this.$data.relativeFrequency;
  var s = this.$data.smoothValue;
  var g = this.$data.granulationValue;

  switch (g) {
    case 1:
      this.$data.smoothMax = 52;
      this.$data.smoothLabels = [
        "1",
        "",
        "",
        "4",
        "",
        "",
        "",
        "8",
        "",
        "",
        "",
        "12",
        "",
        "",
        "",
        "16",
        "",
        "",
        "",
        "20",
        "",
        "",
        "",
        "24",
        "",
        "26",
        "",
        "28",
        "",
        "",
        "",
        "32",
        "",
        "",
        "",
        "36",
        "",
        "",
        "",
        "40",
        "",
        "",
        "",
        "44",
        "",
        "",
        "",
        "48",
        "",
        "",
        "",
        "52",
      ];
      break;
    case 2:
      this.$data.smoothMax = 24;
      this.$data.smoothLabels = [
        "1",
        "2",
        "",
        "4",
        "",
        "6",
        "",
        "8",
        "",
        "",
        "",
        "12",
        "",
        "",
        "",
        "16",
        "",
        "18",
        "",
        "20",
        "",
        "",
        "",
        "24",
      ];
      break;
    case 3:
      this.$data.smoothMax = 8;
      this.$data.smoothLabels = ["1", "2", "", "4", "", "6", "", "8"];
      break;
    case 4:
      this.$data.smoothMax = 10;
      this.$data.smoothLabels = ["1", "", "", "", "5", "", "", "", "", "10"];
      break;
    default:
      this.$data.smoothMax = 31;
      this.$data.smoothLabels = [
        "1",
        "",
        "",
        "",
        "",
        "",
        "7",
        "",
        "",
        "",
        "",
        "",
        "",
        "14",
        "",
        "",
        "",
        "",
        "",
        "",
        "21",
        "",
        "",
        "",
        "",
        "",
        "",
        "28",
        "",
        "",
        "31",
      ];
      break;
  }

  this.$store.commit("vizOption", { r, s, g });
  this.$store.commit("calculate");
}

export default {
  name: "VizOptions",
  created: function() {
    this.granulationLabels = [
      this.$t("granulation_lbl_day"),
      this.$t("granulation_lbl_week"),
      this.$t("granulation_lbl_month"),
      this.$t("granulation_lbl_quarter"),
      this.$t("granulation_lbl_year"),
    ];
  },
  mounted: function() {
    this.$data.relativeFrequency = this.$store.state.vizOptions.relativeFrequency;
    this.$data.smoothValue = this.$store.state.vizOptions.smoothValue;
    this.$data.granulationValue = this.$store.state.vizOptions.granulationValue;
  },
  data: () => {
    return {
      dialog_help: false,
      name: "world",
      relativeFrequency: true,
      smoothValue: 16,
      smoothMin: 1,
      smoothMax: 52,
      granulationValue: 1,
      granulationLabels: null,
      smoothLabels: [
        "1",
        "",
        "",
        "4",
        "",
        "",
        "",
        "8",
        "",
        "",
        "",
        "12",
        "",
        "",
        "",
        "16",
        "",
        "",
        "",
        "20",
        "",
        "",
        "",
        "24",
        "",
        "26",
        "",
        "28",
        "",
        "",
        "",
        "32",
        "",
        "",
        "",
        "36",
        "",
        "",
        "",
        "40",
        "",
        "",
        "",
        "44",
        "",
        "",
        "",
        "48",
        "",
        "",
        "",
        "52",
      ],
    };
  },
  watch: {
    relativeFrequency: commit,
    smoothValue: commit,
    granulationValue: commit,
  },
};
</script>
