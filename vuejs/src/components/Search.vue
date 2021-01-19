<template>
  <v-expansion-panels :value="0">
    <v-expansion-panel>
      <v-expansion-panel-header class="justify-self-start">
        <div>
          <v-icon left>search</v-icon><span>SUCHEN: Einfache Suche</span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col>
            <v-tabs>
              <v-tab @click="search_simple_n_change(1)">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">N=1</span>
                  </template>
                  <span>
                    <strong>Hinweis: </strong>N=1 erlaubt es, nach einzelnen
                    Token (Layer: Wortform, Lemma oder POS) zu suchen.<br />
                    <strong>Beispiele: </strong>Wortform = berlin | Lemma = sein
                    | POS = ADJA | Wortform = *bayer* | POS = N* | Lemma =
                    *stadt
                  </span>
                </v-tooltip>
              </v-tab>
              <v-tab @click="search_simple_n_change(2)">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">N=2</span>
                  </template>
                  <span>
                    <strong>Hinweis: </strong>N=2 erlaubt es, nach zwei direkt
                    aufeinanderfolgende Token (Layer: Wortform, Lemma oder POS)
                    zu suchen.<br />
                    <strong>Beispiele: </strong>1. Wortform = angela &amp; 2.
                    Wortform = merkel | 1. POS = ADJA &amp; 2. Lemma = lockdown
                    | 1. Lemma = *präsident &amp; 2. POS = N*
                  </span>
                </v-tooltip>
              </v-tab>
              <v-tab @click="search_simple_n_change(3)">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">N=3</span>
                  </template>
                  <span>
                    <strong>Hinweis: </strong>N=3 erlaubt es, nach drei direkt
                    aufeinanderfolgende Token (Layer: Wortform, Lemma oder POS)
                    zu suchen. Dabei kann die mittlere Position auch leer
                    gelassen werden.<br />
                    <strong>Beispiele: </strong>1. Wortform = sowohl &amp; 2.
                    LEER &amp; 3. Wortform = auch | 1. POS = ADJA &amp; 2. Lemma
                    = angela &amp; Lemma = merkel*
                  </span>
                </v-tooltip>
              </v-tab>

              <v-tab-item>
                <v-card flat>
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
                        label="Suchausdruck..."
                        v-model="search_simple_1_value"
                        id="search_simple_1_1"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
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
                        label="Suchausdruck..."
                        v-model="search_simple_1_value"
                        id="search_simple_2_1"
                        :rules="inputRules"
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
                        label="Suchausdruck..."
                        v-model="search_simple_2_value"
                        id="search_simple_2_2"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
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
                        label="Suchausdruck..."
                        v-model="search_simple_1_value"
                        id="search_simple_3_1"
                        :rules="inputRules"
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
                        label="Suchausdruck..."
                        v-model="search_simple_2_value"
                        id="search_simple_3_2"
                        :rules="inputRules"
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
                        label="Suchausdruck..."
                        v-model="search_simple_3_value"
                        id="search_simple_3_3"
                        :rules="inputRules"
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
              <v-icon>search</v-icon>Suche ausführen
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header class="justify-self-start">
        <div>
          <v-icon left>search</v-icon
          ><span>SUCHEN: Erweiterte Tiefen-Suche</span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col>
            <v-tabs>
              <v-tab @click="search_complex_n_change(1)">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">N=1</span>
                  </template>
                  <span>
                    <strong>Hinweis: </strong>N=1 erlaubt es, nach einzelnen
                    Token (Layer: Wortform, Lemma oder POS) zu suchen.<br />
                    <strong>Beispiele: </strong>Wortform = berlin | Lemma = sein
                    | POS = ADJA | Wortform = *bayer* | POS = N* | Lemma =
                    *stadt
                  </span>
                </v-tooltip>
              </v-tab>
              <v-tab @click="search_complex_n_change(2)">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">N=2</span>
                  </template>
                  <span>
                    <strong>Hinweis: </strong>N=2 erlaubt es, nach zwei direkt
                    aufeinanderfolgende Token (Layer: Wortform, Lemma oder POS)
                    zu suchen.<br />
                    <strong>Beispiele: </strong>1. Wortform = angela &amp; 2.
                    Wortform = merkel | 1. POS = ADJA &amp; 2. Lemma = lockdown
                    | 1. Lemma = *präsident &amp; 2. POS = N*
                  </span>
                </v-tooltip>
              </v-tab>
              <v-tab @click="search_complex_n_change(3)">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">N=3</span>
                  </template>
                  <span>
                    <strong>Hinweis: </strong>N=3 erlaubt es, nach drei direkt
                    aufeinanderfolgende Token (Layer: Wortform, Lemma oder POS)
                    zu suchen. Dabei kann die mittlere Position auch leer
                    gelassen werden.<br />
                    <strong>Beispiele: </strong>1. Wortform = sowohl &amp; 2.
                    LEER &amp; 3. Wortform = auch | 1. POS = ADJA &amp; 2. Lemma
                    = angela &amp; Lemma = merkel*
                  </span>
                </v-tooltip>
              </v-tab>

              <v-tab-item>
                <v-card flat>
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
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col style="margin-top:7px">
                      <v-text-field
                        label="Lemma"
                        id="search_complex_1_1_l"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col style="margin-top:7px">
                      <v-text-field
                        label="POS-Tag"
                        id="search_complex_1_1_p"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
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
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Wortform (2. Position)"
                        id="search_complex_2_2_w"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        label="Lemma (1. Position)"
                        id="search_complex_2_1_l"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Lemma (2. Position)"
                        id="search_complex_2_2_l"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        label="POS-Tag (1. Position)"
                        id="search_complex_2_1_p"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="POS-Tag (2. Position)"
                        id="search_complex_2_2_p"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
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
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Wortform (2. Position)"
                        id="search_complex_3_2_w"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Wortform (3. Position)"
                        id="search_complex_3_3_w"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        label="Lemma (1. Position)"
                        id="search_complex_3_1_l"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Lemma (2. Position)"
                        id="search_complex_3_2_l"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Lemma (3. Position)"
                        id="search_complex_3_3_l"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        label="POS-Tag (1. Position)"
                        id="search_complex_3_1_p"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="POS-Tag (2. Position)"
                        id="search_complex_3_2_p"
                        :rules="inputRules"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="POS-Tag (3. Position)"
                        id="search_complex_3_3_p"
                        :rules="inputRules"
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
              <v-icon>search</v-icon>Suchen
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mdiMagnifyPlus } from "@mdi/js";

var global_layers = ["Wortform", "Lemma", "POS"];

class queryItem {
  layer;
  position;
  token;

  toJSON(){
    return {
      layer: this.layer,
      position: this.position,
      token: this.token
    }
  }

  constructor(layer, position, element, upperCase) {
    this.layer = layer;
    this.position = position;

    if (typeof element === "string")
      this.token = upperCase
        ? element.toUpperCase()
        : element.toLowerCase();
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

function sendSearchRequest(store, n, queryItems) {
  store.commit("updateStatus", "pending");
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      var xhr2 = new XMLHttpRequest();
      xhr2.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
          store.commit("search", {
            n: n,
            queryItems: queryItems,
            items: JSON.parse(this.responseText),
          });
          store.commit("calculate");
          store.commit("updateStatus", "success");
        }
      });

      xhr2.open("POST", store.state.baseUrl + "/pull");
      xhr2.setRequestHeader("Content-Type", "application/json");

      xhr2.send(this.responseText);
    }
  });
  
  xhr.open("POST", store.state.baseUrl + "/find");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("sessionKey", store.state.sessionKey);

  xhr.send(
    JSON.stringify({
      N: n,
      Items: queryItems,
    })
  );
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

      iconSeachExt: mdiMagnifyPlus,
      inputRules : [
        v => (v.toString().match("\\s") || []).length < 1 || "Nur einzelne Token erlaubt!",
        v => (v.toString().match("[\\*]") || []).length < 3 || "Es sind maximal zwei *-Auslassungszeichen erlaubt!"
      ]
    };
  },
  methods: {
    search_simple_n_change: function(n) {
      this.$data.search_simple_n = n;
      this.$store.commit("updateN", n);
    },
    search_complex_n_change: function(n) {
      this.$data.search_complex_n = n;
      this.$store.commit("updateN", n);
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

      sendSearchRequest(this.$store, this.$data.search_simple_n, queryItems);
    },
    search_complex: function() {
      var queryItems = [];
      if (this.$data.search_complex_n === 1) {
        queryItems = [
          new queryItem(0, 0, document.getElementById("search_complex_1_1_w")),
          new queryItem(1, 0, document.getElementById("search_complex_1_1_l")),
          new queryItem(2, 0, document.getElementById("search_complex_1_1_p"), true),
        ];
      } else if (this.$data.search_complex_n === 2) {
        queryItems = [
          new queryItem(0, 0, document.getElementById("search_complex_2_1_w")),
          new queryItem(1, 0, document.getElementById("search_complex_2_1_l")),
          new queryItem(2, 0, document.getElementById("search_complex_2_1_p"), true),
          new queryItem(0, 1, document.getElementById("search_complex_2_2_w")),
          new queryItem(1, 1, document.getElementById("search_complex_2_2_l")),
          new queryItem(2, 1, document.getElementById("search_complex_2_2_p"), true),
        ];
      } else if (this.$data.search_complex_n === 3) {
        queryItems = [
          new queryItem(0, 0, document.getElementById("search_complex_3_1_w")),
          new queryItem(1, 0, document.getElementById("search_complex_3_1_l")),
          new queryItem(2, 0, document.getElementById("search_complex_3_1_p"), true),
          new queryItem(0, 1, document.getElementById("search_complex_3_2_w")),
          new queryItem(1, 1, document.getElementById("search_complex_3_2_l")),
          new queryItem(2, 1, document.getElementById("search_complex_3_2_p"), true),
          new queryItem(0, 2, document.getElementById("search_complex_3_3_w")),
          new queryItem(1, 2, document.getElementById("search_complex_3_3_l")),
          new queryItem(2, 2, document.getElementById("search_complex_3_3_p"), true),
        ];
      }

      sendSearchRequest(this.$store, this.$data.search_complex_n, queryItems);
    },
    validate_notEmpty: function(value) {
      return value === "" || value == "*"
        ? "Das Feld darf nicht leer sein."
        : true;
    },
  },
};
</script>
