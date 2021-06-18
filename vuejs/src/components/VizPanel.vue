<template>
  <div>
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
            HILFE: Verfügbare Visualisierungen
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <span>
              Folgende Visualisierungen können Sie nutzen - Je nach gewählter Visualisierung erhalten Sie andere
              Einblicke in die Daten:<br/> <br/>
              <ul>
                <li>
                  <strong><v-icon left>
                    mdi-chart-line
                  </v-icon>Zeitverlauf</strong>
                  <br />
                  Der Zeitverlauf erlaubt eine sehr übersichtliche Darstellung aller Daten.
                  Mehrere hintereinader gestellte Abfragen werden parallel visualisiert.
                  Dadurch lassen sich mehrere Abfragen im Zeitverlauf vergleichen.
                  Nutzen Sie die interaktiven Möglichkeiten (z. B. Zeitabschnitt wählen - unterhalb der Grafik).
                </li>
                <li>
                  <strong><v-icon left>
                    mdi-calendar-multiselect
                  </v-icon>Kalenderansicht</strong> <br />
                  Die Kalenderansicht bildet eine Summe alle Abfragen für den ausgewählten Zeitabschnitt (Granulierung).
                  Dadurch lassen sich 'Peeks' zu bestimmten Tagen besser optisch erfassen.
                  Nutzen Sie den Schieberegler, um die Daten einzugrenzen - z. B. um HOT/COLD-Spots zu identifizieren.
                </li>
                <li>
                  <strong><v-icon left>
                    mdi-view-dashboard-variant
                  </v-icon>Sankey-Varianten</strong> <br />
                  Die Sankey-Variante eignet sich insbesondere dann, wenn Sie an der Identifikation von Sprachgebrauchsmustern interessiert sind.
                  Je größer Knoten/Kanten dargestellt werden, desto häufiger ist das entsprechende Token (=Knoten - an der Position) bzw. der entsprechende Übergang (=Kanten - Relation zwischen zwei Token/Knoten).
                </li>
              </ul>
              <br/>
              <i>Hinweis:</i> Alle Visualisierungen sind interaktiv. Bewegen Sie die Maus über interessante Stellen in der Grafik, um Detailinformationen anzuzeigen.
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
    </div>
    <div>
      <div style="width=100%">
        <v-tabs vertical @change="tabChange">
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
                Zeitverlauf
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
                Kalenderansicht
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
                Sankey-Varianten
              </span>
            </v-tooltip>
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
          <v-tab-item>
            <v-row>
              <v-col>
                <VizSankey></VizSankey>
              </v-col>
            </v-row>
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
  data: function() {
    return {
      dialog_help: false,
    };
  },
  methods: {
    tabChange: function() {
      this.$forceUpdate();
    },
  },
};
</script>
