<template>
  <v-container>
    <v-expansion-panels :value="0">
      <v-expansion-panel>
        <v-expansion-panel-header class="justify-self-start">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-icon left>mdi-magnify</v-icon>
                <span>SUCHEN: Einfache Suche</span>
                <sup>
                  <v-icon left small style="margin-left:5px">
                    mdi-information-outline
                  </v-icon>
                </sup>
              </div>
            </template>
            <span>
              Die "Einfache Suche" nach N-Grammen umfasst folgende
              Funktionalitäten:
              <ul>
                <li>
                  <strong>Unterschiedliche N-Gramm-Längen von 1-3</strong>
                  <br />
                  z. B. N=1: Virus, N=2: zweite Welle, N=3: Bundeskanzlerin
                  Angela Merkel
                </li>
                <li>
                  <strong>Suche nach Grammen</strong> <br />
                  z. B. bayer (exakte Suche), bayer* (Prefix - z. B. bayern),
                  *bayer (Suffix - z. B. nordbayer) <br />
                  oder *bayer* (beliebige Position - z. B. nordbayern)
                </li>
                <li>
                  <strong>Verschiedene Annotationsebenen</strong> <br />
                  Wortform, Lemma oder POS (Part-of-Speech &rarr; Wortart).<br />
                  Bsp.: 2-Gram: ADJ* Merkel, 3-Gram: ART unglaublich NN
                </li>
              </ul>
              Hinweis: Abfragen und Ergebnisse werden immer zur Kleinschreibung
              reduziert.
            </span>
          </v-tooltip>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col>
              <h5>Suchfenstergröße:</h5>
              <v-tabs>
                <v-tab @click="search_simple_n_change(1)">
                  <span>N=1</span>
                </v-tab>
                <v-tab @click="search_simple_n_change(2)">
                  <span>N=2</span>
                </v-tab>
                <v-tab @click="search_simple_n_change(3)">
                  <span>N=3</span>
                </v-tab>

                <v-tab-item>
                  <v-card flat>
                    <v-row>
                      <v-col style="padding:0px; margin: 40px 0 -20px 15px">
                        <h5>Suchabfrage:</h5>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="2">
                        <v-overflow-btn
                          persistent-hint
                          :items="layer"
                          v-model="search_simple_1_layer"
                          label="Layer"
                        ></v-overflow-btn>
                      </v-col>
                      <v-col cols="10" style="margin-top:7px">
                        <v-text-field
                          label="Suchausdruck (einzelnes Token)..."
                          v-model="search_simple_1_value"
                          id="search_simple_1_1"
                          :rules="inputRules"
                          @keydown.enter="search_simple"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-row>
                      <v-col style="padding:0px; margin: 40px 0 -20px 15px">
                        <h5>Suchabfrage:</h5>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="2">
                        <v-overflow-btn
                          persistent-hint
                          :items="layer"
                          v-model="search_simple_1_layer"
                          label="Layer"
                        ></v-overflow-btn>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          label="Suchausdruck (an 1. Postion)..."
                          v-model="search_simple_1_value"
                          id="search_simple_2_1"
                          :rules="inputRules"
                          @keydown.enter="search_simple"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-overflow-btn
                          persistent-hint
                          :items="layer"
                          v-model="search_simple_2_layer"
                          label="Layer"
                        ></v-overflow-btn>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          label="Suchausdruck (an 2. Postion)..."
                          v-model="search_simple_2_value"
                          id="search_simple_2_2"
                          :rules="inputRules"
                          @keydown.enter="search_simple"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-row>
                      <v-col style="padding:0px; margin: 40px 0 -20px 15px">
                        <h5>Suchabfrage:</h5>
                      </v-col>
                    </v-row>
                    <v-row cols="27">
                      <v-col cols="2">
                        <v-overflow-btn
                          persistent-hint
                          :items="layer"
                          v-model="search_simple_1_layer"
                          label="Layer"
                        ></v-overflow-btn>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field
                          label="Suchausdruck (an 1. Postion)..."
                          v-model="search_simple_1_value"
                          id="search_simple_3_1"
                          :rules="inputRules"
                          @keydown.enter="search_simple"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-overflow-btn
                          persistent-hint
                          :items="layer"
                          v-model="search_simple_2_layer"
                          label="Layer"
                        ></v-overflow-btn>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field
                          label="Suchausdruck (an 2. Postion)..."
                          v-model="search_simple_2_value"
                          id="search_simple_3_2"
                          :rules="inputRules"
                          @keydown.enter="search_simple"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-overflow-btn
                          persistent-hint
                          :items="layer"
                          v-model="search_simple_3_layer"
                          label="Layer"
                        ></v-overflow-btn>
                      </v-col>
                      <v-col cols="2">
                        <v-text-field
                          label="Suchausdruck (an 3. Postion)..."
                          v-model="search_simple_3_value"
                          id="search_simple_3_3"
                          :rules="inputRules"
                          @keydown.enter="search_simple"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn block @click="search_simple">
                <v-icon>mdi-magnify</v-icon>Suche ausführen
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="justify-self-start">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-icon left>mdi-magnify</v-icon>
                <span>SUCHEN: Erweiterte Tiefen-Suche</span>
                <sup>
                  <v-icon left small style="margin-left:5px">
                    mdi-information-outline
                  </v-icon>
                </sup>
              </div>
            </template>
            <span>
              Die "Erweiterte Tiefen-Suche" bietet folgende Zusatzfunktionalität
              (Basis-Funktionen siehe: "Einfache Suche"):
              <ul>
                <li>
                  <strong
                    >Gleichzeitige Suche auf mehreren Annotationsebenen</strong
                  >
                  <br />
                  Wortform und/oder Lemma und/oder POS (Part-of-Speech &rarr;
                  Wortart).<br />
                  Bsp. 1.: 1-Gram: 1. Lemma = gut* &amp; 1. POS = ADJ*<br />
                  Bsp. 2.: 2-Gram: 1. Lemma = gefährlich &amp; 2. Lemma = Virus
                  &amp; 2. POS = NN
                </li>
              </ul>
              Hinweis: Abfragen und Ergebnisse werden immer zur Kleinschreibung
              reduziert.
            </span>
          </v-tooltip>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col>
              <h5>Suchfenstergröße:</h5>
              <v-tabs>
                <v-tab @click="search_complex_n_change(1)">
                  <span>N=1</span>
                </v-tab>
                <v-tab @click="search_complex_n_change(2)">
                  <span>N=2</span>
                </v-tab>
                <v-tab @click="search_complex_n_change(3)">
                  <span>N=3</span>
                </v-tab>

                <v-tab-item>
                  <v-card flat>
                    <v-row>
                      <v-col style="padding:0px; margin: 40px 0 -20px 15px">
                        <h5>Suchabfrage:</h5>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <p style="text-align:center">
                          (1. Position)
                        </p>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col style="margin-top:7px">
                        <v-text-field
                          label="Wortform"
                          id="search_complex_1_1_w"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col style="margin-top:7px">
                        <v-text-field
                          label="Lemma"
                          id="search_complex_1_1_l"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col style="margin-top:7px">
                        <v-text-field
                          label="POS-Tag"
                          id="search_complex_1_1_p"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-row>
                      <v-col style="padding:0px; margin: 40px 0 -20px 15px">
                        <h5>Suchabfrage:</h5>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <p style="text-align:center">
                          (1. Position)
                        </p>
                      </v-col>
                      <v-col>
                        <p style="text-align:center">
                          (2. Position)
                        </p>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          label="Wortform (1. Position)"
                          id="search_complex_2_1_w"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          label="Wortform (2. Position)"
                          id="search_complex_2_2_w"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          label="Lemma (1. Position)"
                          id="search_complex_2_1_l"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          label="Lemma (2. Position)"
                          id="search_complex_2_2_l"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          label="POS-Tag (1. Position)"
                          id="search_complex_2_1_p"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          label="POS-Tag (2. Position)"
                          id="search_complex_2_2_p"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-row>
                      <v-col style="padding:0px; margin: 40px 0 -20px 15px">
                        <h5>Suchabfrage:</h5>
                      </v-col>
                    </v-row>
                    <v-row cols="11">
                      <v-col>
                        <p style="text-align:center">
                          (1. Position)
                        </p>
                      </v-col>
                      <v-col>
                        <p style="text-align:center">
                          (2. Position)
                        </p>
                      </v-col>
                      <v-col>
                        <p style="text-align:center">
                          (3. Position)
                        </p>
                      </v-col>
                    </v-row>
                    <v-row cols="11">
                      <v-col>
                        <v-text-field
                          label="Wortform (1. Position)"
                          id="search_complex_3_1_w"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          label="Wortform (2. Position)"
                          id="search_complex_3_2_w"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          label="Wortform (3. Position)"
                          id="search_complex_3_3_w"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          label="Lemma (1. Position)"
                          id="search_complex_3_1_l"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          label="Lemma (2. Position)"
                          id="search_complex_3_2_l"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          label="Lemma (3. Position)"
                          id="search_complex_3_3_l"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          label="POS-Tag (1. Position)"
                          id="search_complex_3_1_p"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          label="POS-Tag (2. Position)"
                          id="search_complex_3_2_p"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          label="POS-Tag (3. Position)"
                          id="search_complex_3_3_p"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn block @click="search_complex">
                <v-icon>mdi-magnify</v-icon>Suche ausführen</v-btn
              >
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-overlay :value="progressWait">
      <div class="text-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <h3>Bitte warten...</h3>
        <h4>{{ progressMsg }}</h4>
        <v-btn @click="abortProgress">Abbrechen</v-btn>
      </div>
    </v-overlay>

    <v-snackbar v-model="snackbar">
      {{ progressError }}

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Ok
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mdiMagnifyPlus } from "@mdi/js";

var global_layers = ["Wortform", "Lemma", "POS"];
var config;

class queryItem {
  layer;
  position;
  token;

  toJSON() {
    return {
      layer: this.layer,
      position: this.position,
      token: this.token,
    };
  }

  static load(obj) {
    var res = new queryItem(obj.layer, obj.position, "", false);
    res.token = obj.token;
    return res;
  }

  constructor(layer, position, element, upperCase) {
    this.layer = layer;
    this.position = position;

    if (typeof element === "string")
      this.token = upperCase ? element.toUpperCase() : element.toLowerCase();
    else {
      element.value = upperCase
        ? element.value.toUpperCase()
        : element.value.toLowerCase();
      this.token = element.value;
    }
  }

  toString() {
    return (
      "[" +
      (this.position + 1) +
      ". " +
      global_layers[this.layer] +
      "] = " +
      this.token
    );
  }
}

async function sendSearchRequest(data, store, n, queryItems) {
  data.progressWait = true;
  data.progressMsg = "Suche N-Gramme";

  fetch(config.baseUrl + "/find", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      sessionKey: store.state.sessionKey,
    },
    body: JSON.stringify({ N: n, Items: queryItems }),
  })
    .then((resp) => {
      try {
        return resp.ok ? resp.json() : null;
      } catch {
        data.snackbar = true;
        data.progressError = "Keine Ergebnisse - Abfrage zu spezifisch.";
        data.progressWait = false;
        return null;
      }
    })
    .then((searchResult) => {
      if (
        searchResult === null ||
        searchResult.Items === null ||
        searchResult.Items.length === 0
      ) {
        data.snackbar = true;
        data.progressError = "Keine Ergebnisse - Abfrage zu spezifisch.";
        data.progressWait = false;
        return;
      }

      searchResult.Items = searchResult.Items.slice(i, 1000);

      var packageSize = 250;
      var result = {};
      var error = false;
      var done = 0;

      for (var i = 0; i < searchResult.Items.length; i += packageSize) {
        if (!data.progressWait) {
          error = true;
          break;
        }

        var request = searchResult.Items.slice(i, i + packageSize);

        fetch(config.baseUrl + "/pull", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ N: n, Items: request }),
        })
          .then((resp2) => {
            if (!resp2.ok) {
              error = true;
              return;
            }
            return resp2.json();
          })
          .then((page) => {
            if (page === null) return;
            if (error === true) return;
            if (!data.progressWait) {
              error = true;
              return;
            }

            if (page != null) {
              result = Object.assign({}, result, page);
            } else {
              error = true;
            }

            done += Object.keys(page).length;
            data.progressMsg = `Lade Zeitreihe(n): ${done} von ${searchResult.Items.length}`;

            if (done === searchResult.Items.length) {
              data.progressMsg = "Visualisiere die Daten";
              store.commit("search", {
                n: n,
                queryItems: queryItems,
                items: result,
              });
              store.state.vizNoCommit = 1;
              store.commit("calculate");
              data.progressWait = false;
            }
          });
      }

      if (error) if (!store.state.progressAbort) data.snackbar = true;
    });
}

export default {
  name: "Search",

  data: () => {
    return {
      layer: global_layers,
      search_simple_1_layer: "Wortform",
      search_simple_2_layer: "Wortform",
      search_simple_3_layer: "Wortform",
      search_simple_1_value: "",
      search_simple_2_value: "",
      search_simple_3_value: "",
      search_simple_n: 1,
      search_complex_n: 1,
      name: "world",
      snackbar: false,

      progressWait: false,
      progressMsg: "",
      progressError: "",

      iconSeachExt: mdiMagnifyPlus,
      inputRules: [
        (v) =>
          (v.toString().match("\\s") || []).length < 1 ||
          "Nur einzelne Token erlaubt!",
        (v) =>
          (v.toString().match("[\\*]") || []).length < 3 ||
          "Es sind maximal zwei *-Auslassungszeichen erlaubt!",
      ],
    };
  },
  mounted: function() {
    config = this.$config;
  },
  methods: {
    abortProgress: function() {
      this.$data.progressWait = false;
    },
    search_simple_n_change: function(n) {
      this.$data.search_simple_n = n;
      this.$store.commit("updateN", n);
    },
    search_complex_n_change: function(n) {
      this.$data.search_complex_n = n;
      this.$store.commit("updateN", n);
    },
    search_invoke: function(queries) {
      var set = new Set();
      var qs = [];
      queries.forEach((x) => {
        qs.push(queryItem.load(x));
        set.add(x.position);
      });

      sendSearchRequest(this.$data, this.$store, set.size, qs);
    },
    search_simple: function() {
      var queryItems = [
        new queryItem(
          this.$data.layer.indexOf(this.$data.search_simple_1_layer),
          0,
          this.$data.search_simple_1_value,
          this.$data.layer.indexOf(this.$data.search_simple_1_layer) === 2
        ),
      ];
      if (this.$data.search_simple_n > 1)
        queryItems.push(
          new queryItem(
            this.$data.layer.indexOf(this.$data.search_simple_2_layer),
            1,
            this.$data.search_simple_2_value,
            this.$data.layer.indexOf(this.$data.search_simple_2_layer) === 2
          )
        );
      if (this.$data.search_simple_n > 2)
        queryItems.push(
          new queryItem(
            this.$data.layer.indexOf(this.$data.search_simple_3_layer),
            2,
            this.$data.search_simple_3_value,
            this.$data.layer.indexOf(this.$data.search_simple_3_layer) === 2
          )
        );

      sendSearchRequest(
        this.$data,
        this.$store,
        this.$data.search_simple_n,
        queryItems
      );
    },
    search_complex: function() {
      var queryItems = [];
      if (this.$data.search_complex_n === 1) {
        queryItems = [
          new queryItem(0, 0, document.getElementById("search_complex_1_1_w")),
          new queryItem(1, 0, document.getElementById("search_complex_1_1_l")),
          new queryItem(
            2,
            0,
            document.getElementById("search_complex_1_1_p"),
            true
          ),
        ];
      } else if (this.$data.search_complex_n === 2) {
        queryItems = [
          new queryItem(0, 0, document.getElementById("search_complex_2_1_w")),
          new queryItem(1, 0, document.getElementById("search_complex_2_1_l")),
          new queryItem(
            2,
            0,
            document.getElementById("search_complex_2_1_p"),
            true
          ),
          new queryItem(0, 1, document.getElementById("search_complex_2_2_w")),
          new queryItem(1, 1, document.getElementById("search_complex_2_2_l")),
          new queryItem(
            2,
            1,
            document.getElementById("search_complex_2_2_p"),
            true
          ),
        ];
      } else if (this.$data.search_complex_n === 3) {
        queryItems = [
          new queryItem(0, 0, document.getElementById("search_complex_3_1_w")),
          new queryItem(1, 0, document.getElementById("search_complex_3_1_l")),
          new queryItem(
            2,
            0,
            document.getElementById("search_complex_3_1_p"),
            true
          ),
          new queryItem(0, 1, document.getElementById("search_complex_3_2_w")),
          new queryItem(1, 1, document.getElementById("search_complex_3_2_l")),
          new queryItem(
            2,
            1,
            document.getElementById("search_complex_3_2_p"),
            true
          ),
          new queryItem(0, 2, document.getElementById("search_complex_3_3_w")),
          new queryItem(1, 2, document.getElementById("search_complex_3_3_l")),
          new queryItem(
            2,
            2,
            document.getElementById("search_complex_3_3_p"),
            true
          ),
        ];
      }

      sendSearchRequest(
        this.$data,
        this.$store,
        this.$data.search_complex_n,
        queryItems
      );
    },
    validate_notEmpty: function(value) {
      return value === "" || value == "*"
        ? "Das Feld darf nicht leer sein."
        : true;
    },
  },
};
</script>
