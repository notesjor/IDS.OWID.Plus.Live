<template>
  <v-card style="pagging-bottom:-15px">
    <v-card-title>
      <v-dialog v-model="dialog_help" width="600" scrollable>
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on" style="float:right; display:block;">
            <v-icon>mdi-eye-outline</v-icon>
            <span style="margin-left:10px; font-size:15px">ANPASSEN: Einstellungen für Visualisierung ändern</span>
            <sup>
              <v-icon left small style="margin-left:5px">
                mdi-information-outline
              </v-icon>
            </sup>
          </div>
        </template>
        <v-card>
          <v-card-title class="headline grey lighten-2">
            HILFE: Einstellungen für Visualisierung ändern
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <span>
              In diesem Abschnitt können Sie folgenden Optionen ändern:<br/> <br/>
              <ul>
                <li>
                  <strong>Relative Frequenz</strong>
                  <br />
                  Die 'Relative Frequenz' ist in der Standardeinstellung immer aktiviert (blau - Punkt rechts). Bei
                  aktiver 'Relative Frequenz' wird die Frequenz in 'pro Millionen' angezeigt. Dabei bezieht sich die
                  'Relative Frequenz' immer auf die Summe aller 'N', die im gewählten Zeitabschnitt liegen (siehe
                  'Granulierung'). Bei deaktivierter 'Relative Frequenz' wird die absolute Frequenz angezeigt - gezählt
                  wird daher jedes Vorkommen von 'N' im Zeitabschnitt ohne Bezugsgröße.
                </li>
                <li>
                  <strong>Granulierung</strong> <br />
                  Die Granulierung gibt den Zeitabschnitt an, der zur Berechnung betrachtet und summiert wird.
                  <i>Hinweis:</i> Je nach Granulierung stehen unterschiedliche Glättungs-Einstellungen zur Verfügung
                  (siehe 'Glättung').
                </li>
                <li>
                  <strong>Glättung</strong> <br />
                  Wird ein Glättungswert größer 1 eingestellt, so werden die Daten mittels gleitendem Mittelwert
                  geglättet. Bei einem Wert von 1 wird keine Glättung vorgenommen.
                  <i>Hinweis:</i> Je nach Granulierung stehen unterschiedliche Glättungs-Einstellungen zur Verfügung
                  (siehe 'Granulierung'). Auf der Skala werden besonders markante Glättungswerte hervorgehoben.
                </li>
              </ul>
            </span>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_help = false">
              Fenster schließen
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
            :label="relativeFrequency ? 'Relative Frequenz' : 'Absolute Frequenz'"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-left">
          <label for="granulation" class="v-label theme--light" style="margin-top:-20px">Granulierung:</label>
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
          <label for="smooth" class="v-label theme--light" style="margin-top:-20px">Glättung:</label>
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

  data: () => {
    return {
      dialog_help: false,
      name: "world",
      relativeFrequency: true,
      smoothValue: 7,
      smoothMin: 1,
      smoothMax: 31,
      granulationValue: 0,
      granulationLabels: ["Tag", "Woche", "Monat", "Quartal", "Jahr"],
      smoothLabels: [
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
